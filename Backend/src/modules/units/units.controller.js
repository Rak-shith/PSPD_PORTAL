const { poolPromise, sql } = require('../../config/db');

/**
 * GET all active units
 */
exports.getAll = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'IT_ADMIN' || req.user?.role === 'HR_ADMIN';
    const pool = await poolPromise;

    // Admins see all, regular users see only active
    const query = isAdmin
      ? 'SELECT id, code, name, is_active FROM units ORDER BY name'
      : 'SELECT id, code, name, is_active FROM units WHERE is_active = 1 ORDER BY name';

    const result = await pool.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch units error:', err);
    res.status(500).json({ message: 'Failed to fetch units' });
  }
};

/**
 * CREATE unit (HR Admin)
 */
exports.create = async (req, res) => {
  try {
    const { code, name } = req.body;
    const createdBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('code', sql.VarChar, code)
      .input('name', sql.VarChar, name)
      .input('createdBy', sql.VarChar, createdBy)
      .query(`
        INSERT INTO units (code, name, is_active, created_by)
        VALUES (@code, @name, 1, @createdBy)
      `);

    res.json({ message: 'Unit created successfully' });

  } catch (err) {
    console.error('Create unit error:', err);
    res.status(500).json({ message: 'Failed to create unit' });
  }
};

/**
 * UPDATE unit (HR Admin)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name } = req.body;
    const updatedBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('code', sql.VarChar, code)
      .input('name', sql.VarChar, name)
      .input('updatedBy', sql.VarChar, updatedBy)
      .query(`
        UPDATE units
        SET code = @code, 
            name = @name,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = @updatedBy
        WHERE id = @id
      `);

    res.json({ message: 'Unit updated successfully' });

  } catch (err) {
    console.error('Update unit error:', err);
    res.status(500).json({ message: 'Failed to update unit' });
  }
};

/**
 * SOFT DELETE unit (IT Admin)
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE units
        SET is_active = 0
        WHERE id = @id
      `);

    res.json({ message: 'Unit deleted successfully' });

  } catch (err) {
    console.error('Delete unit error:', err);
    res.status(500).json({ message: 'Failed to delete unit' });
  }
};

/**
 * TOGGLE STATUS unit (IT Admin)
 */
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE units
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = @id
      `);

    res.json({ message: 'Unit status updated successfully' });

  } catch (err) {
    console.error('Toggle unit status error:', err);
    res.status(500).json({ message: 'Failed to toggle unit status' });
  }
};
