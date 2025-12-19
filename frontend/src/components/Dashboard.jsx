import React, { useState, useEffect, useCallback } from 'react';
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Plus, TrendUp, TrendDown, Wallet, Receipt, CurrencyDollar, Calendar, ArrowRight, ChartPie as PieChartIcon, ChartBar, Activity, Clock, CalendarBlank, Funnel, MagnifyingGlass } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
const COLORS = ['#14532D', '#4ADE80', '#F87171', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

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
        api.get('/api/expenses/stats'),
        api.get('/api/expenses')
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

  const getCategoryChartData = () => {
    if (!stats?.categoryStats) return [];
    return stats.categoryStats.map(item => ({
      name: item._id,
      value: item.total
    }));
  };

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

  const getThisMonthExpenses = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
    }).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getLastMonthExpenses = () => {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    
    return allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    }).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getWeeklyAverage = () => {
    if (!allExpenses.length) return 0;
    const weeklyTotal = allExpenses.slice(-7).reduce((sum, exp) => sum + exp.amount, 0);
    return weeklyTotal / 7;
  };

  const getTopCategories = () => {
    if (!stats?.categoryStats) return [];
    return [...stats.categoryStats]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const getCategoryBreakdown = () => {
    if (!stats?.categoryStats) return [];
    return stats.categoryStats.map(item => ({
      category: item._id,
      amount: item.total,
      count: item.count || 0,
      percentage: stats.total > 0 ? ((item.total / stats.total) * 100).toFixed(1) : 0
    })).sort((a, b) => b.amount - a.amount);
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
      <div className="card-hover bg-gradient-to-r from-[#14532D] to-[#166534] text-white p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-2">Welcome to Your Expense Dashboard</h1>
            <p className="text-white/90 text-lg mb-3">
              Take control of your finances with comprehensive expense tracking and insightful analytics. 
              Monitor your spending patterns, identify trends, and make informed financial decisions.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <TrendUp className="w-4 h-4" />
                <span className="text-sm">Track Spending</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <ChartBar className="w-4 h-4" />
                <span className="text-sm">View Analytics</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Monitor Trends</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/add')}
              className="bg-white text-[#14532D] hover:bg-gray-100 font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Expense</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1F2937]">Financial Overview</h2>
          <p className="text-gray-600 mt-1">Quick insights into your spending habits and financial health</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#14532D] rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {formatAmount(stats?.total || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#4ADE80] rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {stats?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#4ADE80] rounded-lg flex items-center justify-center">
                  <CurrencyDollar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Average per Transaction</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {stats?.count > 0 ? formatAmount(stats.total / stats.count) : '₹0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#14532D] rounded-lg flex items-center justify-center">
                  <TrendUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Categories Used</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {stats?.categoryStats?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#F87171] rounded-lg flex items-center justify-center">
                  <CalendarBlank className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {formatAmount(getThisMonthExpenses())}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {formatAmount(getLastMonthExpenses())}
                </p>
                {getLastMonthExpenses() > 0 && (
                  <p className={`text-xs mt-1 ${getThisMonthExpenses() > getLastMonthExpenses() ? 'text-[#F87171]' : 'text-[#4ADE80]'}`}>
                    {getThisMonthExpenses() > getLastMonthExpenses() ? (
                      <span className="flex items-center">
                        <TrendUp className="w-3 h-3 mr-1" />
                        {(((getThisMonthExpenses() - getLastMonthExpenses()) / getLastMonthExpenses()) * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <TrendDown className="w-3 h-3 mr-1" />
                        {(((getLastMonthExpenses() - getThisMonthExpenses()) / getLastMonthExpenses()) * 100).toFixed(1)}%
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Weekly Average</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {formatAmount(getWeeklyAverage())}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#06b6d4] rounded-lg flex items-center justify-center">
                  <ChartBar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-[#1F2937]">
                  {formatAmount(allExpenses.slice(-7).reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
                <p className="text-xs text-gray-500 mt-1">{allExpenses.slice(-7).length} transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card-hover">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#14532D] rounded-lg flex items-center justify-center mr-2">
              <PieChartIcon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937]">Expense by Category</h3>
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
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No data available for chart</p>
              </div>
            </div>
          )}
        </div>

        <div className="card-hover">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#4ADE80] rounded-lg flex items-center justify-center mr-2">
              <ChartBar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937]">Monthly Expenses</h3>
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
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="#14532D"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartBar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No monthly data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-hover lg:col-span-2">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-[#4ADE80] rounded-lg flex items-center justify-center mr-2">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937]">30-Day Spending Trend</h3>
          </div>
          {getSpendingTrendData().length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getSpendingTrendData()}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4ADE80" 
                    strokeWidth={2}
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

        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#14532D] rounded-lg flex items-center justify-center mr-2">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937]">Recent Expenses</h3>
            </div>
            <button
              onClick={() => navigate('/expenses')}
              className="text-[#14532D] hover:text-[#166534] font-medium flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    ></div>
                    <div>
                      <p className="font-medium text-[#1F2937] text-sm">{expense.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1F2937]">{formatAmount(expense.amount)}</p>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    >
                      {expense.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-[#1F2937] mb-1">No expenses yet</h3>
              <p className="text-sm text-gray-600 mb-4">Add your first expense to see it here!</p>
              <button
                onClick={() => navigate('/add')}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#F87171] rounded-lg flex items-center justify-center mr-2">
                <TrendUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937]">Top Spending Categories</h3>
            </div>
          </div>
          {getTopCategories().length > 0 ? (
            <div className="space-y-4">
              {getTopCategories().map((category, index) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: getCategoryColor(category._id) }}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#1F2937]">{category._id}</span>
                        <span className="font-semibold text-[#1F2937]">{formatAmount(category.total)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(category.total / (stats?.total || 1)) * 100}%`,
                            backgroundColor: getCategoryColor(category._id)
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((category.total / (stats?.total || 1)) * 100).toFixed(1)}% of total expenses
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>

        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center mr-2">
                <Funnel className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937]">Category Breakdown</h3>
            </div>
          </div>
          {getCategoryBreakdown().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600">Category</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600">Amount</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600">Count</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-gray-600">%</th>
                  </tr>
                </thead>
                <tbody>
                  {getCategoryBreakdown().map((item) => (
                    <tr key={item.category} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(item.category) }}
                          ></div>
                          <span className="text-sm font-medium text-[#1F2937]">{item.category}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right text-sm font-semibold text-[#1F2937]">
                        {formatAmount(item.amount)}
                      </td>
                      <td className="py-2 px-2 text-right text-sm text-gray-600">
                        {item.count}
                      </td>
                      <td className="py-2 px-2 text-right text-sm text-gray-600">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 