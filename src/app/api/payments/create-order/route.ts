import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status?: string;
};

const razor = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await dbConnect();

    const amount = 199 * 100;

    const order = (await razor.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: true,
    })) as RazorpayOrder;

    await User.findByIdAndUpdate(userId, {
      $push: { payments: { razorpayOrderId: order.id, amount } },
    });

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Razorpay Create Order Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
