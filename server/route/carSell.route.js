import express from "express";
import { createCarSell, getCarsSell, getCarSellById, updateCarSell, deleteCarSell } from "../controller/carSell.controller.js";

const carSellRouter = express.Router();

carSellRouter.post("/", createCarSell);
carSellRouter.get("/", getCarsSell);
carSellRouter.get("/:id", getCarSellById);
carSellRouter.put("/:id", updateCarSell);
carSellRouter.delete("/:id", deleteCarSell);

export default carSellRouter;
