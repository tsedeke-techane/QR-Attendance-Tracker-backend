import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  qrCode: {
    value: String,
    expiresAt: Date,
  },
  records: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["present", "absent", "excused"],
        default: "absent",
      },
      timeScanned: Date,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

// Create index for QR code expiration
attendanceSchema.index({ "qrCode.expiresAt": 1 }, { expireAfterSeconds: 0 })

const Attendance = mongoose.model("Attendance", attendanceSchema)

export default Attendance

