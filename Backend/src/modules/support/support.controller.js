const { poolPromise, sql } = require('../../config/db');

/**
 * GET all support contacts
 * Supports search
 */
exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const isAdmin = req.user?.role === 'IT_ADMIN';
    const pool = await poolPromise;

    let query = `
      SELECT
        id,
        team_name,
        email,
        phone,
        description,
        is_active
      FROM support_contacts
    `;

    // Filter by is_active for regular users
    let hasWhere = false;
    if (!isAdmin) {
      query += ' WHERE is_active = 1';
      hasWhere = true;
    }

    const request = pool.request();

    if (search) {
      query += hasWhere ? ' AND' : ' WHERE';
      query += ' (team_name LIKE @search OR description LIKE @search)';
      request.input('search', sql.VarChar, `%${search}%`);
    }

    query += ' ORDER BY team_name';

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error('Fetch support error:', err);
    res.status(500).json({ message: 'Failed to fetch support data' });
  }
};

/**
 * CREATE support team (IT Admin)
 */
exports.create = async (req, res) => {
  try {
    const { team_name, description, email, phone } = req.body;
    const createdBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('team_name', sql.VarChar, team_name)
      .input('description', sql.VarChar, description)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('createdBy', sql.VarChar, createdBy)
      .query(`
        INSERT INTO support_contacts
          (team_name, description, email, phone, is_active, created_by)
        VALUES
          (@team_name, @description, @email, @phone, 1, @createdBy)
      `);

    res.json({ message: 'Support team created successfully' });

  } catch (err) {
    console.error('Create support team error:', err);
    res.status(500).json({ message: 'Failed to create support team' });
  }
};

/**
 * UPDATE support team (IT Admin)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { team_name, description, email, phone } = req.body;
    const updatedBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('team_name', sql.VarChar, team_name)
      .input('description', sql.VarChar, description)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('updatedBy', sql.VarChar, updatedBy)
      .query(`
        UPDATE support_contacts
        SET
          team_name = @team_name,
          description = @description,
          email = @email,
          phone = @phone,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = @updatedBy
        WHERE id = @id
      `);

    res.json({ message: 'Support team updated successfully' });

  } catch (err) {
    console.error('Update support team error:', err);
    res.status(500).json({ message: 'Failed to update support team' });
  }
};

/**
 * DELETE support team (IT Admin)
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE support_contacts
        SET is_active = 0
        WHERE id = @id
      `);

    res.json({ message: 'Support team deleted successfully' });

  } catch (err) {
    console.error('Delete support team error:', err);
    res.status(500).json({ message: 'Failed to delete support team' });
  }
};

/**
 * TOGGLE STATUS support team (IT Admin)
 */
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE support_contacts
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = @id
      `);

    res.json({ message: 'Support team status updated successfully' });

  } catch (err) {
    console.error('Toggle support team status error:', err);
    res.status(500).json({ message: 'Failed to toggle support team status' });
  }
};
