import { NextResponse } from "next/server";

import { getLatestVercelDeployment } from "@/lib/integrations/vercel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const deployment = await getLatestVercelDeployment();

  if (!deployment) {
    return NextResponse.json(
      {
        message: "Deployment data unavailable",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ deployment });
}

