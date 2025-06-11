// import Attendance from "../models/attendance.js"
// import Class from "../models/class.js"
// import { generateQRCode } from "../utils/qrGenerator.js"

// // @desc    Create attendance session with QR code
// // @route   POST /api/attendance/create
// // @access  Private (Teacher only)
// export const createAttendanceSession = async (req, res) => {
//   try {
//     const { classId, expiresInMinutes = 15 } = req.body

//     if (!classId) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide class ID",
//       })
//     }

//     // Check if class exists and teacher is assigned to it
//     const classRecord = await Class.findById(classId)

//     if (!classRecord) {
//       return res.status(404).json({
//         success: false,
//         message: "Class not found",
//       })
//     }

//     if (classRecord.teacher.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to create attendance for this class",
//       })
//     }

//     // Generate a unique QR code value
//     const qrValue = `${classId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

//     // Set expiration time
//     const expiresAt = new Date()
//     expiresAt.setMinutes(expiresAt.getMinutes() + Number.parseInt(expiresInMinutes))

//     // Generate QR code image
//     const qrCodeImage = await generateQRCode(qrValue)

//     // Create attendance session
//     const attendance = await Attendance.create({
//       class: classId,
//       date: new Date(),
//       qrCode: {
//         value: qrValue,
//         expiresAt,
//       },
//       records: classRecord.students.map((student) => ({
//         student,
//         status: "absent",
//       })),
//       createdBy: req.user.id,
//     })
//     console.log(attendance);

//     res.status(201).json({
//       success: true,
//       data: {
//         attendance,
//         qrCodeImage,
//         expiresAt,
     
//       },
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }

// // @desc    Get attendance session details
// // @route   GET /api/attendance/:id
// // @access  Private (Teacher only)
// // export const getAttendanceSession = async (req, res) => {
// //   console.log("I am in");
// //   try {
// //     const attendance = await Attendance.findById(req.params.id).populate("class").populate({
// //       path: "records.student",
// //       select: "name email studentId",
// //     })

// //     if (!attendance) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Attendance session not found",
// //       })
// //     }

// //     // Check if user is the teacher who created this session
// //     if (attendance.createdBy.toString() !== req.user.id) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Not authorized to view this attendance session",
// //       })
// //     }

// //     // Calculate statistics
// //     const stats = {
// //       total: attendance.records.length,
// //       present: attendance.records.filter((r) => r.status === "present").length,
// //       absent: attendance.records.filter((r) => r.status === "absent").length,
// //       // excused: attendance.records.filter((r) => r.status === "excused").length,
// //     }

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         attendance,
// //         stats,
// //         isActive: new Date() < new Date(attendance.qrCode.expiresAt),
// //       },
// //     })
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     })
// //   }
// // }

// // @desc    Update student attendance status manually
// // @route   PUT /api/attendance/:id/student/:studentId
// // @access  Private (Teacher only)
// export const updateAttendanceStatus = async (req, res) => {
//   try {
//     const { status } = req.body

//     if (!status || !["present", "absent", "excused"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a valid status (present, absent, or excused)",
//       })
//     }

//     const attendance = await Attendance.findById(req.params.id)

//     if (!attendance) {
//       return res.status(404).json({
//         success: false,
//         message: "Attendance session not found",
//       })
//     }

//     // Check if user is the teacher who created this session
//     if (attendance.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to update this attendance session",
//       })
//     }

//     // Find the student record
//     const studentRecord = attendance.records.find((record) => record.student.toString() === req.params.studentId)

//     if (!studentRecord) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found in this attendance session",
//       })
//     }

//     // Update status
//     studentRecord.status = status
//     if (status === "present" && !studentRecord.timeScanned) {
//       studentRecord.timeScanned = new Date()
//     }

//     await attendance.save()

//     res.status(200).json({
//       success: true,
//       message: `Student attendance status updated to ${status}`,
//       data: studentRecord,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }

// // @desc    Get attendance history for a class
// // @route   GET /api/attendance/class/:classId
// // @access  Private (Teacher only)
// export const getClassAttendanceHistory = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query

//     // Check if class exists and teacher is assigned to it
//     const classRecord = await Class.findById(req.params.classId)

//     if (!classRecord) {
//       return res.status(404).json({
//         success: false,
//         message: "Class not found",
//       })
//     }

//     if (classRecord.teacher.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized to view attendance for this class",
//       })
//     }

//     // Build query
//     const query = {
//       class: req.params.classId,
//     }

//     if (startDate && endDate) {
//       query.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       }
//     }

//     const attendanceRecords = await Attendance.find(query).sort({ date: -1 })

//     res.status(200).json({
//       success: true,
//       count: attendanceRecords.length,
//       data: attendanceRecords,
//     })
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }


// // export const getAttendanceHistory = async (req, res) => {
// //   try {
// //     const { classId } = req.query;
// //     const studentId = req.user.id;

// //     // Check if class exists
// //     const classRecord = await Class.findById(classId);

// //     if (!classRecord) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Class not found",
// //       });
// //     }

// //     // Check if student is enrolled in the class
// //     if (!classRecord.students.includes(studentId)) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Student not enrolled in this class",
// //       });
// //     }

// //     // Fetch attendance records for the student in the class
// //     const studentAttendanceRecords = await Attendance.find({
// //       class: classId,
// //       "records.student": studentId,
// //     }).sort({ date: 1 });

// //     // Initialize attendance streak data
// //     let streak = [];
// //     let currentStreak = { status: null, count: 0 };

// //     studentAttendanceRecords.forEach((attendance) => {
// //       const studentRecord = attendance.records.find(
// //         (record) => record.student.toString() === studentId
// //       );

// //       if (studentRecord) {
// //         if (currentStreak.status === studentRecord.status) {
// //           currentStreak.count++;
// //         } else {
// //           if (currentStreak.status) {
// //             streak.push({ ...currentStreak });
// //           }
// //           currentStreak = { status: studentRecord.status, count: 1 };
// //         }
// //       }
// //     });

// //     if (currentStreak.status) {
// //       streak.push({ ...currentStreak });
// //     }

// //     // Map attendance records to include only relevant student data
// //     const studentAttendanceHistory = studentAttendanceRecords.map((attendance) => {
// //       const studentRecord = attendance.records.find(
// //         (record) => record.student.toString() === studentId
// //       );
// //       return {
// //         date: attendance.date,
// //         status: studentRecord.status,
// //         timeScanned: studentRecord.timeScanned || null,
// //       };
// //     });

// //     res.status(200).json({
// //       success: true,
// //       streak,
// //       data: studentAttendanceHistory,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };
// export const getAttendanceHistory = async (req, res) => {
//   try {
//     const { classId } = req.query;
//     const studentId = req.user.id;

//     // Check if class exists
//     const classRecord = await Class.findById(classId);

//     if (!classRecord) {
//       return res.status(404).json({
//         success: false,
//         message: "Class not found",
//       });
//     }

//     // Check if student is enrolled in the class
//     if (!classRecord.students.includes(studentId)) {
//       return res.status(403).json({
//         success: false,
//         message: "Student not enrolled in this class",
//       });
//     }

//     // Fetch attendance records for the student in the class
//     const studentAttendanceRecords = await Attendance.find({
//       class: classId,
//       "records.student": studentId,
//     }).sort({ date: 1 });

//     let totalPresent = 0;
//     let totalAbsent = 0;
//     const attendanceHistory = [];

//     studentAttendanceRecords.forEach((attendance) => {
//       const studentRecord = attendance.records.find(
//         (record) => record.student.toString() === studentId
//       );

//       if (studentRecord) {
//         if (studentRecord.status === "present") {
//           totalPresent++;
//           attendanceHistory.push({
//             date: attendance.date,
//             status: "present",
//             timeScanned: studentRecord.timeScanned || null,
//           });
//         } else if (studentRecord.status === "absent") {
//           totalAbsent++;
//           attendanceHistory.push({
//             date: attendance.date,
//             status: "absent",
//           });
//         }
//       }
//     });

//     res.status(200).json({
//       success: true,
//       totalPresent,
//       totalAbsent,
//       attendanceHistory,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
import Attendance from '../models/attendance.js';
import Class from '../models/class.js';
import User from '../models/user.js';
import crypto from 'crypto';
import { generateQRCode } from '../utils/qrGenerator.js';
import { Parser } from 'json2csv';

// @desc    Generate QR code for class attendance
// @route   POST /api/attendance/generate
// @access  Private (Teacher only)
export const generateQRAttendance = async (req, res) => {
  try {
    const { classId, expiresInMinutes = 40 } = req.body;
    console.log(" i am in generateQRAttendance with class id of", classId);

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const classObj = await Class.findOne({
      _id: classId,
      teacher: req.user._id
    });

    if (!classObj) {
      return res.status(404).json({ error: "Class not found or unauthorized" });
    }

    const qrValue = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    const records = classObj.students.map(student => ({
      student,
      status: "absent"
    }));

    const attendance = new Attendance({
      class: classId,
      qrCode: {
        value: qrValue,
        expiresAt
      },
      records,
      createdBy: req.user._id
    });
    await attendance.save();

    const qrData = JSON.stringify({
      token: qrValue,
      classId: classId.toString()
    });

    const qrCodeImage = await generateQRCode(qrData);

    res.status(201).json({
      qrCodeImage,
      expiresAt,
      attendanceId: attendance._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Mark attendance via QR code scan
// @route   POST /api/attendance/scan
// @access  Private (Student only)
export const scanQRAttendance = async (req, res) => {
  console.log(" i am receiving data in my scan route", req.body);
  try {
    const { token, classId } = req.body;
    console.log(" and my token is ", token, " and my classId is ", classId);
    const studentId = req.user._id;

    // if (!qrData) {
    //   return res.status(400).json({ error: "QR data is required" });
    // }

    // let parsedData;
    // try {
    //   parsedData = JSON.parse(qrData);
    // } catch (e) {
    //   return res.status(400).json({ error: e });
    // }

    // const { token, classId } = parsedData;

    const attendance = await Attendance.findOne({
      "qrCode.value": token,
      class: classId,
      "qrCode.expiresAt": { $gt: new Date() }
    }).populate('class', 'className section');

    if (!attendance) {
      return res.status(404).json({ error: "Invalid or expired QR code" });
    }

    const isEnrolled = attendance.records.some(record => 
      record.student.toString() === studentId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: "Not enrolled in this class" });
    }

    const recordIndex = attendance.records.findIndex(
      record => record.student.toString() === studentId.toString()
    );

    if (recordIndex === -1) {
      return res.status(404).json({ error: "Student record not found" });
    }

    if (attendance.records[recordIndex].status !== "absent") {
      return res.status(400).json({ 
        message: "Attendance already marked",
        status: attendance.records[recordIndex].status
      });
    }

    attendance.records[recordIndex].status = "present";
    attendance.records[recordIndex].timeScanned = new Date();
    await attendance.save();

    res.json({ 
      success: true,
      message: "Attendance marked successfully",
      class: attendance.class.className,
      section: attendance.class.section,
      timeScanned: attendance.records[recordIndex].timeScanned
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getSpecificStudentClassAttendance = async (req, res) => {
 
  try {
    const { classId } = req.params;
    const {studentId} = req.body;
     console.log(" i am getting here with my data of","classId",classId,"StudentId",studentId);

    const classObj = await Class.findOne({
      _id: classId,
      students: studentId
    });

    if (!classObj) {
      return res.status(403).json({ 
        error: "Not enrolled in this class or class not found" 
      });
    }

    const attendanceSessions = await Attendance.find({
      class: classId,
      "records.student": studentId
    })
    .sort({ date: -1 })
    .select("date qrCode.expiresAt records.$");

    const history = attendanceSessions.map(session => {
      const record = session.records.find(r => 
        r.student.toString() === studentId.toString()
      );
      return {
        date: session.date,
        status: record.status,
        timeScanned: record.timeScanned,
        wasLate: record.timeScanned && 
                 record.timeScanned > session.qrCode.expiresAt
      };
    });

    const totalClasses = history.length;
    const presentCount = history.filter(h => h.status === "present").length;
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentCount / totalClasses) * 100)
      : 0;

    res.json({
      success: true,
      class: {
        name: classObj.className,
        section: classObj.section
      },
      statistics: {
        totalClasses,
        presentCount,
        absentCount: totalClasses - presentCount,
        attendancePercentage
      },
      history
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get student's attendance history for a specific class
// @route   GET /api/attendance/history/class/:classId
// @access  Private (Student only)
export const getStudentClassAttendance = async (req, res) => {
  console.log(" i am in getStudentClassAttendance");
  try {
    const { classId } = req.params;
    const studentId = req.user._id;
    console.log(" and my classId is ", classId);

    const classObj = await Class.findOne({
      _id: classId,
      students: studentId
    });
    console.log(" and my classis ", classObj);

    if (!classObj) {
      return res.status(403).json({ 
        error: "Not enrolled in this class or class not found" 
      });
    }

    const attendanceSessions = await Attendance.find({
      class: classId,
      "records.student": studentId
    })
    .sort({ date: -1 })
    .select("date qrCode.expiresAt records.$");

    const history = attendanceSessions.map(session => {
      const record = session.records.find(r => 
        r.student.toString() === studentId.toString()
      );
      return {
        date: session.date,
        status: record.status,
        timeScanned: record.timeScanned,
        wasLate: record.timeScanned && 
                 record.timeScanned > session.qrCode.expiresAt
      };
    });

    const totalClasses = history.length;
    const presentCount = history.filter(h => h.status === "present").length;
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentCount / totalClasses) * 100)
      : 0;

    res.json({
      success: true,
      class: {
        name: classObj.className,
        section: classObj.section
      },
      statistics: {
        totalClasses,
        presentCount,
        absentCount: totalClasses - presentCount,
        attendancePercentage
      },
      history
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get attendance history for a class (Teacher view)
// @route   GET /api/attendance/class/:classId/history
// @access  Private (Teacher only)
export const getClassAttendanceHistory = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;

    const classObj = await Class.findOne({
      _id: classId,
      teacher: teacherId
    }).populate('students', 'name email ID');

    if (!classObj) {
      return res.status(403).json({ 
        error: "Not authorized or class not found" 
      });
    }

    const attendanceSessions = await Attendance.find({ class: classId })
      .sort({ date: -1 })
      .populate('records.student', 'name email ID');

    const history = attendanceSessions.map(session => {
      return {
        _id: session._id,
        date: session.date,
        qrCodeExpired: session.qrCode.expiresAt < new Date(),
        totalStudents: classObj.students.length,
        attendanceStats: {
          present: session.records.filter(r => r.status === "present").length,
          absent: session.records.filter(r => r.status === "absent").length,
          excused: session.records.filter(r => r.status === "excused").length
        },
        records: session.records.map(record => ({
          student: {
            _id: record.student._id,
            name: record.student.name,
            email: record.student.email
          },
          status: record.status,
          timeScanned: record.timeScanned
        }))
      };
    });

    const totalSessions = history.length;
    const overallStats = {
      averageAttendance: totalSessions > 0 
        ? Math.round(history.reduce((sum, session) => {
            return sum + (session.attendanceStats.present / session.totalStudents);
          }, 0) / totalSessions * 100)
        : 0,
      totalClasses: totalSessions,
      students: classObj.students.map(student => {
        const presentCount = history.filter(session => 
          session.records.some(r => 
            r.student._id.toString() === student._id.toString() && 
            r.status === "present"
          )
        ).length;
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          ID: student.ID,
          attendancePercentage: totalSessions > 0
            ? Math.round((presentCount / totalSessions) * 100)
            : 0
        };
      })
    };

    res.json({
      success: true,
      class: {
        name: classObj.className,
        section: classObj.section,
        totalStudents: classObj.students.length
      },
      overallStats,
      history
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update student attendance status manually
// @route   PUT /api/attendance/:id/student/:studentId
// @access  Private (Teacher only)
export const updateAttendanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id, studentId } = req.params;

    if (!status || !["present", "absent", "excused"].includes(status)) {
      return res.status(400).json({
        error: "Please provide a valid status (present, absent, or excused)"
      });
    }

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({ error: "Attendance session not found" });
    }

    if (attendance.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: "Not authorized to update this attendance session" 
      });
    }

    const recordIndex = attendance.records.findIndex(
      record => record.student.toString() === studentId
    );

    if (recordIndex === -1) {
      return res.status(404).json({ 
        error: "Student not found in this attendance session" 
      });
    }

    attendance.records[recordIndex].status = status;
    if (status === "present" && !attendance.records[recordIndex].timeScanned) {
      attendance.records[recordIndex].timeScanned = new Date();
    }

    await attendance.save();

    res.json({
      success: true,
      message: `Attendance status updated to ${status}`,
      record: attendance.records[recordIndex]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get specific attendance session details
// @route   GET /api/attendance/session/:id
// @access  Private (Teacher only)
export const getAttendanceSession = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('class', 'className section')
      .populate('records.student', 'name email');

    if (!attendance) {
      return res.status(404).json({ error: "Attendance session not found" });
    }

    if (attendance.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: "Not authorized to view this attendance session" 
      });
    }

    const stats = {
      total: attendance.records.length,
      present: attendance.records.filter(r => r.status === "present").length,
      absent: attendance.records.filter(r => r.status === "absent").length,

    };

    res.json({
      success: true,
      session: attendance,
      stats,
      isActive: new Date() < new Date(attendance.qrCode.expiresAt)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Export attendance data as CSV
// @route   GET /api/attendance/export/:classId
// @access  Private (Teacher only)
export const exportAttendanceData = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user._id;

    const classObj = await Class.findOne({
      _id: classId,
      teacher: teacherId
    });

    if (!classObj) {
      return res.status(403).json({ 
        error: "Not authorized or class not found" 
      });
    }

    const attendanceSessions = await Attendance.find({ class: classId })
      .sort({ date: 1 })
      .populate('records.student', 'name email');

    // Prepare data for CSV
    const students = {};
    classObj.students.forEach(studentId => {
      students[studentId] = {
        name: '',
        records: []
      };
    });

    attendanceSessions.forEach(session => {
      session.records.forEach(record => {
        if (!students[record.student._id]) {
          students[record.student._id] = {
            name: record.student.name,
            records: []
          };
        }
        students[record.student._id].records.push({
          date: session.date,
          status: record.status
        });
      });
    });

    // Transform to CSV format
    const fields = [
      { label: 'Student ID', value: '_id' },
      { label: 'Student Name', value: 'name' },
      ...attendanceSessions.map(session => ({
        label: session.date.toISOString().split('T')[0],
        value: `records.${session.date.toISOString()}`
      }))
    ];

    const data = Object.entries(students).map(([id, student]) => {
      const studentData = {
        _id: id,
        name: student.name
      };
      student.records.forEach(record => {
        studentData[`records.${record.date.toISOString()}`] = record.status;
      });
      return studentData;
    });

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance_${classObj.className}_${Date.now()}.csv`);
    res.send(csv);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};