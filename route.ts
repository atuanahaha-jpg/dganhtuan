import { NextResponse } from "next/server";
import argon2 from "argon2";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Enter a valid name, username, email, and password of at least 10 characters." } }, { status: 400 });
  const data = parsed.data;
  const email = data.email.toLowerCase();
  const username = data.username.toLowerCase();
  const exists = await db.user.findFirst({ where: { OR: [{ email }, { username }] }, select: { id: true } });
  if (exists) return NextResponse.json({ error: { code: "ACCOUNT_EXISTS", message: "That email or username is already in use." } }, { status: 409 });
  const passwordHash = await argon2.hash(data.password, { type: argon2.argon2id });
  const user = await db.user.create({ data: { name: data.name, username, email, passwordHash }, select: { id: true } });
  return NextResponse.json({ data: { id: user.id } }, { status: 201 });
}
