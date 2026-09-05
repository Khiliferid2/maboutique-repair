import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(`register:${ip}`)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans quelques minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { boutiqueNom, ville, telephone, adminNom, email, password } = body;

    if (!boutiqueNom || !adminNom || !email || !password) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const boutique = await prisma.boutique.create({
      data: {
        nom: boutiqueNom,
        ville: ville || null,
        telephone: telephone || null,
      },
    });

    const user = await prisma.user.create({
      data: {
        boutiqueId: boutique.id,
        nom: adminNom,
        email,
        password: hashed,
        role: "admin",
      },
    });

    createSessionCookie({
      userId: user.id,
      boutiqueId: boutique.id,
      nom: user.nom,
      email: user.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}
