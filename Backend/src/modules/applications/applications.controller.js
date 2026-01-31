const { poolPromise, sql } = require('../../config/db');

/**
 * GET all applications
 * Public (Authenticated users)
 */
exports.getAll = async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    const pool = await poolPromise;

    let query = `
      SELECT 
        a.id,
        a.name,
        a.description,
        a.url,
        a.image_url,
        a.owner_email,
        c.name AS category
      FROM applications a
      JOIN categories c ON a.category_id = c.id
      WHERE a.is_active = 1
    `;

    const request = pool.request();

    if (categoryId) {
      query += ' AND a.category_id = @categoryId';
      request.input('categoryId', sql.Int, categoryId);
    }

    if (search) {
      query += `
        AND (
          a.name LIKE @search
          OR a.description LIKE @search
        )
      `;
      request.input('search', sql.VarChar, `%${search}%`);
    }

    const result = await request.query(query);

    res.json(result.recordset);

  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

/**
 * CREATE application (IT Admin)
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

    const pool = await poolPromise;

    await pool.request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('url', sql.VarChar, url)
      .input('image_url', sql.VarChar, image_url)
      .input('category_id', sql.Int, category_id)
      .input('owner_email', sql.VarChar, owner_email)
      .query(`
        INSERT INTO applications
          (name, description, url, image_url, category_id, owner_email)
        VALUES
          (@name, @description, @url, @image_url, @category_id, @owner_email)
      `);

    res.json({ message: 'Application created successfully' });

  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ message: 'Failed to create application' });
  }
};

/**
 * UPDATE application (IT Admin)
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

    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('url', sql.VarChar, url)
      .input('image_url', sql.VarChar, image_url)
      .input('category_id', sql.Int, category_id)
      .input('owner_email', sql.VarChar, owner_email)
      .query(`
        UPDATE applications
        SET
          name = @name,
          description = @description,
          url = @url,
          image_url = @image_url,
          category_id = @category_id,
          owner_email = @owner_email
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
