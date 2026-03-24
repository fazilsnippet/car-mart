import express from "express";
import { createBooking, getBookingById, getMyBookings, getAllBookings, updateBooking, assignBooking, cancelBooking } from "../controller/booking.controller.js";
import { verifyJWT } from "../middleware/jwt.middleware.js";  // Assuming you have an auth middleware to verify JWT token
const bookingRouter = express.Router();

bookingRouter.post("/",verifyJWT, createBooking);
bookingRouter.get("/my",verifyJWT, getMyBookings);
bookingRouter.get("/:id",verifyJWT, getBookingById);
bookingRouter.get("/", getAllBookings);
bookingRouter.patch("/:id",verifyJWT, updateBooking);
bookingRouter.put("/:id/assign", assignBooking);
bookingRouter.delete("/:id/cancel", verifyJWT, cancelBooking);

export default bookingRouter;