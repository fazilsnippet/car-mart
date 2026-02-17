import express from "express";
import { getCars, getCarsBySlug, createCar, updateCar, getCarById, deleteCar } from "../controller/car.controller.js";
import { upload } from "../middleware/multer.js";
 const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/slug/:slug", getCarsBySlug);

carRouter.post("/", upload.array(15), createCar);
carRouter.put("/:id", upload.array(15),updateCar);
carRouter.delete("/:id", deleteCar);
carRouter.get("/:id", getCarById);

export default carRouter;