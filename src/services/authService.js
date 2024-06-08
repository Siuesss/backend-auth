import bcrypt from 'bcryptjs';
import prisma from '../utils/prismaClient.js';

export async function registerUser(name, email, password) {
  console.log('Starting user registration');
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log('Password hashed');
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.error('Email already in use');
      throw new Error('Email already in use');
    }
    const user = await prisma.user.create({
      data: { name, email, hashPassword: hashedPassword },
    });
    console.log('User registered successfully');
    return user;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  console.log('Starting user login');
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('User not found');
      throw new Error('Email or password incorrect');
    }
    if (!bcrypt.compareSync(password, user.hashPassword)) {
      console.error('Incorrect password');
      throw new Error('Email or password incorrect');
    }
    console.log('User logged in successfully');
    return user;
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
}