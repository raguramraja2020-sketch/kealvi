import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("polls")
      .insert([{ question }])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}