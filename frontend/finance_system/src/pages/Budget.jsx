import { useState, useEffect } from "react";
import { getBudget, getBudgetById, updateBudget, deleteBudget, addBudget, getExpenses } from '../services/api'; 

import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Layout from "../components/Layout";

import { categories } from "../data/data"; 

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    budgetId: null,
    budgetCategory: categories[0], // Defaults to 'Housing'
    budgetAmount: "",
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const [budgetResponse, expenseResponse] = await Promise.all([
        getBudget(),
        getExpenses()
      ]);

      const rawBudgets = budgetResponse.data || budgetResponse || [];
      const allExpenses = expenseResponse.data || expenseResponse || [];

      const enrichedBudgets = rawBudgets.map(budget => {
        const safeBudgetCat = (budget.budgetCategory || "").toLowerCase().trim();

        const categoryExpenses = allExpenses.filter(exp => {
          const safeExpCat = (exp.expenseCategory || "").toLowerCase().trim();
          return safeExpCat === safeBudgetCat;
        });

        const totalSpent = categoryExpenses.reduce((sum, exp) => {
           return sum + (Number(exp.expendedAmount || exp.expenseAmount) || 0);
        }, 0);

        const targetAmount = Number(budget.budgetAmount) || 0;
        const amountLeft = targetAmount - totalSpent;

        let status = "On Track";
        if (totalSpent > targetAmount) {
          status = "Overbudget";
        } else if (totalSpent >= (targetAmount * 0.8)) {
          status = "Warning";
        }

        return {
          ...budget,
          budgetSpent: totalSpent,
          budgetLeft: amountLeft,
          budgetStatus: status
        };
      });

      setBudgets(enrichedBudgets); 
      
    } catch (error) {
      console.error("Error fetching budgets or expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setEditMode(true);
      setFormData({
        budgetId: budget.budgetId,
        budgetCategory: budget.budgetCategory || categories[0],
        budgetAmount: budget.budgetAmount || "",
      });
    } else {
      setEditMode(false);
      setFormData({
        budgetId: null,
        budgetCategory: categories[0],
        budgetAmount: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      budgetId: null,
      budgetCategory: categories[0],
      budgetAmount: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const budgetPayload = {
        budgetCategory: formData.budgetCategory,
        budgetAmount: Number(formData.budgetAmount),
      };

      if (editMode) {
        await updateBudget(formData.budgetId, budgetPayload);
      } else {
        await addBudget(budgetPayload);
      }

      await fetchBudgets();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving budget", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this budget category?");
    if (!confirmDelete) return;

    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBudgets = budgets.filter((budget) => {
    const category = budget.budgetCategory || "";
    return category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const totalAmount = budgets.reduce((sum, b) => sum + (Number(b.budgetAmount) || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (Number(b.budgetSpent) || 0), 0);
  const totalRemaining = totalAmount - totalSpent;
  const percentUsed = totalAmount > 0 ? (totalSpent / totalAmount) * 100 : 0;
  
  let progressBarColor = '#3b82f6';
  if (percentUsed >= 75 && percentUsed <= 100) progressBarColor = '#f59e0b';
  if (percentUsed > 100) progressBarColor = '#ef4444';

  if (loading) {
    return (
      <Layout>
        <div className="empty-state">
          <p className="empty-state-text">Loading Budgets...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Budgets</h1>
      </div>

      <div className="card" style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#64748b', fontSize: '1rem', margin: '0 0 12px 0', fontWeight: '600' }}>Monthly Budget Summary</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#1e293b' }}>
            {formatCurrency(totalAmount)}
          </h2>
          <button 
            onClick={() => handleOpenModal()} 
            style={{ 
              background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', 
              padding: '6px 10px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' 
            }}
          >
            <FiEdit2 size={16} />
          </button>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '1rem' }}>
          <span style={{ color: '#334155', fontWeight: '500' }}>Spent: {formatCurrency(totalSpent)}</span>
          <span style={{ margin: '0 12px', color: '#cbd5e1' }}>|</span>
          <span style={{ color: totalRemaining >= 0 ? '#22c55e' : '#ef4444', fontWeight: '500' }}>
            Remaining: {formatCurrency(Math.abs(totalRemaining))}
          </span>
        </div>

        <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(percentUsed, 100)}%`,
            height: '100%',
            backgroundColor: progressBarColor,
            borderRadius: '6px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.9rem', color: '#64748b' }}>
          <span>{percentUsed.toFixed(1)}% of budget used</span>
          <span>{formatCurrency(totalRemaining)} remaining</span>
        </div>
      </div>

      <div className="search-filter" style={{ marginBottom: '24px' }}>
        <div style={{ position: "relative" }}>
          <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#57606f" }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "36px" }}
          />
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus />
          New Category Budget
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Budget</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBudgets.map((budget) => {
              const catPercent = budget.budgetAmount > 0 
                ? Math.min((budget.budgetSpent / budget.budgetAmount) * 100, 100).toFixed(0) 
                : 0;
              
              const isOver = budget.budgetSpent > budget.budgetAmount;

              return (
                <tr key={budget.budgetId}>
                  <td style={{ fontWeight: '500' }}>{budget.budgetCategory}</td>
                  
                  <td>{formatCurrency(budget.budgetAmount || 0)}</td>
                  
                  <td style={{ color: '#ef4444' }}>
                    {formatCurrency(budget.budgetSpent || 0)}
                  </td>
                  
                  <td style={{ color: isOver ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
                    {formatCurrency(budget.budgetLeft || 0)}
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOver ? '#ef4444' : '#22c55e' }}>
                      {isOver ? <FiAlertCircle /> : <FiCheckCircle />}
                      {budget.budgetStatus || (isOver ? "Overbudget" : "On Track")}
                    </div>
                    <div style={{ width: '100%', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', height: '6px', marginTop: '6px' }}>
                      <div style={{ 
                        width: `${catPercent}%`, 
                        background: isOver ? '#ef4444' : (catPercent > 80 ? '#f59e0b' : '#3b82f6'), 
                        height: '100%', 
                        borderRadius: '4px' 
                      }}></div>
                    </div>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleOpenModal(budget)}>
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(budget.budgetId)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredBudgets.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">No active budgets found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="modal-title">{editMode ? "Edit Budget Limit" : "Create Budget"}</h2>
              <button className="btn btn-secondary" onClick={handleCloseModal} style={{ padding: "8px" }}>
                <FiX />
              </button>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="budgetCategory">Category</label>
                <select
                  id="budgetCategory"
                  name="budgetCategory"
                  className="select"
                  value={formData.budgetCategory}
                  onChange={handleChange}
                  required
                >
                  {/* 2. Map directly from your new categories array */}
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budgetAmount">Target Amount</label>
                <input
                  type="number"
                  id="budgetAmount"
                  name="budgetAmount"
                  className="input"
                  placeholder="Enter budget limit"
                  value={formData.budgetAmount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3b82f6' }}>
                  {editMode ? "Update Budget" : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Budget;