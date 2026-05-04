import { NextResponse } from "next/server";
import { startListener } from "@/lib/listener";

let started = false;

export async function GET() {
  if (!started) {
    startListener();
    started = true;
  }

  return NextResponse.json({ status: "listener running" });
}