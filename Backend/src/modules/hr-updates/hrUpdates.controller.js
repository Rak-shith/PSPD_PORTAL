const { poolPromise, sql } = require('../../config/db');

/**
 * GET all active HR updates (non-expired) with attachments
 */
exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Fetch HR updates
    const updatesResult = await pool.query(`
      SELECT *
      FROM hr_updates
      WHERE is_active = 1
        AND (end_date IS NULL OR end_date >= CAST(GETDATE() AS DATE))
      ORDER BY created_at DESC
    `);

    const updates = updatesResult.recordset;

    // Fetch attachments for all updates
    if (updates.length > 0) {
      const updateIds = updates.map(u => u.id);

      // Build dynamic query with parameters
      const attachmentsQuery = pool.request();
      updateIds.forEach((id, i) => {
        attachmentsQuery.input(`id${i}`, sql.Int, id);
      });

      const attachments = await attachmentsQuery.query(`
        SELECT *
        FROM hr_update_attachments
        WHERE hr_update_id IN (${updateIds.map((_, i) => `@id${i}`).join(',')})
      `);

      // Group attachments by hr_update_id
      const attachmentsByUpdate = {};
      attachments.recordset.forEach(att => {
        if (!attachmentsByUpdate[att.hr_update_id]) {
          attachmentsByUpdate[att.hr_update_id] = [];
        }
        attachmentsByUpdate[att.hr_update_id].push(att);
      });

      // Add attachments to each update
      updates.forEach(update => {
        update.attachments = attachmentsByUpdate[update.id] || [];
      });
    }

    res.json(updates);

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
 * UPDATE HR update (HR Admin)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, start_date, end_date } = req.body;
    const updatedBy = req.user?.employee_id || req.user?.employeeId;
    const pool = await poolPromise;

    // Update HR update
    await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.VarChar, title)
      .input('content', sql.Text, content)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('updatedBy', sql.VarChar, updatedBy)
      .query(`
        UPDATE hr_updates
        SET title = @title,
            content = @content,
            start_date = @start_date,
            end_date = @end_date,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = @updatedBy
        WHERE id = @id
      `);

    // Handle new attachments if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await pool.request()
          .input('hr_update_id', sql.Int, id)
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

    res.json({ message: 'HR update updated successfully' });

  } catch (err) {
    console.error('Update HR update error:', err);
    res.status(500).json({ message: 'Failed to update HR update' });
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
