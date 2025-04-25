import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, "Please add a class name"],
    trim: true,
  },
  section: {
    type: String,
    required: [true, "Please add a section"],
    trim: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  schedule: {
    days: [
      {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    startTime: String,
    endTime: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Class = mongoose.model("Class", classSchema)

export default Class

