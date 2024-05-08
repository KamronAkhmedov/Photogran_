import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, { message: 'Too short' }),
  username: z.string().min(2, { message: 'Too short' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

export const PostSchema = z.object({
  caption: z.string().min(2).max(1200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(50),
  tags: z.string()
})

export const ProfileSchema = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email(),
  bio: z.string(),
})