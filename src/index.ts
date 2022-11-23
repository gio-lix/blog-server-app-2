import dotenv from 'dotenv';
dotenv.config();

import express, { Express} from 'express';
import cors from "cors"
import cookieParser from 'cookie-parser'

const app: Express = express()

import './config/dataBase'
import errorMiddleware from "./middleware/error-middleware";
import routes from "./routes";

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: `${process.env.CLIENT_URL}`
}))
app.use('/api', routes)
app.use(errorMiddleware)



const port = process.env.PORT || 5550;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});