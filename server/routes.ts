import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSquareCustomerSchema } from "@shared/schema";
import { SquareClient, SquareEnvironment } from "square";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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
      
      // Check if customer already exists
      const existing = await storage.getSquareCustomerByFirebaseUid(validatedData.firebaseUid);
      if (existing) {
        return res.json(existing);
      }
      
      const customer = await storage.createSquareCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating Square customer:", error);
      res.status(400).json({ error: "Failed to create customer" });
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
      const squareClient = new SquareClient({
        token: process.env.SQUARE_ACCESS_TOKEN,
        environment: process.env.SQUARE_ACCESS_TOKEN.startsWith('sandbox-') 
          ? SquareEnvironment.Sandbox 
          : SquareEnvironment.Production,
      });

      // Get customer's Square ID if they have one
      let customerId: string | undefined;
      if (firebaseUid) {
        try {
          const customer = await storage.getSquareCustomerByFirebaseUid(firebaseUid);
          customerId = customer?.squareCustomerId;
        } catch (error) {
          console.log("Could not find Square customer ID:", error);
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
