// utils/payments.ts (client)
export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function startPayment(userId: string) {
  const res = await fetch("/api/payments/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!data.order) throw new Error(data.error || "No order created");

  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error("Razorpay SDK failed to load");

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    // expose only key_id on client
    amount: data.order.amount,
    currency: data.order.currency,
    name: "Your App Name",
    description: "Unlock analytics and downloads",
    order_id: data.order.id,
    handler: async function (response: any) {
      // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
      // call server to verify and mark user premium
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...response,
          userId,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.ok) {
        // success: update client state (refetch user) to unlock UI
        // you might show toast here
        window.location.reload(); // simple: refresh so server-protected routes update
      } else {
        alert("Payment verification failed");
      }
    },
    prefill: {
      email: "", // if you have user's email prefills help
    },
    theme: {
      color: "#3b82f6",
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
