import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'specialty' | 'custom';
}

export interface PizzaSize {
  id: string;
  name: string;
  size: string;
  servings: string;
  price: number;
}

export interface PizzaCrust {
  id: string;
  name: string;
  description: string;
}

export interface PizzaSauce {
  id: string;
  name: string;
  description: string;
}

export interface PizzaTopping {
  id: string;
  name: string;
  category: 'meat' | 'veggie' | 'cheese' | 'other';
  price: number;
}

export interface CustomPizza {
  size: PizzaSize | null;
  crust: PizzaCrust | null;
  sauce: PizzaSauce | null;
  toppings: PizzaTopping[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
}

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
  customizations?: {
    crust?: string;
    sauce?: string;
    cheese?: string;
    toppings?: string[];
  };
}

export type DeliveryMethod = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'card';

export interface DeliveryAddress {
  street: string;
  city: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: DeliveryAddress;
  pickupLocation?: Location;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
}
