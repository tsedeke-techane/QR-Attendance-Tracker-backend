import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Class from "../models/class.js";
const router=express.Router();

router.use(protect);
router.get("/student-dashboard", async (req, res) => {
    try {
      console.log("request received", req.user);
      const query = {}
  
      if (req.user.role === "teacher") {
        query.teacher = req.user.id
      } else if (req.user.role === "student") {
        // Find classes where student is enrolled
        const classes = await Class.find({ students: req.user.id }).populate("teacher")
        return res.status(200).json({
          success: true,
          count: classes.length,
          data: classes,
        })
      }
  
      const classes = await Class.find(query);
  
      res.status(200).json({
        success: true,
        count: classes.length,
        data: classes,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  })
  export default router;