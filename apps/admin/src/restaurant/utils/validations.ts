import { z } from "zod";

// I want to make that at lease on field should be there
export const updateRestaurantSchema = z
  .object({
    image: z.string().url(),
    name: z.string().max(100),
    description: z.string().max(1000),
    address: z.string(),
    email: z.string().email(),
    phone: z.string(),
    acceptsReservations: z.boolean(),
    googleMapLink: z.string().optional(),
    website: z.string().optional(),
  })
  .partial();

export const createTableSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  capacity: z.string().refine((val) => parseInt(val) > 0, {
    message: "Capacity should be greater than 0",
  }),
  status: z.enum(["AVAILABLE", "RESERVED", "OCCUPIED"]).default("AVAILABLE"),
});
