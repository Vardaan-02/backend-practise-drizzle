import express, { Response, Request } from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser"
import "dotenv/config";

const PORT = process.env.PORT || 8000;

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
