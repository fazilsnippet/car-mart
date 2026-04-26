import express from "express";
import { createCarSell, getCarsSell, getCarSellById, updateCarSell, deleteCarSell, getMyCars } from "../controller/carSell.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/jwt.middleware.js";
const carSellRouter = express.Router();

carSellRouter.post("/", verifyJWT, upload.array("images", 12), createCarSell);
carSellRouter.get("/", verifyJWT, getCarsSell);
carSellRouter.get("/:id", verifyJWT,  getCarSellById);
carSellRouter.put("/:id", verifyJWT, upload.array("images", 12),  updateCarSell);
carSellRouter.delete("/:id", verifyJWT, deleteCarSell);
carSellRouter.get("/my-listings", verifyJWT, getMyCars);
export default carSellRouter;
