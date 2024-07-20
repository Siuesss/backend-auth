import { register, login, changepassword } from '../services/authService.js';

const registerHandler = async(req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log('Received registration request:', req.body);
    const user = await register(name, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
}

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(401).json({ message: error.message });
  }
}

const logoutHandler = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error in logout controller:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
}

const changepasswordHandler = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.session;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if(!oldPassword && !newPassword){
    res.status(400).json({ message: 'Old password and new password are required' });
    return;
  }

  if (newPassword.length < 4) {
    res.status(400).json({ message: 'Password minimal 4 karakter' });
    return;
  }

  try {
    const result = await changepassword(userId, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    if(error.message === "Password incorrect"){
      res.status(400).json({ message: 'Password incorrect' });
    }else if(error.message === "Password change limit exceeded for today"){
      res.status(400).json({message: "Password change limit exceeded for today"});
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

export {registerHandler, logoutHandler, loginHandler, changepasswordHandler}