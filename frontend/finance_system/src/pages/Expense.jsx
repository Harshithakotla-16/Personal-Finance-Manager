import { useState, useEffect } from "react";
import { getExpenses, getExpenseById, addExpense, updateExpense, deleteExpense } from '../services/api'; 
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

import { expenseCategories } from "../data/data";
import Layout from "../components/Layout";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    expenseId: null,
    expendedOn: "",
    expendedAmount: "",
    expenseCategory: expenseCategories[0],
    expenseDescription: "",
    expendedDate: new Date().toISOString().split("T")[0],
    expendedTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response); 
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditMode(true);
      setFormData({
        expenseId: expense.expenseId,
        expendedOn: expense.expendedOn || "",
        expendedAmount: expense.expendedAmount || "",
        expenseCategory: expense.expenseCategory || expenseCategories[0],
        expenseDescription: expense.expenseDescription || "",
        expendedDate: expense.expendedDate || "",
        expendedTime: expense.expendedTime || "",
      });
    } else {
      setEditMode(false);
      setFormData({
        expenseId: null,
        expendedOn: "",
        expendedAmount: "",
        expenseCategory: expenseCategories[0],
        expenseDescription: "",
        expendedDate: new Date().toISOString().split("T")[0],
        expendedTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      expenseId: null,
      expendedOn: "",
      expendedAmount: "",
      expenseCategory: expenseCategories[0],
      expenseDescription: "",
      expendedDate: new Date().toISOString().split("T")[0],
      expendedTime: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
      const expense = {
        ...formData,
        expendedAmount: Number(formData.expendedAmount),
      };

      if (editMode) {
        await updateExpense(formData.expenseId, expense);
      } else {
        await addExpense(expense);
      }

      await fetchExpenses();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving expense", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const name = expense.expendedOn || "";
    const category = expense.expenseCategory || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
          <p className="empty-state-text">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Expenses</h1>

        <div className="search-filter">
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
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
          </div>

          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <FiPlus />
            Add Expense
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* 5. UPDATED TABLE RENDER to use new keys */}
            {filteredExpenses.map((expense) => (
              <tr key={expense.expenseId}>
                <td>{expense.expendedOn}</td>
                <td>{expense.expenseCategory}</td>
                <td>{expense.expendedDate}</td>
                <td>{expense.expendedTime}</td>
                <td className="text-danger" style={{ color: '#ef4444' }}>
                  -{formatCurrency(expense.expendedAmount || 0)}
                </td>
                <td>{expense.expenseDescription}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => handleOpenModal(expense)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(expense.expenseId)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExpenses.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">No expense records found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2 className="modal-title">
                {editMode ? "Edit Expense" : "Add Expense"}
              </h2>
              <button
                className="btn btn-secondary"
                onClick={handleCloseModal}
                style={{ padding: "8px" }}
              >
                <FiX />
              </button>
            </div>

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="expendedOn">Expense Name</label>
                <input
                  type="text"
                  id="expendedOn"
                  name="expendedOn"
                  className="input"
                  placeholder="e.g., Groceries, Rent"
                  value={formData.expendedOn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expendedAmount">Amount</label>
                <input
                  type="number"
                  id="expendedAmount"
                  name="expendedAmount"
                  className="input"
                  placeholder="Enter amount"
                  value={formData.expendedAmount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expenseCategory">Category</label>
                <select
                  id="expenseCategory"
                  name="expenseCategory"
                  className="select"
                  value={formData.expenseCategory}
                  onChange={handleChange}
                  required
                >
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="expendedDate">Date</label>
                <input
                  type="text"
                  id="expendedDate"
                  name="expendedDate"
                  className="input"
                  value={formData.expendedDate}
                  onChange={handleChange}
                  required
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-group">
                <label htmlFor="expendedTime">Time</label>
                <input
                  type="time"
                  id="expendedTime"
                  name="expendedTime"
                  className="input"
                  value={formData.expendedTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="expenseDescription">Description</label>
                <textarea
                  id="expenseDescription"
                  name="expenseDescription"
                  className="input"
                  rows="3"
                  placeholder="Enter description"
                  value={formData.expenseDescription}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#ef4444' }}>
                  {editMode ? "Update Expense" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Expenses;