import { useState, useEffect } from "react";
import { getIncome, getIncomeById, addIncome, updateIncome, deleteIncome } from '../services/api'; 
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";


import { incomeCategories } from "../data/data";
import Layout from "../components/Layout";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    incomeId: null,
    incomeSource: "",
    incomeAmount: "",
    incomeCategory: incomeCategories[0],
    incomeDescription: "",
    incomeDate: new Date().toISOString().split("T")[0],
    incomeTime: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  });

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await getIncome();
      setIncomes(response);
    } catch (error) {
      console.error("Error fetching incomes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (income = null) => {
    if (income) {
      setEditMode(true);

      setFormData({
        incomeId: income.incomeId,
        incomeSource: income.incomeSource,
        incomeAmount: income.incomeAmount,
        incomeCategory: income.incomeCategory,
        incomeDescription: income.incomeDescription,
        incomeDate: income.incomeDate,
        incomeTime: income.incomeTime,
      });
    } else {
      setEditMode(false);

      setFormData({
        incomeId: null,
        incomeSource: "",
        incomeAmount: "",
        incomeCategory: incomeCategories[0],
        incomeDescription: "",
        incomeDate: new Date().toISOString().split("T")[0],
        incomeTime: new Date().toLocaleTimeString("en-GB", {
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
      incomeId: null,
      incomeSource: "",
      incomeAmount: "",
      incomeCategory: incomeCategories[0],
      incomeDescription: "",
      incomeDate: new Date().toISOString().split("T")[0],
      incomeTime: new Date().toLocaleTimeString("en-GB", {
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
      const income = {
        ...formData,
        incomeAmount: Number(formData.incomeAmount),
      };

      if (editMode) {
        await updateIncome(formData.incomeId, income);
      } else {
        await addIncome(income);
      }

      await fetchIncomes();

      handleCloseModal();
    } catch (error) {
      console.error("Error saving income", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this income?"
    );

    if (!confirmDelete) return;

    try {
      await deleteIncome(id);

      fetchIncomes();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredIncomes = incomes.filter((income) => {
    return (
      income.incomeSource
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      income.incomeCategory
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
          <p className="empty-state-text">
            Loading...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
            <div className="page-header">
        <h1 className="page-title">Income</h1>

        <div className="search-filter">
          <div style={{ position: "relative" }}>
            <FiSearch style={{position: "absolute",left: "12px",top: "50%",transform: "translateY(-50%)",color: "#57606f"}} />
            <input type="text" className="search-input" placeholder="Search income..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: "36px" }} />
          </div>

          <button className="btn btn-primary" onClick={() => handleOpenModal()} >
            <FiPlus />
            Add Income
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Category</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredIncomes.map((income) => (
              <tr key={income.incomeId}>
                <td>{income.incomeSource}</td>

                <td>{income.incomeCategory}</td>

                <td>{income.incomeDate}</td>

                <td>{income.incomeTime}</td>

                <td className="text-success">
                  {formatCurrency(income.incomeAmount)}
                </td>

                <td>{income.incomeDescription}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() =>
                        handleOpenModal(income)
                      }
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() =>
                        handleDelete(income.incomeId)
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIncomes.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">
              No income records found.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="modal-title">
                {editMode
                  ? "Edit Income"
                  : "Add Income"}
              </h2>

              <button
                className="btn btn-secondary"
                onClick={handleCloseModal}
                style={{ padding: "8px" }}
              >
                <FiX />
              </button>
            </div>

            <form
              className="form"
              onSubmit={handleSubmit}
            >
                          <div className="form-group">
                <label htmlFor="incomeSource">Source</label>
                <input
                  type="text"
                  id="incomeSource"
                  name="incomeSource"
                  className="input"
                  placeholder="Enter income source"
                  value={formData.incomeSource}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="incomeAmount">Amount</label>
                <input
                  type="number"
                  id="incomeAmount"
                  name="incomeAmount"
                  className="input"
                  placeholder="Enter amount"
                  value={formData.incomeAmount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="incomeCategory">Category</label>

                <select
                  id="incomeCategory"
                  name="incomeCategory"
                  className="select"
                  value={formData.incomeCategory}
                  onChange={handleChange}
                  required
                >
                  {incomeCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="incomeDate">Date</label>

                <input
                  type="text"
                  id="incomeDate"
                  name="incomeDate"
                  className="input"
                  value={formData.incomeDate}
                  onChange={handleChange}
                  required
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-group">
                <label htmlFor="incomeTime">Time</label>

                <input
                  type="time"
                  id="incomeTime"
                  name="incomeTime"
                  className="input"
                  value={formData.incomeTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="incomeDescription">
                  Description
                </label>

                <textarea
                  id="incomeDescription"
                  name="incomeDescription"
                  className="input"
                  rows="3"
                  placeholder="Enter description"
                  value={formData.incomeDescription}
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

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editMode
                    ? "Update Income"
                    : "Add Income"}
                </button>
              </div>
              </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Income;