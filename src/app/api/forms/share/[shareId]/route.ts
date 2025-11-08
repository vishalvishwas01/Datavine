import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shareId: string }> } // ✅ make params awaitable
) {
  try {
    await dbConnect();

    const { shareId } = await params; // ✅ await params

    // ✅ Lookup form by shareId instead of _id
    const form = await Form.findOne({ shareId }).lean();

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ form }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shared form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
