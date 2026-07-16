import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard } from 'react-icons/fi';

import { getDashboard } from '../services/api';
import Layout from '../components/Layout';

const COLORS = ['#3742fa', '#2ed573', '#ff4757', '#ffa502', '#747d8c', '#1e90ff'];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();

      const transactions = data.recentTransactions || [];
      
      const expenseByCategory = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount || 0);
          return acc;
        }, {});

      const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
      }));

      setDashboardData({
        ...data,
        expenseCategories: pieData,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="empty-state">
          <p className="empty-state-text">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="empty-state">
          <p className="empty-state-text">No data available</p>
        </div>
      </Layout>
    );
  }

  const { 
    balance = 0, 
    totalIncome = 0, 
    totalExpenses = 0, 
    budget = 0, 
    recentTransactions = [], 
    monthlySummary = [], 
    expenseCategories = [] 
  } = dashboardData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="summary-card">
          <div className="summary-icon balance">
            <FiDollarSign />
          </div>
          <div className="summary-info">
            <h3>Total Balance</h3>
            <p>{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon income">
            <FiTrendingUp />
          </div>
          <div className="summary-info">
            <h3>Total Income</h3>
            <p className="text-success">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon expense">
            <FiTrendingDown />
          </div>
          <div className="summary-info">
            <h3>Total Expenses</h3>
            <p className="text-danger">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon budget">
            <FiCreditCard />
          </div>
          <div className="summary-info">
            <h3>Budget</h3>
            <p>{formatCurrency(budget)}</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="chart-container" style={{ flex: 2 }}>
          <h3 className="chart-title">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#2ed573" name="Income" />
              <Bar dataKey="expense" fill="#ff4757" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container" style={{ flex: 1 }}>
          <h3 className="chart-title">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-transactions">
        <h3 className="chart-title">Recent Transactions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.title}</td>
                <td>{transaction.category}</td>
                <td>{transaction.date}</td>
                <td
                  className={
                    transaction.type === 'income'
                      ? 'text-success'
                      : 'text-danger'
                  }
                >
                  {transaction.type === 'income' ? '+' : ''}
                  {formatCurrency(Math.abs(transaction.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {recentTransactions.length === 0 && (
          <div className="empty-state" style={{ marginTop: '16px' }}>
            <p className="empty-state-text">No recent transactions to display.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;