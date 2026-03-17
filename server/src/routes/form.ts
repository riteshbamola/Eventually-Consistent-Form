import express from "express";
import { handleForm,handleStatus } from "../controller/form";
const router = express.Router();

router.post("/form", handleForm);
router.get("/form/status/:id",handleStatus);


export default router;