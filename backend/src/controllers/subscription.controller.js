import Subscription from "../models/subscription.model.js";

export const getAllPlans = async (req, res) => {
  const plans = await Subscription.find({ isActive: true });
  res.json(plans);
};

export const createPlan = async (req, res) => {
  const plan = await Subscription.create(req.body);
  res.json(plan);
};

export const updatePlan = async (req, res) => {
  const plan = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(plan);
};

export const deletePlan = async (req, res) => {
  await Subscription.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};