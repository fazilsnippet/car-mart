import express from "express";
import {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand
} from "../controller/brand.controller.js";
 const brandRouter = express.Router();

// retrieve all brands
brandRouter.get("/", getBrands);

brandRouter.post("/", createBrand);
brandRouter.patch("/:id", updateBrand);
brandRouter.delete("/:id", deleteBrand);

export default brandRouter;