import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth";
import { isRateLimited, resetRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // Les emails sont stockés en minuscules (voir register). On normalise
    // aussi ici pour que la casse saisie à la connexion n'empêche jamais
    // de retrouver le compte.
    const normalizedEmail = email.trim().toLowerCase();

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `${ip}:${normalizedEmail}`;
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives. Réessayez dans quelques minutes.",
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    resetRateLimit(rateLimitKey);

    createSessionCookie({
      userId: user.id,
      boutiqueId: user.boutiqueId,
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
