import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Form } from "@/models/Form";
import { UserData } from "@/models/UserData";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ shareId: string }> } 
) {
  try {
    await dbConnect();

    const { shareId } = await context.params; 

    
    const formDeleted = await Form.deleteOne({ shareId });

    
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
