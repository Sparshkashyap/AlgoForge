import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("UserSubscription", userSubscriptionSchema);