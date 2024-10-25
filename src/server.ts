import express, { Response, Request } from "express";
import authRouter from "./routes/auth.route";
import postRouter from "./routes/post.route";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import "dotenv/config";

const PORT = process.env.PORT || 8000;

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
