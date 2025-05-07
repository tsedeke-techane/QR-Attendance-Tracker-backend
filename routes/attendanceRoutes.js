import express from "express"

import { protect, authorize } from "../middleware/authMiddleware.js"
// import { createAttendanceSession, getAttendanceHistory, getClassAttendanceHistory, updateAttendanceStatus } from "../controllers/attendanceController.js"

const router = express.Router()

// Apply middleware to all routes
router.use(protect)

// Teacher only routes
// router.post("/create", authorize("teacher"), createAttendanceSession)
// // router.get("/:id", authorize("teacher"), getAttendanceSession);
// router.put("/:id/student/:studentId", updateAttendanceStatus)
// router.get("/class/:classId", authorize("teacher"), getClassAttendanceHistory)
// router.get("/attendance-history", getAttendanceHistory)

import {
  generateQRAttendance,
  scanQRAttendance,
  getStudentClassAttendance,
  getClassAttendanceHistory,
  updateAttendanceStatus,
  getAttendanceSession,
  exportAttendanceData
} from '../controllers/attendanceController.js';




// QR Code Based Attendance
router.post('/generate', authorize("teacher"), generateQRAttendance);
router.post('/scan', authorize("student"), scanQRAttendance);

// Attendance History
router.get('/history/class/:classId', authorize("student"), getStudentClassAttendance);
router.get('/class/:classId/history', protect, authorize("teacher"), getClassAttendanceHistory);

// Manual Attendance Management
router.put('/:id/student/:studentId', authorize("student"), updateAttendanceStatus);
router.get('/session/:id', authorize("teacher"), getAttendanceSession);

// Data Export
router.get('/export/:classId', authorize("teacher"), exportAttendanceData);



export default router

