import express from "express";
import { getCars, getCarBySlug, createCar, updateCar, getCarById, deleteCar } from "../controller/car.controller.js";
import { upload } from "../middleware/multer.js";
 const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/slug/:slug", getCarBySlug);

carRouter.post("/", upload.array("images", 12), createCar);
carRouter.put("/:id", upload.array("images", 12), updateCar);
carRouter.delete("/:id", deleteCar);
carRouter.get("/:id", getCarById);

export default carRouter;