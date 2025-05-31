import express from "express";
import permit from "../../middleware/permit";
import auth from "../../middleware/auth";
import adminGroupRouter from "./group";

const adminRouter = express.Router();

adminRouter.use(auth, permit('admin'));
adminRouter.use('/groups', adminGroupRouter )




export default adminRouter;