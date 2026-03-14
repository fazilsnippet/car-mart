import express from "express";
import { createBrand, getBrands } from "../controller/brand.controller.js";
import { upload } from "../middleware/multer.js";
 const brandRouter = express.Router();

// retrieve all brands
brandRouter.get("/", getBrands);

brandRouter.post("/", upload.single("logo"), createBrand);

export default brandRouter;