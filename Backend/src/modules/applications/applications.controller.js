const { poolPromise, sql } = require('../../config/db');

/**
 * GET all applications
 * Public (Authenticated users)
 */
exports.getAll = async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    const isAdmin = req.user?.role === 'IT_ADMIN' || req.user?.role === 'HR_ADMIN';
    const pool = await poolPromise;

    let query = `
      SELECT 
        a.id,
        a.name,
        a.description,
        a.url,
        a.image_url,
        a.owner_email,
        a.is_active,
        c.name AS category
      FROM applications a
      JOIN categories c ON a.category_id = c.id
    `;

    // Filter by is_active for regular users
    let hasWhere = false;
    if (!isAdmin) {
      query += ' WHERE a.is_active = 1';
      hasWhere = true;
    }

    const request = pool.request();

    if (categoryId) {
      query += hasWhere ? ' AND' : ' WHERE';
      query += ' a.category_id = @categoryId';
      request.input('categoryId', sql.Int, categoryId);
      hasWhere = true;
    }

    if (search) {
      query += hasWhere ? ' AND' : ' WHERE';
      query += ' (a.name LIKE @search OR a.description LIKE @search)';
      request.input('search', sql.VarChar, `%${search}%`);
    }

    query += ' ORDER BY a.name';

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

/**
 * CREATE application (HR Admin)
 */
exports.create = async (req, res) => {
  try {
    const {
      name,
      description,
      url,
      image_url,
      category_id,
      owner_email
    } = req.body;

    const createdBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('url', sql.VarChar, url)
      .input('image_url', sql.VarChar, image_url)
      .input('category_id', sql.Int, category_id)
      .input('owner_email', sql.VarChar, owner_email)
      .input('createdBy', sql.VarChar, createdBy)
      .query(`
        INSERT INTO applications
          (name, description, url, image_url, category_id, owner_email, is_active, created_by)
        VALUES
          (@name, @description, @url, @image_url, @category_id, @owner_email, 1, @createdBy)
      `);

    res.json({ message: 'Application created successfully' });

  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ message: 'Failed to create application' });
  }
};

/**
 * UPDATE application (HR Admin)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      url,
      image_url,
      category_id,
      owner_email
    } = req.body;

    const updatedBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('url', sql.VarChar, url)
      .input('image_url', sql.VarChar, image_url)
      .input('category_id', sql.Int, category_id)
      .input('owner_email', sql.VarChar, owner_email)
      .input('updatedBy', sql.VarChar, updatedBy)
      .query(`
        UPDATE applications
        SET
          name = @name,
          description = @description,
          url = @url,
          image_url = @image_url,
          category_id = @category_id,
          owner_email = @owner_email,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = @updatedBy
        WHERE id = @id
      `);

    res.json({ message: 'Application updated successfully' });

  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ message: 'Failed to update application' });
  }
};

/**
 * SOFT DELETE application (IT Admin)
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE applications
        SET is_active = 0
        WHERE id = @id
      `);

    res.json({ message: 'Application removed successfully' });

  } catch (err) {
    console.error('Delete application error:', err);
    res.status(500).json({ message: 'Failed to remove application' });
  }
};

/**
 * TOGGLE STATUS application (IT Admin)
 */
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE applications
        SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
        WHERE id = @id
      `);

    res.json({ message: 'Application status updated successfully' });

  } catch (err) {
    console.error('Toggle application status error:', err);
    res.status(500).json({ message: 'Failed to toggle application status' });
  }
};
