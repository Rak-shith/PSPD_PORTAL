const { poolPromise, sql } = require('../../config/db');

/**
 * GET all important contacts
 * Supports search
 */
exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const pool = await poolPromise;

    let query = `
      SELECT
        id,
        name,
        designation,
        department,
        email,
        phone
      FROM important_contacts
    `;

    const request = pool.request();

    if (search) {
      query += `
        WHERE
          name LIKE @search OR
          designation LIKE @search OR
          department LIKE @search
      `;
      request.input('search', sql.VarChar, `%${search}%`);
    }

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error('Fetch contacts error:', err);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};
