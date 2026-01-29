import express from "express";
import {
  createNationGemini,
  createRandomNation,
  getNations,
  getNationsUser,
  getNationsUserSimple,
  getNationDetails,
  getMonthlyNation,
  getNationCreator,
  addEvent,
  deleteNation,
  updateNation,
} from "../controllers/nationController.js";

import {
  createNation,
  createNationAdvanced,
} from "../controllers/newNationController.js";

const router = express.Router();

// LEER
router.get("/", getNations);
router.get("/monthly", getMonthlyNation);
router.get("/simple/:userId", getNationsUserSimple);
router.get("/:userId", getNationsUser);
router.get("/details/:nationId", getNationDetails);
//router.get('/details/:nationId/generateImage', generateImage);
router.get("/details/:nationId/creator", getNationCreator);

// CREAR
router.post("/", createNation);
router.post("/advanced", createNationAdvanced);
router.post("/random", createRandomNation);
router.post("/:nationId/events", addEvent);

// EDITAR
router.put("/:id", updateNation);

router.delete("/:id", deleteNation);

export default router;
