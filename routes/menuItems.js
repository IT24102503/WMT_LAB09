const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.available !== undefined) {
      filter.available = req.query.available === 'true';
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu item', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create menu item', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update menu item', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
});

module.exports = router;
