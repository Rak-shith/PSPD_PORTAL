const { poolPromise, sql } = require('../../config/db');

/**
 * GET all active HR updates (non-expired)
 */
exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.query(`
      SELECT *
      FROM hr_updates
      WHERE is_active = 1
        AND (end_date IS NULL OR end_date >= CAST(GETDATE() AS DATE))
      ORDER BY created_at DESC
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error('Fetch HR updates error:', err);
    res.status(500).json({ message: 'Failed to fetch HR updates' });
  }
};

/**
 * GET latest HR update
 */
exports.getLatest = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.query(`
      SELECT TOP 1 *
      FROM hr_updates
      WHERE is_active = 1
        AND (end_date IS NULL OR end_date >= CAST(GETDATE() AS DATE))
      ORDER BY created_at DESC
    `);

    res.json(result.recordset[0] || null);

  } catch (err) {
    console.error('Fetch latest HR update error:', err);
    res.status(500).json({ message: 'Failed to fetch latest HR update' });
  }
};

/**
 * CREATE HR update (HR Admin)
 */
exports.create = async (req, res) => {
  try {
    const { title, content, start_date, end_date } = req.body;
    const createdBy = req.user.userId;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('title', sql.VarChar, title)
      .input('content', sql.Text, content)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('created_by', sql.Int, createdBy)
      .query(`
        INSERT INTO hr_updates
          (title, content, start_date, end_date, created_by)
        OUTPUT INSERTED.id
        VALUES
          (@title, @content, @start_date, @end_date, @created_by)
      `);

    const hrUpdateId = result.recordset[0].id;

    // Handle attachments
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.request()
          .input('hr_update_id', sql.Int, hrUpdateId)
          .input('file_name', sql.VarChar, file.originalname)
          .input('file_path', sql.VarChar, `/uploads/hr/${file.filename}`)
          .input('file_type', sql.VarChar, file.mimetype)
          .query(`
            INSERT INTO hr_update_attachments
              (hr_update_id, file_name, file_path, file_type)
            VALUES
              (@hr_update_id, @file_name, @file_path, @file_type)
          `);
      }
    }

    res.json({ message: 'HR update created successfully' });

  } catch (err) {
    console.error('Create HR update error:', err);
    res.status(500).json({ message: 'Failed to create HR update' });
  }
};

/**
 * DELETE HR update (soft delete)
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE hr_updates
        SET is_active = 0
        WHERE id = @id
      `);

    res.json({ message: 'HR update removed' });

  } catch (err) {
    console.error('Delete HR update error:', err);
    res.status(500).json({ message: 'Failed to delete HR update' });
  }
};
