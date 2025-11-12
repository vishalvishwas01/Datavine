import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    
    const forms = await Form.find({
      userEmail: session.user.email,
    })
      .select("formId shareId")
      .lean();

    return NextResponse.json({ forms });
  } catch (error) {
    console.error("GET /api/forms/all error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
