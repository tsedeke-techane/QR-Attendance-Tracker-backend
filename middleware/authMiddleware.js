import jwt from "jsonwebtoken"
import User from "../models/user.js"

// Protect routes
export const protect = async (req, res, next) => {
  let token

  // Check if token exists in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies?.token) {
    // Set token from cookie
    token = req.cookies.token
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not found, authorization denied",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user to request object
    req.user = await User.findById(decoded.id)

    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    })
  }
}

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

