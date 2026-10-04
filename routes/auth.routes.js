const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

// Dịch vụ đăng nhập
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ message: 'Thiếu userName hoặc password' });
  }

  try {
    const [rows] = await db.query(
      'SELECT IdUser, UserName FROM User WHERE UserName = ? AND Password = ?',
      [userName, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { idUser: user.IdUser, userName: user.UserName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await db.query('UPDATE User SET Token = ? WHERE IdUser = ?', [token, user.IdUser]);
    res.json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Dịch vụ xác thực token: localhost:PORT/auth
router.get('/auth', verifyToken, (req, res) => {
  res.json({
    message: 'Token hợp lệ',
    user: { idUser: req.user.idUser, userName: req.user.userName },
    expiresAt: new Date(req.user.exp * 1000),
  });
});

module.exports = router;