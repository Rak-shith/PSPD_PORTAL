const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../../config/db');

exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query(`
        SELECT u.id, u.email, u.is_active, r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = @email
      `);

    const user = result.recordset[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
    