const { poolPromise } = require('../../config/db');

exports.getAll = async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.query(
    'SELECT * FROM categories WHERE is_active = 1'
  );

  res.json(result.recordset);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  const pool = await poolPromise;

  await pool.request()
    .input('name', name)
    .input('description', description)
    .query(`
      INSERT INTO categories (name, description)
      VALUES (@name, @description)
    `);

  res.json({ message: 'Category created' });
};
