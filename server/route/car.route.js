import express from "express";
import { getCars, getCarBySlug, createCar, updateCar, getCarById, deleteCar , markCarAsSold, updateCarPrice} from "../controller/car.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT, verifyAdmin } from "../middleware/jwt.middleware.js"
import { validate } from "../middleware/joiValidation.middleware.js";
import { createSchema } from "../utils/validators/car.validators.js";
import { updateSchema } from "../utils/validators/car.validators.js";
import { parseRequestData } from "../middleware/parseRequest.middleware.js";

 const carRouter = express.Router();

carRouter.get("/", getCars);
carRouter.get("/slug/:slug", getCarBySlug);
carRouter.patch("/update-price", verifyJWT, verifyAdmin, updateCarPrice);
carRouter.patch("/:id/sell", verifyJWT, verifyAdmin, markCarAsSold);
carRouter.post("/", verifyJWT, verifyAdmin, upload.array("images", 12),parseRequestData,
  validate(createSchema),
  createCar);
carRouter.put("/:id/update", verifyJWT, verifyAdmin, upload.array("images", 12),parseRequestData,
  validate(updateSchema),
  updateCar);
carRouter.delete("/:id/delete", verifyJWT, verifyAdmin, deleteCar);
// carRouter.patch("/:id/sell", verifyJWT, isAdmin, markCarAsSold);

carRouter.get("/:id", getCarById);

export default carRouter;