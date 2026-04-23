import { useEffect, useState } from "react";
import axios from "axios";

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/subscription").then((res) => setPlans(res.data));
  }, []);

  const buyPlan = async (planId: string) => {
    const { data } = await axios.post("/api/subscription/create-order", { planId });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,
      handler: async (response: any) => {
        await axios.post("/api/subscription/verify", {
          ...response,
          planId,
        });
        alert("Payment Success");
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan._id} className="p-6 rounded-xl border shadow-lg">
          <h2 className="text-xl font-bold">{plan.name}</h2>
          <p>₹{plan.price}</p>
          <ul>
            {plan.features.map((f: string) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button onClick={() => buyPlan(plan._id)}>Buy</button>
        </div>
      ))}
    </div>
  );
}