import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";
import { UserData } from "@/models/UserData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, context: { params: { formId: string } }) {
  try {
    await dbConnect();

    const { params } = context;
    const { formId } = await params; // ✅ FIX HERE

    const { responses } = await req.json();

    const form = await Form.findOne({ formId }).lean();
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const structuredResponses = form.fields.map((field: any) => ({
      question: field.heading,
      answer: responses[field.id] ?? "",
    }));

    await UserData.create({
      ownerEmail: form.userEmail,
      shareId: form.shareId,
      formId,
      responses: structuredResponses,
      respondentEmail: null,
    });

    return NextResponse.json({ message: "Response submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Submit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ responses: [] });

    const { formId } = params;

    const form = await Form.findOne({
      formId,
      userEmail: session.user.email,
    }).lean();
    if (!form) return NextResponse.json({ responses: [] });

    const responses = await UserData.find({ shareId: form.shareId }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ responses });

    return NextResponse.json({ responses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
