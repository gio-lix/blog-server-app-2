import express from "express";
import authCtrl from "../controllers/authCtrl";
import auth from "../middleware/auth";
const router = express.Router()
import {body} from "express-validator"

router.post("/register",
    body("account").isEmail(),
    body("password").isLength({min: 3,max: 32}),
    authCtrl.register)
router.post("/login", authCtrl.login)
router.post('/logout',auth, authCtrl.logout)
router.get("/users",auth, authCtrl.getUsers)
router.get("/refresh", authCtrl.refresh)



export default router