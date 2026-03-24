import {getWishlistAdmin, clearWishlist, getWishlist, toggleWishlist, } from "../controller/wishlist.controller.js"
import express from "express"
import { verifyJWT } from "../middleware/jwt.middleware.js";  // Assuming you have an auth middleware to verify JWT token

const wishlisRouter = express.Router()

// wishlisRouter.get("/admin", verifyJWT, getWishlistAdmin)
// wishlisRouter.get("/", verifyJWT, getWishlist)
// wishlisRouter.post("/toggle",verifyJWT,  toggleWishlist)
// wishlisRouter.post("/mark-inactive",verifyJWT,  markWishlistInactiveForCar)
// wishlisRouter.post("/clear", verifyJWT, clearWishlist)
wishlisRouter.get("/admin", verifyJWT, getWishlistAdmin);
wishlisRouter.get("/", verifyJWT, getWishlist);
wishlisRouter.post("/toggle", verifyJWT, toggleWishlist);
wishlisRouter.post("/clear", verifyJWT, clearWishlist);

export default wishlisRouter