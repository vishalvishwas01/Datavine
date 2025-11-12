import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";
import { UserData } from "@/models/UserData";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ shareId: string }> }
) {
  try {
    await dbConnect();

    const { shareId } = await context.params;
    const { responses } = await req.json();

    const form = await Form.findOne({ shareId });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const responsesWithQuestions = form.fields.map((field: any) => ({
      question: field.heading,
      answer: responses[field.id] ?? "",
    }));

    const newEntry = new UserData({
      ownerEmail: form.userEmail,
      shareId,
      formId: form.formId,
      responses: responsesWithQuestions,
      submittedAt: new Date(),
    });

    await newEntry.save();

    return NextResponse.json({ message: "Response submitted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
