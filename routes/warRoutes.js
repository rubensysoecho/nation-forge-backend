import express from "express";
import { createWar } from "../controllers/warController.js";

const router = express.Router();

router.post("/", createWar);

export default router;
