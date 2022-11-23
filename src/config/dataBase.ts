import mongoose from 'mongoose'
import {ConnectOptions} from "mongodb";

const URI = process.env.DB_URL

mongoose.connect(`${URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions)
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err))

