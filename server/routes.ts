import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSquareCustomerSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
