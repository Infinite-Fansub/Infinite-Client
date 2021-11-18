import * as mongoose from "mongoose";
import { mongoPath } from "../../../config.json"

async () => {
    await mongoose.connect(mongoPath)
    return mongoose
}