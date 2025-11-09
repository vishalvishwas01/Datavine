import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";
import { UserData } from "@/models/UserData";

export async function DELETE(req: Request, { params }: { params: { shareId: string } }) {
  try {
    await dbConnect();
    const { shareId } = params;

    // Delete form
    const formDeleted = await Form.deleteOne({ shareId });

    // Delete related responses
    const responsesDeleted = await UserData.deleteMany({ shareId });

    return NextResponse.json({
      success: true,
      message: "Form and responses deleted successfully",
      formDeletedCount: formDeleted.deletedCount,
      responsesDeletedCount: responsesDeleted.deletedCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
