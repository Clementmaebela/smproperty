import { z } from "zod";

export const PropertySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required"),
  size: z.string().min(1, "Size is required"),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  type: z.enum(["Farm", "Plot", "House", "Smallholding"]),
  image: z.string().url("Image must be a valid URL"),
  featured: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  yearBuilt: z.number().optional(),
  parking: z.number().optional(),
  amenities: z.array(z.string()).default([]),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type Property = z.infer<typeof PropertySchema>;

export const CreatePropertySchema = PropertySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const UpdatePropertySchema = CreatePropertySchema.partial();

export type CreateProperty = z.infer<typeof CreatePropertySchema>;
export type UpdateProperty = z.infer<typeof UpdatePropertySchema>;
