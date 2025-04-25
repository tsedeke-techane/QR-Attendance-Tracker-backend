import User from '../models/user.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;



export async function register(req, res) {
  const { name, ID, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne ({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await hash(password, 10);
    // Create a new user
    const newUser = new User({
      name,
      ID,
      email,
      password: hashedPassword,
      role
    });
    // Save the user to the database
    await newUser.save();
    // Generate a token
    const token = sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Send the token in the response
    res.status(201).json({ token, user: { id: newUser._id, name, email, role } });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
export async function login(req, res) {
    const { name, ID , password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ ID });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }
    // Check if password is correct
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
        console.error('Password comparison failed');
        return res.status(400).json({ message: 'credentials do not match' });
    }
        // Generate a token
        const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Send the token in the response
        res.status(200).json({ token, user: { id: user._id, name: user.name, ID: user.ID } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
export async function logout(req, res) {
  try {
    // Invalidate the token (if using a token-based authentication system)
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
