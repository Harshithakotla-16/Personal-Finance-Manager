import { useState, useEffect } from "react";
import { getTransactions } from '../services/api'; 
import { FiSearch, FiFilter, FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import Layout from "../components/Layout";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'income', or 'expense'

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Calls the auto-merging function we built in api.js
      const response = await getTransactions();
      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const titleMatch = (transaction.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = (transaction.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || categoryMatch;

    const matchesType = filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="empty-state">
          <p className="empty-state-text">Loading transactions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Transaction History</h1>

        <div className="search-filter" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          <div style={{ position: "relative" }}>
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#57606f",
              }}
            />
            <input
              type="text"
              className="search-input"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <FiFilter
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#57606f",
              }}
            />
            <select
              className="select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ paddingLeft: "36px", height: "100%", margin: 0 }}
            >
              <option value="all">All Transactions</option>
              <option value="income">Incomes Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>

        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Title</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                
                <td>
                  {transaction.type === 'income' ? (
                    <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                      <FiArrowDownRight /> Income
                    </span>
                  ) : (
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                      <FiArrowUpRight /> Expense
                    </span>
                  )}
                </td>

                <td>{transaction.date}</td>
                <td>{transaction.time}</td>
                <td style={{ fontWeight: '500' }}>{transaction.title}</td>
                <td>{transaction.category}</td>
                
                <td style={{ 
                  textAlign: 'right', 
                  fontWeight: 'bold',
                  color: transaction.type === 'income' ? '#22c55e' : '#ef4444' 
                }}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount || 0)}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">No transactions found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;