import express from "express";
import {
  getMyProfileController,
  updateMyProfileController,
  uploadAvatarController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMyProfileController);
router.patch("/me", updateMyProfileController);
router.post("/me/avatar", upload.single("avatar"), uploadAvatarController);

export default router;