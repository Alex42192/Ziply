import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";
import storeRoute from "./routes/store.routes.js";
import orderRoute from "./routes/order.routes.js";
import cors from "cors";


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/store", storeRoute);
app.use("/api/v1/order", orderRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT}`);
})