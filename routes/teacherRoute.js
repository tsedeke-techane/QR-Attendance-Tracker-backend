import express from "express";
import { protect ,authorize} from "../middleware/authMiddleware.js";
import { addStudentToClass, getClassStudents } from "../controllers/classController.js";
import { createClass } from "../controllers/classController.js";
const router=express.Router();

router.use(protect);


router.post("/create-class", authorize("teacher"), createClass);
router.post("/class/:classId/students", authorize("teacher"),addStudentToClass)
router.get("/class/:classId/students",authorize("teacher"), getClassStudents)
export default router;