import { z } from "zod";

export const exampleFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  name: z.string().min(2, "Name must be at least 2 characters.")
});

export type ExampleFormValues = z.infer<typeof exampleFormSchema>;


