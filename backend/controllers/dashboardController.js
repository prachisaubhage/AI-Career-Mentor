const { getDashboardMetrics } = require('../services/dashboardService');

/**
 * @desc    Get dashboard metrics for the authenticated user
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await getDashboardMetrics(req.user);
    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
