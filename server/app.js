import express from 'express';
import cors from 'cors';  
import cookieParser from 'cookie-parser';  
import dotenv from 'dotenv'; 
import { errorHandler } from './middleware/errorHandler.js';
import carRouter from './route/car.route.js';
import brandRouter from './route/brand.route.js';
import bookingRouter from './route/booking.route.js';
import userRouter from './route/user.route.js';
import otpRouter from './route/otp.route.js';
import wishlistRouter from './route/wishlist.route.js';
import notificationRouter from './route/notification.route.js';
import testRouter from './route/test.route.js';
import chatRouter from './route/chat.route.js';
dotenv.config(); 

const app = express();
app.use(express.json()); 

app.use(
  cors({
    origin: "https://car-mart-client.onrender.com", 
    credentials: true,
  })
);

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());  
app.use('/api/car', carRouter); 
app.use('/api/brand', brandRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/otp', otpRouter);
// app.use('/api/admin', adminRouter)
app.use('/api/users', userRouter);
app.use("/api/otp", otpRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/test", testRouter)
app.use('/api/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});


app.use(errorHandler)
export default app