const { poolPromise, sql } = require('../../config/db');

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
    .input('name', sql.VarChar, name)
    .input('description', sql.VarChar, description)
    .query(`
      INSERT INTO categories (name, description)
      VALUES (@name, @description)
    `);

  res.json({ message: 'Category created' });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const pool = await poolPromise;

  await pool.request()
    .input('id', sql.Int, id)
    .input('name', sql.VarChar, name)
    .input('description', sql.VarChar, description)
    .query(`
      UPDATE categories
      SET name = @name, description = @description
      WHERE id = @id
    `);

  res.json({ message: 'Category updated' });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const pool = await poolPromise;

  await pool.request()
    .input('id', sql.Int, id)
    .query(`
      UPDATE categories
      SET is_active = 0
      WHERE id = @id
    `);

  res.json({ message: 'Category deleted' });
};
