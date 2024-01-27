import {z} from 'zod'

export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    username: z.string(),
  })
  .required()

export type CreateUser = z.infer<typeof createUserSchema>

export type User = {
  id: number
  email: string
  password?: string
  username: string
}