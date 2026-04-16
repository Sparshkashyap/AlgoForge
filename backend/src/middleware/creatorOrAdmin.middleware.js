export const creatorOrAdminMiddleware = (req, res, next) => {
  if (!req.user || !["CREATOR", "ADMIN"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Creator or admin access required",
    });
  }

  next();
};