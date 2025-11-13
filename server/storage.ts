import { type User, type InsertUser, type SquareCustomer, type InsertSquareCustomer } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSquareCustomerByFirebaseUid(firebaseUid: string): Promise<SquareCustomer | undefined>;
  createSquareCustomer(customer: InsertSquareCustomer): Promise<SquareCustomer>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private squareCustomers: Map<string, SquareCustomer>;

  constructor() {
    this.users = new Map();
    this.squareCustomers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSquareCustomerByFirebaseUid(firebaseUid: string): Promise<SquareCustomer | undefined> {
    return Array.from(this.squareCustomers.values()).find(
      (customer) => customer.firebaseUid === firebaseUid,
    );
  }

  async createSquareCustomer(insertCustomer: InsertSquareCustomer): Promise<SquareCustomer> {
    const id = randomUUID();
    const customer: SquareCustomer = { ...insertCustomer, id };
    this.squareCustomers.set(id, customer);
    return customer;
  }
}

export const storage = new MemStorage();
