// Import necessary React hooks
import React, { useState, useEffect, useCallback } from 'react';
// Import routing utilities from react-router-dom
import { useParams, useNavigate } from 'react-router-dom';
// Import icons from Lucide React for visual elements
import {Save, X, DollarSign, Tag, FileText, Calendar, Loader2, CheckCircle, AlertCircle} from 'lucide-react';
import axios from 'axios';
// Define available expense categories
const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
];

// Main ExpenseForm component
const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpense = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/expenses/${id}`);
      const expense = response.data;
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: new Date(expense.date).toISOString().split('T')[0]
      });
    } catch (error) {
      setError('Failed to fetch expense details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchExpense();
    }
  }, [id, fetchExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const expenseData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      };

      if (id) {
        await axios.put(`/api/expenses/${id}`, expenseData);
        setSuccess('Expense updated successfully!');
      } else {
        await axios.post('/api/expenses', expenseData);
        setSuccess('Expense added successfully!');
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };
// Show loading spinner while fetching expense data (edit mode only)
  if (loading && id) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

// Main form UI
  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="card-hover">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {id ? 'Edit Expense' : 'Add New Expense'}
          </h1>
          <p className="text-gray-600 text-lg">
            {id ? 'Update your expense details' : 'Track your spending by adding a new expense'}
          </p>
        </div>

        {error && (
          <div className="bg-danger-50 border-2 border-danger-200 text-danger-700 px-6 py-4 rounded-xl mb-6 flex items-center">
            <div className="w-5 h-5 bg-danger-500 rounded-full mr-3"></div>
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success-50 border-2 border-success-200 text-success-700 px-6 py-4 rounded-xl mb-6 flex items-center">
            <div className="w-5 h-5 bg-success-500 rounded-full mr-3"></div>
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Field */}
          <div className="slide-up">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              Amount (₹) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field text-lg font-semibold"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Category Field */}
          <div className="slide-up">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mr-3">
                <Tag className="w-4 h-4 text-white" />
              </div>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select-field text-lg"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description Field */}
          <div className="slide-up">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-white" />
              </div>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none h-24"
              placeholder="Enter expense description..."
              required
            />
          </div>

          {/* Date Field */}
          <div className="slide-up">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 shadow-glow"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{loading ? 'Saving...' : (id ? 'Update Expense' : 'Add Expense')}</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm; 