const { poolPromise, sql } = require('../../config/db');

exports.create = async (req, res) => {
  const { holiday_date, name, description, unit_ids } = req.body;
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const holidayResult = await transaction.request()
      .input('holiday_date', sql.Date, holiday_date)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .query(`
        INSERT INTO holidays (holiday_date, name, description)
        OUTPUT INSERTED.id
        VALUES (@holiday_date, @name, @description)
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
