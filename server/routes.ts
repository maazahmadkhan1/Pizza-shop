import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSquareCustomerSchema } from "@shared/schema";
import { SquareClient, SquareEnvironment } from "square";
import { randomUUID } from "crypto";
import { z } from "zod";

function getSquareClient() {
  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
    throw new Error("Square credentials not configured");
  }

  return new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ACCESS_TOKEN.startsWith('sandbox-') 
      ? SquareEnvironment.Sandbox 
      : SquareEnvironment.Production,
  });
}

async function findOrCreateSquareCustomer(firebaseUid: string, email: string, name: string) {
  const existing = await storage.getSquareCustomerByFirebaseUid(firebaseUid);
  if (existing) {
    console.log(`Found existing customer in storage: ${existing.squareCustomerId}`);
    return existing;
  }

  const squareClient = getSquareClient();

  const searchResponse = await squareClient.customers.search({
    query: {
      filter: {
        emailAddress: {
          exact: email,
        },
      },
    },
  });

  let squareCustomerId: string;

  if (searchResponse.customers && searchResponse.customers.length > 0) {
    squareCustomerId = searchResponse.customers[0].id!;
    console.log(`Found existing Square customer: ${squareCustomerId}`);
  } else {
    const createResponse = await squareClient.customers.create({
      idempotencyKey: firebaseUid,
      emailAddress: email,
      givenName: name || email.split('@')[0],
    });

    if (!createResponse.customer?.id) {
      throw new Error("Failed to create Square customer");
    }

    squareCustomerId = createResponse.customer.id;
    console.log(`Created new Square customer: ${squareCustomerId}`);
  }

  try {
    const customer = await storage.createSquareCustomer({
      firebaseUid,
      squareCustomerId,
      email,
      name: name || email.split('@')[0],
    });

    return customer;
  } catch (error: any) {
    console.log(`Storage insert failed (likely duplicate), re-fetching: ${error.message}`);
    const refetched = await storage.getSquareCustomerByFirebaseUid(firebaseUid);
    if (refetched) {
      return refetched;
    }
    throw new Error(`Failed to create or retrieve customer: ${error.message}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get Square customer by Firebase UID
  app.get("/api/square-customer/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const customer = await storage.getSquareCustomerByFirebaseUid(firebaseUid);
      
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      console.error("Error fetching Square customer:", error);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  // Create Square customer
  app.post("/api/square-customer", async (req, res) => {
    try {
      const validatedData = insertSquareCustomerSchema.parse(req.body);
      
      const customer = await findOrCreateSquareCustomer(
        validatedData.firebaseUid,
        validatedData.email,
        validatedData.name
      );
      
      res.status(201).json(customer);
    } catch (error: any) {
      console.error("Error creating Square customer:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Invalid request data",
          message: error.errors?.[0]?.message || "Validation failed"
        });
      }
      
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return res.status(400).json({ 
          error: "Square API error",
          message: error.message || "Failed to create customer in Square"
        });
      }
      
      res.status(500).json({ 
        error: "Failed to create customer",
        message: error.message || "Unknown error"
      });
    }
  });

  // Get Square products from catalog
  app.get("/api/products", async (req, res) => {
    try {
      if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
        console.error("Square credentials not configured");
        return res.status(500).json({ 
          success: false,
          error: "Square credentials not configured"
        });
      }

      const squareClient = getSquareClient();
      const products: any[] = [];
      let cursor: string | undefined;

      do {
        const response = await squareClient.catalog.listCatalog({
          types: 'ITEM',
          cursor,
        });

        if (response.result.objects) {
          for (const obj of response.result.objects) {
            if (obj.type === 'ITEM' && obj.itemData) {
              const itemData = obj.itemData;
              const variations: any[] = [];

              if (itemData.variations) {
                for (const variation of itemData.variations) {
                  if (variation.itemVariationData && variation.itemVariationData.priceMoney) {
                    const priceMoney = variation.itemVariationData.priceMoney;
                    variations.push({
                      id: variation.id || '',
                      name: variation.itemVariationData.name || itemData.name || '',
                      price: priceMoney.amount ? Number(priceMoney.amount) / 100 : 0,
                      currency: priceMoney.currency || 'USD',
                    });
                  }
                }
              }

              if (variations.length > 0) {
                products.push({
                  id: obj.id || '',
                  name: itemData.name || '',
                  description: itemData.description || '',
                  category: itemData.categoryId ? 'Pizza' : 'General',
                  image: '',
                  variations,
                });
              }
            }
          }
        }

        cursor = response.result.cursor;
      } while (cursor);

      res.json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error: any) {
      console.error("Error fetching Square products:", error);
      
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return res.status(400).json({ 
          success: false,
          error: "Square API error",
          message: error.message || "Failed to fetch products from Square"
        });
      }

      res.status(500).json({ 
        success: false,
        error: "Failed to fetch products",
        message: error.message || "Unknown error"
      });
    }
  });

  // Process Square payment
  app.post("/api/square-payment", async (req, res) => {
    try {
      // Validate required environment variables
      if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
        console.error("Square credentials not configured");
        return res.status(500).json({ 
          error: "Payment system not configured",
          message: "Square credentials are missing. Please contact support."
        });
      }

      // Validate request body with Zod
      const paymentRequestSchema = z.object({
        sourceId: z.string().min(1, "Payment source ID is required"),
        items: z.array(z.object({
          id: z.string(),
          variationId: z.string().optional(),
          quantity: z.number().int().positive(),
        })).min(1, "Cart must have at least one item"),
        deliveryMethod: z.enum(['pickup', 'delivery']),
        firebaseUid: z.string().optional(),
      });

      const validatedData = paymentRequestSchema.parse(req.body);
      const { sourceId, items, deliveryMethod, firebaseUid } = validatedData;

      // Fetch authoritative pricing from Firebase (NEVER trust client prices)
      const FIREBASE_PRODUCTS_URL = 'https://us-central1-pizza-shop-3afe9.cloudfunctions.net/getSquareProducts';
      let productsResponse;
      try {
        const response = await fetch(FIREBASE_PRODUCTS_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch product catalog');
        }
        productsResponse = await response.json();
      } catch (error) {
        console.error('Error fetching product catalog:', error);
        return res.status(500).json({ 
          error: "Unable to verify pricing",
          message: "Product catalog unavailable. Please try again later."
        });
      }

      const products = productsResponse.products || [];
      
      // Calculate total using authoritative server-side prices
      // Note: Firebase catalog stores prices as dollars (e.g., 17.99)
      // We need to work in cents throughout to avoid floating point issues
      let subtotalCents = 0;
      
      for (const item of items) {
        // Find the variation across all products
        // Cart item.id is actually the variation ID
        let foundVariation = null;
        let foundProduct = null;
        
        for (const product of products) {
          const variation = product.variations.find((v: any) => v.id === item.id);
          if (variation) {
            foundVariation = variation;
            foundProduct = product;
            break;
          }
        }
        
        if (!foundVariation || !foundProduct) {
          return res.status(400).json({ 
            error: "Invalid product",
            message: `Product variation ${item.id} not found in catalog`
          });
        }
        
        // Convert price to cents and multiply by quantity
        // foundVariation.price is in dollars (e.g., 17.99)
        const priceInCents = Math.round(foundVariation.price * 100);
        subtotalCents += priceInCents * item.quantity;
      }

      // Add delivery fee in cents
      const deliveryFeeCents = deliveryMethod === 'delivery' ? 599 : 0;  // $5.99 = 599 cents
      const amountInCents = subtotalCents + deliveryFeeCents;

      if (amountInCents <= 0) {
        return res.status(400).json({ error: "Invalid order total" });
      }

      // Initialize Square client
      const squareClient = getSquareClient();

      // Ensure customer exists in Square (defensive provisioning)
      let customerId: string | undefined;
      if (firebaseUid) {
        try {
          const customer = await storage.getSquareCustomerByFirebaseUid(firebaseUid);
          customerId = customer?.squareCustomerId;
        } catch (error) {
          console.log("Could not find Square customer ID, will create on-demand:", error);
        }
      }

      // Create payment
      const paymentResponse = await squareClient.payments.create({
        sourceId,
        amountMoney: {
          amount: BigInt(amountInCents),
          currency: 'USD',
        },
        locationId: process.env.SQUARE_LOCATION_ID,
        idempotencyKey: randomUUID(),
        ...(customerId && { customerId }),
      });

      res.json({
        success: true,
        paymentId: paymentResponse.payment?.id,
        status: paymentResponse.payment?.status,
        amount: amountInCents / 100, // Return amount in dollars for display
      });
    } catch (error: any) {
      console.error("Square payment error:", error);
      
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: "Invalid payment request",
          message: error.errors[0]?.message || "Invalid request data"
        });
      }
      
      res.status(500).json({ 
        error: "Payment processing failed",
        message: error.message || "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
