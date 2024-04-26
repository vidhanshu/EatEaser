import { z } from "zod";

export const createCategorySchema = z.object({
  image: z.string().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
});
export const createAddOnSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(3).max(100),
  price: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Price should be greater than 0",
  }),
  description: z.string().max(1000).optional(),
});
export const createMenuSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  price: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Price should be greater than 0",
  }),
  image: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isVegan: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  moreInfo: z.array(
    z.object({
      label: z.string().min(1).max(100),
      value: z.string().min(3).max(500),
    })
  ),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  // Array of addon ids
  addOns: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});
