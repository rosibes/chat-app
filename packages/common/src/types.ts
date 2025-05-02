import { z } from "zod"

export const CreateUserSchema = z.object({
    username: z.string().min(6).max(20),
    password: z.string().min(8),
    name: z.string().min(6)
})

export const SignInSchema = z.object({
    username: z.string().min(6).max(20),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})