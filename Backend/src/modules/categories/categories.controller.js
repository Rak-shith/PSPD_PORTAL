const { poolPromise, sql } = require('../../config/db');

exports.getAll = async (req, res) => {
  const pool = await poolPromise;
  const isAdmin = req.user?.role === 'IT_ADMIN' || req.user?.role === 'HR_ADMIN';

  // Admins see all, regular users see only active
  const query = isAdmin
    ? 'SELECT * FROM categories ORDER BY name'
    : 'SELECT * FROM categories WHERE is_active = 1 ORDER BY name';

  const result = await pool.query(query);
  res.json(result.recordset);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user?.employee_id || req.user?.employeeId;
  const pool = await poolPromise;

  await pool.request()
    .input('name', sql.VarChar, name)
    .input('description', sql.VarChar, description)
    .input('createdBy', sql.VarChar, createdBy)
    .query(`
      INSERT INTO categories (name, description, is_active, created_by)
      VALUES (@name, @description, 1, @createdBy)
    `);

  res.json({ message: 'Category created' });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updatedBy = req.user?.employee_id || req.user?.employeeId;
  const pool = await poolPromise;

  await pool.request()
    .input('id', sql.Int, id)
    .input('name', sql.VarChar, name)
    .input('description', sql.VarChar, description)
    .input('updatedBy', sql.VarChar, updatedBy)
    .query(`
      UPDATE categories
      SET name = @name, 
          description = @description,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = @updatedBy
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

exports.toggleStatus = async (req, res) => {
  const { id } = req.params;
  const pool = await poolPromise;

  await pool.request()
    .input('id', sql.Int, id)
    .query(`
      UPDATE categories
      SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END
      WHERE id = @id
    `);

  res.json({ message: 'Category status updated' });
};
