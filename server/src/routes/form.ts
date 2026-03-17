import express from "express";

const router = express.Router();

router.post("/form", handleForm);
export default router;