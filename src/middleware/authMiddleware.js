const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Nama, email, dan kata sandi diperlukan' });
      return;
    }
  
    const usernameRegex = /^[a-zA-Z0-9-_.]{3,30}$/;
    if (username.length < 4) {
      res.status(400).json({ message: 'Username minimal 4 karakter' });
      return;
    }
    if (!usernameRegex.test(username)) {
      res.status(400).json({ message: 'Username hanya boleh mengandung huruf, angka, tanda hubung, garis bawah, dan titik' });
      return;
    }
    if (password.length < 4) {
      res.status(400).json({ message: 'Password minimal 4 karakter' });
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Email tidak valid' });
      return;
    }

    next();
  };

  const validateChangePassword = (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const {userId} = req.session;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
  
    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: 'Old password and new password are required' });
      return;
    }
  
    if (newPassword.length < 4) {
      res.status(400).json({ message: 'New password must be at least 4 characters long' });
      return;
    }
  
    next();
  };

  const validateLogin = (req, res, next) => {
    const { identifier, password } = req.body;
    const {userId} = req.session;
  
    if (!identifier || !password) {
      res.status(400).json({ message: 'Pengidentifikasi dan kata sandi diperlukan' });
      return;
    }
  
    const isEmail = identifier.includes('@') && identifier.includes('.');
    
    if (isEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(identifier)) {
        res.status(400).json({ message: 'Pengidentifikasi harus berupa alamat email yang valid' });
        return;
      }
    } else {
      const usernameRegex = /^[a-zA-Z0-9-_]{3,30}$/; 
      if (!usernameRegex.test(identifier)) {
        res.status(400).json({ message: 'Pengidentifikasi harus berupa nama pengguna yang valid' });
        return;
      }
    }

    if(userId){
        res.status(400).json({ message: 'Kamu sudah Login' });
        return;
    }
  
    next();
  };

  const validateLogout = (req, res, next) => {
    const {userId} = req.session;

    if(!userId){
        res.status(400).json({ message: 'Kamu sudah Logout' });
        return;
    }
    next();

  }

export { validateRegister, validateLogin, validateChangePassword, validateLogout}