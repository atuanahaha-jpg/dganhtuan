import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  username: z.string().trim().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128)
});

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(3000).optional().default(""),
  altText: z.string().trim().min(1).max(300),
  imageUrl: z.string().url(),
  tags: z.array(z.string().trim().min(1).max(32)).max(10).default([]),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).default("PUBLIC")
});

export const commentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().optional()
});
