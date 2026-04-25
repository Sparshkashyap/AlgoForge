export const validateCookie = (req, res, next) => {
  const { consent } = req.body;

  if (!["accepted", "rejected", "custom"].includes(consent)) {
    return res.status(400).json({
      success: false,
      message: "Invalid consent value",
    });
  }

  next();
};