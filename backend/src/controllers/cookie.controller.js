import prisma from "../config/db.js";

export const saveCookieConsent = async (req, res, next) => {
  try {
    const { consent, analytics, marketing } = req.body;

    const userId = req.user?.userId || null;

    const record = await prisma.cookieConsent.create({
      data: {
        userId,
        consent,
        analytics: !!analytics,
        marketing: !!marketing,
      },
    });

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};