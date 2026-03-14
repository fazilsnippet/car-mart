import express from 'express';
import cors from 'cors';  
import cookieParser from 'cookie-parser';  
// import cartRouter  from './routes/cart.route.js';  
// import categoryRouter from './routes/category.route.js';  
// import productRouter from './routes/product.route.js';  
// import wishlistRouter from './routes/wishlist.route.js';  
import dotenv from 'dotenv'; 
// import adminRouter from './routes/admin.route.js';
// import paymentRouter from './routes/payment.route.js';
// import userRouter from "./routes/user.route.js"
import { errorHandler } from './middleware/errorHandler.js';
// import  client from 'prom-client'
// import axios from "axios"
// import webhookRouter from './routes/razorpayWebhook.js';
// import reviewRouter from './routes/review.route.js';
// import orderRouter from './routes/order.route.js';
// import brandRouter from './routes/brand.route.js';
// import otpRouter from './routes/otp.route.js';
import carRouter from './route/car.route.js';
import brandRouter from './route/brand.route.js';
import bookingRouter from './route/booking.route.js';
import userRouter from './route/user.route.js';
import otpRouter from './route/otp.route.js';
dotenv.config(); 

const app = express();
app.use(express.json()); 

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());  
// app.use('/api/categories', categoryRouter);  
app.use('/api/car', carRouter); 
app.use('/api/brand', brandRouter);
app.use('api/booking', bookingRouter);
app.use('/api/otp', otpRouter);
// app.use('/api/wishlist', wishlistRouter);  
// app.use('/api/products', productRouter);  
// app.use('/api/reviews', reviewRouter);
// app.use('/api/admin', adminRouter)
// app.use('/api/payments', paymentRouter)
app.use('/api/users', userRouter);
// app.use('/api/orders' , orderRouter)
// app.use("/api/brand", brandRouter)
app.use("/api/otp", otpRouter)

app.get('/', (req, res) => {
  res.send('Server is running');
});


app.use(errorHandler)
export default app