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

import { getReports } from '../services/api'; 
import Layout from '../components/Layout';

const COLORS = ['#3742fa', '#2ed573', '#ff4757', '#ffa502', '#747d8c', '#1e90ff', '#9b59b6'];

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR', 
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="empty-state">
          <p className="empty-state-text">Loading Reports...</p>
        </div>
      </Layout>
    );
  }

  if (!reports) {
    return (
      <Layout>
        <div className="empty-state">
          <p className="empty-state-text">No reports available</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
      </div>

      <div className="dashboard-grid">
        <div className="summary-card">
          <div className="summary-icon income">
            <span style={{ fontSize: '24px' }}>📈</span>
          </div>
          <div className="summary-info">
            <h3>Total Income</h3>
            <p className="text-success">{formatCurrency(reports.totalIncome)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon expense">
            <span style={{ fontSize: '24px' }}>📉</span>
          </div>
          <div className="summary-info">
            <h3>Total Expenses</h3>
            <p className="text-danger">{formatCurrency(reports.totalExpenses)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon balance">
            <span style={{ fontSize: '24px' }}>💰</span>
          </div>
          <div className="summary-info">
            <h3>Net Savings</h3>
            <p className={reports.netIncome >= 0 ? 'text-success' : 'text-danger'}>
              {formatCurrency(reports.netIncome)}
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon budget">
            <span style={{ fontSize: '24px' }}>📊</span>
          </div>
          <div className="summary-info">
            <h3>Savings Rate</h3>
            <p>
              {reports.totalIncome > 0
                ? ((reports.netIncome / reports.totalIncome) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="chart-container" style={{ flex: 2 }}>
          <h3 className="chart-title">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={reports.monthlySummary}>
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
      </div>

      <div className="row" style={{ marginTop: '24px' }}>
        <div className="chart-container">
          <h3 className="chart-title">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reports.expenseByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {reports.expenseByCategory.map((entry, index) => (
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

        <div className="chart-container">
          <h3 className="chart-title">Category Breakdown</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reports.expenseByCategory.map((cat, index) => {
                const total = reports.expenseByCategory.reduce(
                  (sum, c) => sum + c.value,
                  0
                );
                const percentage = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={cat.name}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '2px',
                            background: COLORS[index % COLORS.length],
                          }}
                        />
                        {cat.name}
                      </div>
                    </td>
                    <td>{formatCurrency(cat.value)}</td>
                    <td>{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;