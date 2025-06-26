// Import React hooks for state management and side effects
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Receipt, Calendar, DollarSign, Loader2, AlertCircle} from 'lucide-react';
import axios from 'axios';

const getCategoryColor = (category) => {
  const colors = {
    Food: '#22c55e',
    Transportation: '#0ea5e9',
    Entertainment: '#f59e0b',
    Shopping: '#ef4444',
    Bills: '#8b5cf6',
    Healthcare: '#f97316',
    Education: '#06b6d4',
    Other: '#6b7280'
  };
  return colors[category] || '#6b7280';
};
// Main ExpenseList component
const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, expense: null });
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
// Handle expense deletion
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/api/expenses/${deleteDialog.expense._id}`);
      setExpenses(expenses.filter(exp => exp._id !== deleteDialog.expense._id));
      setDeleteDialog({ open: false, expense: null });
    } catch (error) {
      setError('Failed to delete expense');
    } finally {
      setDeleting(false);
    }
  };

// Format date to local string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text">All Expenses</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage and track all your expenses</p>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="btn-primary flex items-center space-x-2 shadow-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Expense</span>
        </button>
      </div>

      {error && (
        <div className="bg-danger-50 border-2 border-danger-200 text-danger-700 px-6 py-4 rounded-xl flex items-center">
          <div className="w-5 h-5 bg-danger-500 rounded-full mr-3"></div>
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="card-hover text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Receipt className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No expenses found</h3>
          <p className="text-gray-600 mb-8 text-lg">Add your first expense to get started!</p>
          <button
            onClick={() => navigate('/add')}
            className="btn-primary flex items-center space-x-2 mx-auto shadow-glow"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>
      ) : (
        <div className="card-hover overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-white" />
                      </div>
                      <span>Description</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2 justify-end">
                      <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span>Amount</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="expense-row">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDate(expense.date)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-gray-900">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatAmount(expense.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => navigate(`/edit/${expense._id}`)}
                          className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md"
                          title="Edit expense"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ open: true, expense })}
                          className="w-10 h-10 bg-gradient-to-br from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-danger-500 to-danger-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Expense</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to delete "{deleteDialog.expense?.description}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteDialog({ open: false, expense: null })}
                  className="btn-secondary flex-1"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger flex-1 flex items-center justify-center space-x-2"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList; 