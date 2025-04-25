import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  ID: {
    type: String,
    required: [true, "Please add an ID"],
    unique: true,
    trim: true,
    // match: [/^[0-9]{8}$/, "Please add a valid ID"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
   
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  teacherId: {
    type: String,
    unique: true,
    sparse: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("User", userSchema)

export default User

