import { createOrderApi } from "../api/billing.api";

export default function Pricing() {
  const handleBuy = async () => {
    const response = await createOrderApi(49900);
    console.log("Razorpay order:", response.data.data);
    alert("Order created. Next step: Razorpay checkout frontend integration.");
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-3">Simple pricing</h1>
      <p className="text-center text-slate-500 mb-10">Start free and upgrade when needed</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-3xl p-8 bg-white">
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="text-slate-500 mb-6">For getting started</p>
          <p className="text-4xl font-bold mb-6">₹0</p>
          <ul className="space-y-3 text-sm text-slate-600 mb-8">
            <li>Basic problem access</li>
            <li>Limited AI hints</li>
            <li>Basic dashboard</li>
          </ul>
          <button className="w-full rounded-xl border py-3">Current Plan</button>
        </div>

        <div className="border rounded-3xl p-8 bg-slate-900 text-white">
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <p className="text-slate-300 mb-6">For serious interview prep</p>
          <p className="text-4xl font-bold mb-6">₹499/mo</p>
          <ul className="space-y-3 text-sm text-slate-200 mb-8">
            <li>All problems</li>
            <li>Advanced AI hints</li>
            <li>Premium roadmaps</li>
            <li>Contest access</li>
          </ul>
          <button
            onClick={handleBuy}
            className="w-full rounded-xl bg-white text-slate-900 py-3 font-semibold"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}