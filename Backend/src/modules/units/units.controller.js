const { poolPromise } = require('../../config/db');

exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.query(`
      SELECT id, code, name
      FROM units
      WHERE is_active = 1
      ORDER BY name
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch units error:', err);
    res.status(500).json({ message: 'Failed to fetch units' });
  }
};
