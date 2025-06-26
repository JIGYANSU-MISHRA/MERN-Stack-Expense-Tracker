// Import necessary React hooks and components
import React, { useState, useEffect, useCallback } from 'react';
// Import chart components from Recharts library for data visualization
import {PieChart, Pie,Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';
// Import icons from Lucide React for visual elements
import {Plus, TrendingUp, Wallet, Receipt, DollarSign, Calendar, ArrowRight, PieChart as PieChartIcon, BarChart3, TrendingDown, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Define color palette for charts
const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
// Main Dashboard component
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsResponse, expensesResponse] = await Promise.all([
        axios.get('/api/expenses/stats'),
        axios.get('/api/expenses')
      ]);

      setStats(statsResponse.data);
      setAllExpenses(expensesResponse.data);
      setRecentExpenses(expensesResponse.data.slice(0, 5));
    } catch (error) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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

  const getCategoryChartData = () => {
    if (!stats?.categoryStats) return [];
    return stats.categoryStats.map(item => ({
      name: item._id,
      value: item.total
    }));
  };

  // Generate monthly data from actual expenses
  const getMonthlyData = () => {
    if (!allExpenses.length) return [];

    const monthlyData = {};
    
    allExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          expenses: 0,
          count: 0
        };
      }
      
      monthlyData[monthKey].expenses += expense.amount;
      monthlyData[monthKey].count += 1;
    });

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      })
      .slice(-6); // Get last 6 months
  };

  // Generate spending trend data from actual expenses
  const getSpendingTrendData = () => {
    if (!allExpenses.length) return [];

    const dailyData = {};
    const currentDate = new Date();
    
    // Initialize last 30 days with 0 amounts
    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      dailyData[dateKey] = {
        date: dayName,
        amount: 0
      };
    }

    // Add actual expense data
    allExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      if (dailyData[expenseDate]) {
        dailyData[expenseDate].amount += expense.amount;
      }
    });

    return Object.values(dailyData);
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
          <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Track and analyze your expenses with beautiful insights</p>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="btn-primary flex items-center space-x-2 shadow-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {error && (
        <div className="bg-danger-50 border-2 border-danger-200 text-danger-700 px-6 py-4 rounded-xl flex items-center">
          <div className="w-5 h-5 bg-danger-500 rounded-full mr-3"></div>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-3xl font-bold gradient-text">
                {formatAmount(stats?.total || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Receipt className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average per Transaction</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.count > 0 ? formatAmount(stats.total / stats.count) : '₹0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card slide-up">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories Used</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.categoryStats?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section 1 - Pie Chart and Monthly Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie Chart */}
        <div className="card-hover">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Expense by Category</h3>
          </div>
          {getCategoryChartData().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCategoryChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${parseFloat(value).toFixed(2)}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No data available for chart</p>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Expenses Bar Chart */}
        <div className="card-hover">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Monthly Expenses</h3>
          </div>
          {getMonthlyData().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getMonthlyData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="url(#expenseGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No monthly data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section 2 - Spending Trend and Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Trend Area Chart */}
        <div className="card-hover">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center mr-3">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">30-Day Spending Trend</h3>
          </div>
          {getSpendingTrendData().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getSpendingTrendData()}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    interval={6}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Daily Spending']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fill="url(#trendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No spending trend data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Recent Expenses</h3>
            </div>
            <button
              onClick={() => navigate('/expenses')}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-300"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-primary-50 hover:to-secondary-50 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatAmount(expense.amount)}</p>
                    <span 
                      className="category-badge text-xs"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    >
                      {expense.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
              <p className="text-gray-600 mb-6">Add your first expense to see it here!</p>
              <button
                onClick={() => navigate('/add')}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 