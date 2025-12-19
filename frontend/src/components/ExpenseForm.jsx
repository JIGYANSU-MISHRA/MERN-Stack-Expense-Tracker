import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FloppyDisk, X, CurrencyDollar, Tag, FileText, Calendar, CircleNotch, CheckCircle, WarningCircle } from 'phosphor-react';
import api from '../config/axios';

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
      const response = await api.get(`/api/expenses/${id}`);
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
        await api.put(`/api/expenses/${id}`, expenseData);
        setSuccess('Expense updated successfully!');
      } else {
        await api.post('/api/expenses', expenseData);
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

  if (loading && id) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-hover">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#14532D] rounded-lg flex items-center justify-center mx-auto mb-4">
            <CurrencyDollar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2937] mb-1">
            {id ? 'Edit Expense' : 'Add New Expense'}
          </h1>
          <p className="text-gray-600">
            {id ? 'Update your expense details' : 'Track your spending by adding a new expense'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <WarningCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
              <CurrencyDollar className="w-4 h-4 mr-2 text-gray-500" />
              Amount (₹) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select-field"
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

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
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

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <CircleNotch className="w-4 h-4 animate-spin" />
              ) : (
                <FloppyDisk className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : (id ? 'Update Expense' : 'Add Expense')}</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1 flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm; 