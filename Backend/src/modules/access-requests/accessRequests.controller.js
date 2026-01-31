const { poolPromise, sql } = require('../../config/db');

/**
 * CREATE access request (Employee)
 */
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { application_id, reason } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('user_id', sql.Int, userId)
      .input('application_id', sql.Int, application_id)
      .input('reason', sql.VarChar, reason)
      .query(`
        INSERT INTO employee_access_requests
          (user_id, application_id, reason)
        VALUES
          (@user_id, @application_id, @reason)
      `);

    res.json({ message: 'Access request submitted successfully' });

  } catch (err) {
    console.error('Create access request error:', err);
    res.status(500).json({ message: 'Failed to submit access request' });
  }
};

/**
 * GET all access requests (IT Admin)
 */
exports.getAllRequests = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.query(`
      SELECT
        r.id,
        u.email AS requested_by,
        a.name AS application,
        r.reason,
        r.status,
        r.requested_at
      FROM employee_access_requests r
      JOIN users u ON r.user_id = u.id
      JOIN applications a ON r.application_id = a.id
      ORDER BY r.requested_at DESC
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error('Fetch access requests error:', err);
    res.status(500).json({ message: 'Failed to fetch access requests' });
  }
};

/**
 * UPDATE request status (Future use)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED / REJECTED
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE employee_access_requests
        SET status = @status
        WHERE id = @id
      `);

    res.json({ message: 'Request status updated' });

  } catch (err) {
    console.error('Update access request error:', err);
    res.status(500).json({ message: 'Failed to update request status' });
  }
};
