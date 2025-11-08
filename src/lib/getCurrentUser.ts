import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {dbConnect} from "./dbConnect";
import {User} from "@/models/User";

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();
  return user;
}
