const { poolPromise, sql } = require('../../config/db');

/**
 * GET all support contacts
 * Supports search
 */
exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const pool = await poolPromise;

    let query = `
      SELECT
        id,
        team_name,
        email,
        phone,
        description
      FROM support_contacts
    `;

    const request = pool.request();

    if (search) {
      query += `
        WHERE
          team_name LIKE @search OR
          description LIKE @search
      `;
      request.input('search', sql.VarChar, `%${search}%`);
    }

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error('Fetch support error:', err);
    res.status(500).json({ message: 'Failed to fetch support data' });
  }
};
