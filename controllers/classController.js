import Class from "../models/class.js"
import User from "../models/user.js"
export const addStudentToClass = async (req, res) => {
    try {
      const { ID,name } = req.body
  
      if (!ID || !name) {
        return res.status(400).json({
          success: false,
          message: "Please provide student ID",
        })
      }
  
      const classRecord = await Class.findById(req.params.classId)
  
      if (!classRecord) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        })
      }
  
      // Check if the teacher is assigned to this class
      if (classRecord.teacher.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to modify this class",
        })
      }
  
      // Find student by studentId
      const student = await User.findOne({ ID: ID, role: "student"})
  
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        })
      }
  
      // Check if student is already in the class
      if (classRecord.students.includes(student._id)) {
        return res.status(400).json({
          success: false,
          message: "Student already enrolled in this class",
        })
      }
  
      // Add student to class
      classRecord.students.push(student._id)
      await classRecord.save()
  
      // Add class to student's classes
      student.classes.push(classRecord._id)
      await student.save()
  
      res.status(200).json({
        success: true,
        message: "Student added to class successfully",
        data: {
          student: {
            id: student._id,
            name: student.name,
            email: student.email,
            studentId: student.studentId,
          },
          class: classRecord,
        },
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  export const createClass=async (req, res) => {
    try {
      const { className, section, schedule } = req.body
      console.log("request now again bitch", req.body);
  
      if (!className || !section) {
        return res.status(400).json({
          success: false,
          message: "Please provide class name and section",
        })
      }
  
      const newClass = await Class.create({
        className,
        section,
        teacher: req.user.id,
        schedule: schedule || {},
      })
  
      res.status(201).json({
        success: true,
        data: newClass,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  export const getClassStudents = async (req, res) => {
    try {
      const classRecord = await Class.findById(req.params.classId).populate({
        path: "students",
        select: "name email studentId ID role",
      })
  
      if (!classRecord) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        })
      }
  
      // Check if the teacher is assigned to this class
      if (classRecord.teacher.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access this class",
        })
      }
  
      res.status(200).json({
        success: true,
        count: classRecord.students.length,
        data: classRecord.students,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }