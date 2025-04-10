import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, 'Username must be atleast of 2 char')
    .max(20, 'Username must be atmost of 20 char')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email.'}),
    password: z.string().min(6, { message: 'Password must be of atleast 6 char'})
})


