import express from "express";
import { createNation } from "../controllers/nationController.js";

const router = express.Router();

// LEER
//router.get("/", getNations);

// CREAR
router.post("/", createNation);
//router.post("/advanced", createNationAdvanced);
//router.post("/random", createRandomNation);
//router.post("/:nationId/events", addEvent);

/* EDITAR
router.put("/:id", updateNation);

router.delete("/:id", deleteNation);
*/
export default router;
