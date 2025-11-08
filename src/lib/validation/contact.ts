import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  company: z.string().max(120).optional(),
  subject: z.string().max(160).optional(),
  message: z.string().min(10, "Please provide a bit more detail"),
});

export type ContactPayload = z.infer<typeof contactSchema>;
