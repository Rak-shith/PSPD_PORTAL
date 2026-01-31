const { poolPromise, sql } = require('../../config/db');

/**
 * GET user's favorites
 */
exports.getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          f.id AS favorite_id,
          a.id AS application_id,
          a.name,
          a.description,
          a.url,
          a.image_url,
          c.name AS category
        FROM favorites f
        JOIN applications a ON f.application_id = a.id
        JOIN categories c ON a.category_id = c.id
        WHERE f.user_id = @userId
          AND a.is_active = 1
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

/**
 * ADD application to favorites
 */
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { appId } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('appId', sql.Int, appId)
      .query(`
        INSERT INTO favorites (user_id, application_id)
        VALUES (@userId, @appId)
      `);

    res.json({ message: 'Added to favorites' });

  } catch (err) {
    // Duplicate favorite handling
    if (err.number === 2627) {
      return res.status(409).json({ message: 'Already in favorites' });
    }

    console.error('Add favorite error:', err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

/**
 * REMOVE application from favorites
 */
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { appId } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('appId', sql.Int, appId)
      .query(`
        DELETE FROM favorites
        WHERE user_id = @userId
          AND application_id = @appId
      `);

    res.json({ message: 'Removed from favorites' });

  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};
