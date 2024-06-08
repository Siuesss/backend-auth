import { registerUser, loginUser } from '../services/authService.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    console.log('Received registration request:', req.body);
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(401).json({ message: error.message });
  }
}

export function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('Error in logout controller:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
}