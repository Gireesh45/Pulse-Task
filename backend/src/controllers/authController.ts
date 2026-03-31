import { Request, Response } from 'express';
import User from '../models/User';
import Organization from '../models/Organization';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, organizationName } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    let org = await Organization.findOne({ name: organizationName });
    if (!org) {
      org = await Organization.create({ name: organizationName });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Viewer',
      organizationId: org._id
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      token: generateToken(user.id)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password!))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
