import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ THIS LINE FIXES IT

export async function GET() {
  try {
    const whales = await prisma.whaleTransaction.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({ whales });
  } catch (err) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: "failed to fetch whales" },
      { status: 500 }
    );
  }
}