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

    if (
      !boutiqueNom ||
      !adminNom ||
      !email ||
      !password ||
      typeof boutiqueNom !== "string" ||
      typeof adminNom !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const cleanBoutiqueNom = boutiqueNom.trim().slice(0, 120);
    const cleanAdminNom = adminNom.trim().slice(0, 120);
    if (!cleanBoutiqueNom || !cleanAdminNom) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const boutique = await prisma.boutique.create({
      data: {
        nom: cleanBoutiqueNom,
        ville: typeof ville === "string" && ville.trim() ? ville.trim().slice(0, 80) : null,
        telephone:
          typeof telephone === "string" && telephone.trim()
            ? telephone.trim().slice(0, 30)
            : null,
      },
    });

    const user = await prisma.user.create({
      data: {
        boutiqueId: boutique.id,
        nom: cleanAdminNom,
        email: normalizedEmail,
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
