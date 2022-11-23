import mongoose from "mongoose"

const tokenModule = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true },
    refreshToken: {type: String, required: true }
}, {
    timestamps: true
})


export default mongoose.model("Token", tokenModule)
