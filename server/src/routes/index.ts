import express from "express";
import v1Routes from "./v1";

const router = express.Router();

router.use("/v1", v1Routes);

// ** V2 ROUTES HERE **

export default router;
