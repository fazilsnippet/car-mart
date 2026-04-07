import express from "express";
import { createBrand, getBrands } from "../controller/brand.controller.js";
 const brandRouter = express.Router();

// retrieve all brands
brandRouter.get("/", getBrands);

brandRouter.post("/",  createBrand);

export default brandRouter;