import express from "express";
import { getGlobalLeaderboardController } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/global", getGlobalLeaderboardController);

export default router;