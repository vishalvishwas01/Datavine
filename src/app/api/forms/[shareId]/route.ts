import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    await dbConnect();

    const { shareId } = await params; // ✅ await because Next.js dynamic params are async

    // 🔍 Find the form by shareId (NOT _id)
    const form = await Form.findOne({ shareId });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ form }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shared form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
