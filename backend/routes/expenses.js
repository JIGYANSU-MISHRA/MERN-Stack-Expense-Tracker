//Import express for routing
const express = require('express');
// Create a router instance to handle expense-related routes
const router = express.Router();
// Import the Expense model we defined earlier
const Expense = require('../models/Expense');

// Here I created the POST ROUTE 
// Create a new expense entry
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const newExpense = new Expense({
      user: 'default-user', // Temporary user ID since we removed auth
      amount,
      category,
      description,
      date: date || new Date()
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error('Error creating expense:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Here I created the GET ROUTE 
// To get all expenses sorted by newest first
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ date: -1 })
      .lean();
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Here I created the STATS ROUTE
// To get comprehensive expense statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 },
                average: { $avg: '$amount' }
              }
            }
          ],
          byCategory: [
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { total: -1 } }
          ],
          byMonth: [
            {
              $project: {
                year: { $year: '$date' },
                month: { $month: '$date' },
                amount: 1
              }
            },
            {
              $group: {
                _id: { year: '$year', month: '$month' },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ]
        }
      }
    ]);

    const allData = stats[0].total[0] || { totalAmount: 0, count: 0, average: 0 };
    
    res.json({
      total: allData.totalAmount,
      count: allData.count,
      average: allData.average,
      categoryStats: stats[0].byCategory,
      monthlyStats: stats[0].byMonth
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// I created GET SINGLE ROUTE
// To get a single expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    console.error('Error fetching expense:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

//Here I Use PUT for updating the route
//Update an existing expense

router.put('/:id', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { amount, category, description, date },
      { new: true, runValidators: true }
    );
    res.json(expense);
  } catch (err) {
    console.error('Error updating expense:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

//Here I DELETE ROUTE 
//To delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    await expense.deleteOne();
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Export the router to use in main application
module.exports = router;