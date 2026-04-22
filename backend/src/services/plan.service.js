import prisma from "../config/db.js";

const DEFAULT_PLANS = {
  FREE: {
    code: "FREE",
    name: "Free",
    amountInPaise: 0,
    currency: "INR",
    active: true,
    visibleToRoles: ["USER", "CREATOR", "ADMIN"],
    features: [
      "Basic problem access",
      "Basic dashboard",
      "Daily question access",
      "Limited AI usage",
    ],
  },
  STANDARD: {
    code: "STANDARD",
    name: "Standard",
    amountInPaise: 29900,
    currency: "INR",
    active: true,
    visibleToRoles: ["USER"],
    features: [
      "Premium problems",
      "Expanded AI help",
      "Roadmap access",
      "Priority practice tools",
    ],
  },
  PRO: {
    code: "PRO",
    name: "Pro",
    amountInPaise: 49900,
    currency: "INR",
    active: true,
    visibleToRoles: ["USER"],
    features: [
      "All premium problems",
      "Advanced AI help",
      "Full roadmap access",
      "Priority access",
      "Premium contest support",
    ],
  },
};

const PLAN_SETTING_KEY = "pricing_catalog_v1";

const normalizePricingCatalog = (catalog) => {
  return {
    FREE: { ...DEFAULT_PLANS.FREE, ...(catalog?.FREE || {}) },
    STANDARD: { ...DEFAULT_PLANS.STANDARD, ...(catalog?.STANDARD || {}) },
    PRO: { ...DEFAULT_PLANS.PRO, ...(catalog?.PRO || {}) },
  };
};

export const getPricingCatalogService = async () => {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: PLAN_SETTING_KEY },
  });

  if (!setting) {
    const created = await prisma.systemSetting.create({
      data: {
        key: PLAN_SETTING_KEY,
        value: DEFAULT_PLANS,
      },
    });

    return normalizePricingCatalog(created.value);
  }

  return normalizePricingCatalog(setting.value);
};

export const updatePricingCatalogService = async ({ actorUserId, plans }) => {
  const nextCatalog = normalizePricingCatalog(plans);

  const saved = await prisma.systemSetting.upsert({
    where: { key: PLAN_SETTING_KEY },
    update: {
      value: nextCatalog,
      updatedById: actorUserId,
    },
    create: {
      key: PLAN_SETTING_KEY,
      value: nextCatalog,
      updatedById: actorUserId,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "SYSTEM_SETTINGS_UPDATED",
      actorUserId,
      metadata: {
        key: PLAN_SETTING_KEY,
      },
    },
  });

  return normalizePricingCatalog(saved.value);
};

export const getVisiblePricingPlansForRoleService = async (role = "USER") => {
  const catalog = await getPricingCatalogService();

  return Object.values(catalog).filter(
    (plan) =>
      plan.active &&
      Array.isArray(plan.visibleToRoles) &&
      plan.visibleToRoles.includes(role)
  );
};

export const getPlanPricingByTierService = async (tier) => {
  const catalog = await getPricingCatalogService();
  const plan = catalog?.[tier];

  if (!plan || !plan.active) {
    const error = new Error("Pricing plan not available");
    error.statusCode = 400;
    throw error;
  }

  return plan;
};