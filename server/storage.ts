import { type User, type InsertUser, type SquareCustomer, type InsertSquareCustomer, users, squareCustomers } from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSquareCustomerByFirebaseUid(firebaseUid: string): Promise<SquareCustomer | undefined>;
  createSquareCustomer(customer: InsertSquareCustomer): Promise<SquareCustomer>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getSquareCustomerByFirebaseUid(firebaseUid: string): Promise<SquareCustomer | undefined> {
    const result = await db.select().from(squareCustomers).where(eq(squareCustomers.firebaseUid, firebaseUid));
    return result[0];
  }

  async createSquareCustomer(insertCustomer: InsertSquareCustomer): Promise<SquareCustomer> {
    if (!insertCustomer.squareCustomerId) {
      throw new Error("squareCustomerId is required");
    }
    
    const result = await db.insert(squareCustomers).values({
      firebaseUid: insertCustomer.firebaseUid,
      squareCustomerId: insertCustomer.squareCustomerId,
      email: insertCustomer.email,
      name: insertCustomer.name,
    }).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
