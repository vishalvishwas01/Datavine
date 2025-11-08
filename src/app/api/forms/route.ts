import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get("formId");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const form = await Form.findOne({
      formId,
      userEmail: session.user.email,
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // ✅ Extract headLine and description from formData
    let headLine = "";
    let description = "";

    if (form.formData && form.formData.length > 0) {
      headLine = form.formData[0].headLine || "";
      description = form.formData[0].description || "";
    }

    // ✅ Return both: flattened data (for preview) + full form (for main builder)
    return NextResponse.json({
      headLine,
      description,
      fields: form.fields || [],
      formData: form.formData || [],
      formId: form.formId,
      _id: form._id,
      userEmail: form.userEmail,
    });
  } catch (error) {
    console.error("GET /api/forms error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { formId, fields, formData } = body;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updateObject: any = {
      formId,
      userEmail: session.user.email,
    };

    // ✅ Save both fields and formData
    if (fields) updateObject.fields = fields;
    if (formData) updateObject.formData = formData;

    const form = await Form.findOneAndUpdate(
      { formId, userEmail: session.user.email },
      { $set: updateObject },
      { new: true, upsert: true }
    );

    return NextResponse.json(form);
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
