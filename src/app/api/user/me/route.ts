import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await User.findOne({ email: session.user.email }).lean();

  return NextResponse.json({ user }, { status: 200 });
}
