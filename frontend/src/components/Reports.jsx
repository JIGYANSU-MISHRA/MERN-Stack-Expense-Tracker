import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartLine, ChartBar, ChartPie, TrendUp, TrendDown, Calendar, Download, Funnel, MagnifyingGlass } from 'phosphor-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import axios from 'axios';

const COLORS = ['#14532D', '#4ADE80', '#F87171', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [expensesResponse, statsResponse] = await Promise.all([
        axios.get('/api/expenses'),
        axios.get('/api/expenses/stats')
      ]);
      setExpenses(expensesResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: '#4ADE80',
      Transportation: '#14532D',
      Entertainment: '#f59e0b',
      Shopping: '#F87171',
      Bills: '#8b5cf6',
      Healthcare: '#f97316',
      Education: '#06b6d4',
      Other: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(exp => new Date(exp.date) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(exp => new Date(exp.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(exp => new Date(exp.date) >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(exp => new Date(exp.date) >= filterDate);
          break;
        default:
          break;
      }
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(exp => exp.category === categoryFilter);
    }

    return filtered;
  };

  const getCategoryData = () => {
    const filtered = getFilteredExpenses();
    const categoryMap = {};
    
    filtered.forEach(expense => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = { name: expense.category, value: 0, count: 0 };
      }
      categoryMap[expense.category].value += expense.amount;
      categoryMap[expense.category].count += 1;
    });

    return Object.values(categoryMap).sort((a, b) => b.value - a.value);
  };

  const getMonthlyComparison = () => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getFullYear() === date.getFullYear() && 
               expDate.getMonth() === date.getMonth();
      });

      months.push({
        month: monthName,
        amount: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        count: monthExpenses.length
      });
    }

    return months;
  };

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#1F2937]">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights into your spending patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card-hover">
          <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Date Range
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="card-hover">
          <label className="block text-sm font-medium text-[#1F2937] mb-2 flex items-center">
            <Funnel className="w-4 h-4 mr-2 text-gray-500" />
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#14532D] rounded-lg flex items-center justify-center mr-3">
              <ChartBar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Filtered Total</p>
              <p className="text-xl font-semibold text-[#1F2937]">
                {formatAmount(getFilteredExpenses().reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#4ADE80] rounded-lg flex items-center justify-center mr-3">
              <ChartLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Transactions</p>
              <p className="text-xl font-semibold text-[#1F2937]">
                {getFilteredExpenses().length}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#F87171] rounded-lg flex items-center justify-center mr-3">
              <TrendUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Average</p>
              <p className="text-xl font-semibold text-[#1F2937]">
                {getFilteredExpenses().length > 0 
                  ? formatAmount(getFilteredExpenses().reduce((sum, exp) => sum + exp.amount, 0) / getFilteredExpenses().length)
                  : '₹0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card-hover">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#14532D] rounded-lg flex items-center justify-center mr-2">
              <ChartPie className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937]">Category Distribution</h3>
          </div>
          {getCategoryData().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${parseFloat(value).toFixed(2)}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>

        <div className="card-hover">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#4ADE80] rounded-lg flex items-center justify-center mr-2">
              <ChartLine className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937]">6-Month Trend</h3>
          </div>
          {getMonthlyComparison().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMonthlyComparison()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#14532D" 
                    strokeWidth={3}
                    dot={{ fill: '#14532D', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="card-hover">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center mr-2">
              <ChartBar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937]">Monthly Comparison</h3>
          </div>
        </div>
        {getMonthlyComparison().length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMonthlyComparison()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#14532D"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

