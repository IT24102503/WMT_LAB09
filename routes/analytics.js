const express = require('express');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Student = require('../models/Student');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [studentCount, menuItemCount, orderCount, revenueResult, ordersByStatus] = await Promise.all([
      Student.countDocuments(),
      MenuItem.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      students: studentCount,
      menuItems: menuItemCount,
      orders: orderCount,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      ordersByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

module.exports = router;
