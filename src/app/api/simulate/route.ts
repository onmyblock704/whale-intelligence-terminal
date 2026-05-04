import { prisma } from "@/lib/prisma";

function generateFakeWhale() {
  const eth = Math.random() * 500 + 10;

  return {
    hash: `0x${Math.random().toString(16).substring(2, 66)}`,
    from: `0x${Math.random().toString(16).substring(2, 42)}`,
    to: `0x${Math.random().toString(16).substring(2, 42)}`,
    value: (eth * 1e18).toString(),
    blockNumber: Math.floor(Math.random() * 9999999),
  };
}

export async function GET() {
  try {
    const whale = generateFakeWhale();

    await prisma.whaleTransaction.create({
      data: {
        ...whale,
        to: whale.to ?? "0xUnknown", // safety
      },
    });

    return Response.json({ whale });
  } catch (err) {
    console.error("Simulation error:", err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}