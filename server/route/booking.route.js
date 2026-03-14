import express from "express";
import { createBooking, getBookingById, getMyBookings, getAllBookings, updateBookingStatus, assignBooking, cancelBooking } from "../controller/booking.controller.js";
 const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/my", getMyBookings);
bookingRouter.get("/:id", getBookingById);
bookingRouter.get("/", getAllBookings);
bookingRouter.put("/:id/status", updateBookingStatus);
bookingRouter.put("/:id/assign", assignBooking);
bookingRouter.delete("/:id/cancel", cancelBooking);

export default bookingRouter;