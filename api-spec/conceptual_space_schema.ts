import { z } from "zod";

export const transformSchema = z.object({
  type: z.enum(["linear", "power", "logarithmic", "piecewise"]),
  params: z.record(z.number()).optional(),
});

export const dimensionSchema = z.object({
  name: z.string(),
  min: z.number(),
  max: z.number(),
  transform: transformSchema.optional(),
});

export const conceptualSpaceSchema = z.object({
  dimensions: z.array(dimensionSchema),
});

export type Transform = z.infer<typeof transformSchema>;
export type Dimension = z.infer<typeof dimensionSchema>;
export type ConceptualSpace = z.infer<typeof conceptualSpaceSchema>;

// Example: LAB color space with transforms
export const labExample: ConceptualSpace = {
  dimensions: [
    {
      name: "L",
      min: 0,
      max: 100,
      transform: {
        type: "power",
        params: { scale: 116, exponent: 1/3, offset: -16 },
      },
    },
    {
      name: "a",
      min: -128,
      max: 127,
      transform: {
        type: "linear",
        params: { scale: 1, offset: 0 },
      },
    },
    {
      name: "b",
      min: -128,
      max: 127,
      transform: {
        type: "linear",
        params: { scale: 1, offset: 0 },
      },
    },
  ],
};
