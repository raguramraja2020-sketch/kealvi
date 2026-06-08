import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest
) {
  const body = await request.json();

  const { optionId, voterId } = body;

  const { error } = await supabase
    .from("votes")
    .insert([
      {
        option_id: optionId,
        voter_id: voterId,
      },
    ]);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}