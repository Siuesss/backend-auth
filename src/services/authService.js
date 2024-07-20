import bcrypt from 'bcryptjs';
import prisma from '../utils/prismaClient.js';

const register = async (name, email, password) => {
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

const login = async (email, password) => {
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

const changepassword = async (userId, oldPassword, newPassword) => {
  try {
      const user = await prisma.user.findUnique({
          where: { id: userId },
      });

      if (!user) {
          throw new Error('User not found');
      }

      const currentDate = new Date();

      const lastPasswordChange = user.lastPasswordChange || new Date(0);
      const daysSinceLastChange = Math.floor((currentDate.getTime() - lastPasswordChange.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastChange > 0) {
          await prisma.user.update({
              where: { id: userId },
              data: { passwordChangeCount: 0 }
          });
          user.passwordChangeCount = 0;
      }

      if (user.passwordChangeCount >= 5) {
          throw new Error('Password change limit exceeded for today');
      }

      if (user.hashPassword === null) {
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          await prisma.user.update({
              where: { id: userId },
              data: {
                  hashPassword: hashedPassword,
                  passwordChangeCount: user.passwordChangeCount + 1,
                  lastPasswordChange: currentDate,
              },
          });
      } else {
          if (!bcrypt.compareSync(oldPassword, user.hashPassword)) {
              throw new Error('Password incorrect');
          } else {
              const hashedPassword = bcrypt.hashSync(newPassword, 10);
              await prisma.user.update({
                  where: { id: userId },
                  data: {
                      hashPassword: hashedPassword,
                      passwordChangeCount: user.passwordChangeCount + 1,
                      lastPasswordChange: currentDate,
                  },
              });
          }
      }

      return { message: 'Password updated successfully' };
  } catch (error) {
      throw error;
  }
}

export {changepassword, login, register}