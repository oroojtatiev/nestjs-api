import {z} from 'zod'

export const authSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required()

export type Login = z.infer<typeof authSchema>