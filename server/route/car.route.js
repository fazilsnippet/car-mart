import express from "express";
import { getCars, getCarBySlug, createCar, updateCar, getCarById, deleteCar , markCarAsSold} from "../controller/car.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/jwt.middleware.js"
 const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/slug/:slug", getCarBySlug);

carRouter.post("/", upload.array("images", 12), createCar);
carRouter.put("/:id/update", upload.array("images", 12), updateCar);
carRouter.delete("/:id/delete", deleteCar);
// carRouter.patch("/:id/sell", verifyJWT, isAdmin, markCarAsSold);
carRouter.patch("/:id/sell", verifyJWT, markCarAsSold);

carRouter.get("/:id", getCarById);

export default carRouter;