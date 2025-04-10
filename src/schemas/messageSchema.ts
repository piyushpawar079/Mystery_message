import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, 'Content must be of atleast 10 char')
        .max(300, 'Content must be of atmost 300 char')
})