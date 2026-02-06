const { poolPromise, sql } = require('../../config/db');

/**
 * GET all important contacts
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
        name,
        designation,
        department,
        email,
        phone,
        is_active
      FROM important_contacts
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
      query += ' (name LIKE @search OR designation LIKE @search OR department LIKE @search)';
      request.input('search', sql.VarChar, `%${search}%`);
    }

    query += ' ORDER BY name';

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error('Fetch contacts error:', err);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

/**
 * CREATE contact (IT Admin)
 */
exports.create = async (req, res) => {
  try {
    const { name, designation, department, email, phone } = req.body;
    const createdBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('name', sql.VarChar, name)
      .input('designation', sql.VarChar, designation)
      .input('department', sql.VarChar, department)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('createdBy', sql.VarChar, createdBy)
      .query(`
        INSERT INTO important_contacts
          (name, designation, department, email, phone, is_active, created_by)
        VALUES
          (@name, @designation, @department, @email, @phone, 1, @createdBy)
      `);

    res.json({ message: 'Contact created successfully' });

  } catch (err) {
    console.error('Create contact error:', err);
    res.status(500).json({ message: 'Failed to create contact' });
  }
};

/**
 * UPDATE contact (IT Admin)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, email, phone } = req.body;
    const updatedBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('designation', sql.VarChar, designation)
      .input('department', sql.VarChar, department)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('updatedBy', sql.VarChar, updatedBy)
      .query(`
        UPDATE important_contacts
        SET
          name = @name,
          designation = @designation,
          department = @department,
          email = @email,
          phone = @phone,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = @updatedBy
        WHERE id = @id
      `);

    res.json({ message: 'Contact updated successfully' });

  } catch (err) {
    console.error('Update contact error:', err);
    res.status(500).json({ message: 'Failed to update contact' });
  }
};

/**
 * DELETE contact (IT Admin)
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE important_contacts
        SET is_active = 0
        WHERE id = @id
      `);

    res.json({ message: 'Contact deleted successfully' });

  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
};

/**
 * TOGGLE STATUS contact (IT Admin)
 */
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE important_contacts
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = @id
      `);

    res.json({ message: 'Contact status updated successfully' });

  } catch (err) {
    console.error('Toggle contact status error:', err);
    res.status(500).json({ message: 'Failed to toggle contact status' });
  }
};
