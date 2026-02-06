const { poolPromise, sql } = require('../../config/db');

exports.create = async (req, res) => {
  const { holiday_date, name, description, unit_ids } = req.body;
  const createdBy = req.user?.employee_id || req.user?.employeeId;
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const holidayResult = await transaction.request()
      .input('holiday_date', sql.Date, holiday_date)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('createdBy', sql.VarChar, createdBy)
      .query(`
        INSERT INTO holidays (holiday_date, name, description, created_by)
        OUTPUT INSERTED.id
        VALUES (@holiday_date, @name, @description, @createdBy)
      `);

    const holidayId = holidayResult.recordset[0].id;

    for (const unitId of unit_ids) {
      await transaction.request()
        .input('holiday_id', sql.Int, holidayId)
        .input('unit_id', sql.Int, unitId)
        .query(`
          INSERT INTO holiday_units (holiday_id, unit_id)
          VALUES (@holiday_id, @unit_id)
        `);
    }

    await transaction.commit();
    res.json({ message: 'Holiday created successfully' });

  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to create holiday' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { holiday_date, name, description, unit_ids } = req.body;
  const updatedBy = req.user?.employee_id || req.user?.employeeId;
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Update holiday
    await transaction.request()
      .input('id', sql.Int, id)
      .input('holiday_date', sql.Date, holiday_date)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('updatedBy', sql.VarChar, updatedBy)
      .query(`
        UPDATE holidays
        SET holiday_date = @holiday_date,
            name = @name,
            description = @description,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = @updatedBy
        WHERE id = @id
      `);

    // Delete existing unit associations
    await transaction.request()
      .input('holiday_id', sql.Int, id)
      .query(`
        DELETE FROM holiday_units
        WHERE holiday_id = @holiday_id
      `);

    // Insert new unit associations
    for (const unitId of unit_ids) {
      await transaction.request()
        .input('holiday_id', sql.Int, id)
        .input('unit_id', sql.Int, unitId)
        .query(`
          INSERT INTO holiday_units (holiday_id, unit_id)
          VALUES (@holiday_id, @unit_id)
        `);
    }

    await transaction.commit();
    res.json({ message: 'Holiday updated successfully' });

  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to update holiday' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // Delete unit associations
    await transaction.request()
      .input('holiday_id', sql.Int, id)
      .query(`
        DELETE FROM holiday_units
        WHERE holiday_id = @holiday_id
      `);

    // Delete holiday
    await transaction.request()
      .input('id', sql.Int, id)
      .query(`
        DELETE FROM holidays
        WHERE id = @id
      `);

    await transaction.commit();
    res.json({ message: 'Holiday deleted successfully' });

  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ message: 'Failed to delete holiday' });
  }
};

exports.getByUnit = async (req, res) => {
  try {
    const { unitId } = req.query;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('unitId', sql.Int, unitId)
      .query(`
        SELECT
          h.id,
          h.holiday_date,
          h.name,
          h.description
        FROM holidays h
        JOIN holiday_units hu ON h.id = hu.holiday_id
        WHERE hu.unit_id = @unitId
        ORDER BY h.holiday_date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch holidays error:', err);
    res.status(500).json({ message: 'Failed to fetch holidays' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.query(`
      SELECT
        h.id,
        h.holiday_date,
        h.name,
        h.description,
        STRING_AGG(u.name, ', ') AS units
      FROM holidays h
      LEFT JOIN holiday_units hu ON h.id = hu.holiday_id
      LEFT JOIN units u ON hu.unit_id = u.id
      GROUP BY h.id, h.holiday_date, h.name, h.description
      ORDER BY h.holiday_date
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Fetch holidays error:', err);
    res.status(500).json({ message: 'Failed to fetch holidays' });
  }
};

// Get unit associations for a specific holiday
exports.getHolidayUnits = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('holiday_id', sql.Int, id)
      .query(`
        SELECT unit_id
        FROM holiday_units
        WHERE holiday_id = @holiday_id
      `);

    res.json(result.recordset.map(r => r.unit_id));
  } catch (err) {
    console.error('Fetch holiday units error:', err);
    res.status(500).json({ message: 'Failed to fetch holiday units' });
  }
};
