const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async function verifyToken(req, res, next) {
  const [scheme, token] = (req.headers['authorization'] || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Thiếu token' });
  }

  try {
    // 1. Kiểm tra chữ ký + hạn dùng
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Đối chiếu với token đã lưu trong DB
    const [rows] = await db.query('SELECT Token FROM User WHERE IdUser = ?', [payload.idUser]);
    if (rows.length === 0 || rows[0].Token !== token) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    req.user = payload;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token đã hết hạn' : 'Token không hợp lệ';
    return res.status(403).json({ message });
  }
};