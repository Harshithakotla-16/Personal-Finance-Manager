import axios from "axios";
const getUserId = () => localStorage.getItem("userId");

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});


  export const register = (data) => api.post('/users/register', data);
  export const login = (data) => api.post('/users/login', data);

//Income
export const getIncome = async () => {
  const response = await api.get(
    `/income/get?userId=${getUserId()}`
  );

  return response.data;
};

export const getIncomeById = async (id) => {
  const response = await api.get(`/income/get/${id}`);
  return response.data;
};

export const addIncome = async (income) => {
  const response = await api.post(
    `/income/post?userId=${getUserId()}`,
    income
  );

  return response.data;
};

export const updateIncome = async (id, income) => {
  const response = await api.put(
    `/income/update/${id}?userId=${getUserId()}`,
    income
  );

  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await api.delete(
    `/income/delete/${id}?userId=${getUserId()}`
  );

  return response.data;
};


//Expenses
export const getExpenses = async () => {
  const response = await api.get(
    `/expense/get?userId=${getUserId()}`
  );

  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await api.get(`/expense/get/${id}`);
  return response.data;
};

export const addExpense = async (expense) => {
  const response = await api.post(
    `/expense/post?userId=${getUserId()}`,
    expense
  );

  return response.data;
};

export const updateExpense = async (id, expense) => {
  const response = await api.put(
    `/expense/update/${id}?userId=${getUserId()}`,
    expense
  );

  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(
    `/expense/delete/${id}?userId=${getUserId()}`
  );

  return response.data;
};

//Budget
  export const getBudget = () => api.get(`/budget?userId=${getUserId()}`);
  export const getBudgetById = (id) => api.get(`/budget/${id}`);
  export const addBudget =  (data) => api.post(`/budget?userId=${getUserId()}`, data);
  export const updateBudget = (id, data) => api.put(`/budget/${id}?userId=${getUserId()}`, data);
  export const deleteBudget = (id) => api.delete(`/budget/${id}?userId=${getUserId()}`);


//Dashboard
  export const getDashboard = async () => {
    try {
      const [dashboardRes, incomeRes, expenseRes] = await Promise.all([
        api.get(`/dashboard/get?userId=${getUserId()}`),
        api.get(`/income/get?userId=${getUserId()}`),
        api.get(`/expense/get?userId=${getUserId()}`)
      ]);

      const kpis = dashboardRes.data || {};
      const incomes = incomeRes.data || [];
      const expenses = expenseRes.data || [];

      const formattedIncomes = incomes.map(inc => ({
        id: `inc_${inc.incomeId}`,
        type: 'income',
        title: inc.incomeSource,
        amount: Number(inc.incomeAmount) || 0,
        date: inc.incomeDate || "",
        category: inc.incomeCategory || "Uncategorized"
      }));

      const formattedExpenses = expenses.map(exp => ({
        id: `exp_${exp.expenseId}`,
        type: 'expense',
        title: exp.expendedOn || exp.expenseName || "Expense",
        amount: Number(exp.expendedAmount || exp.expenseAmount) || 0,
        date: exp.expendedDate || exp.expenseDate || "",
        category: exp.expenseCategory || "Uncategorized"
      }));

      const allTransactions = [...formattedIncomes, ...formattedExpenses];
      
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      const monthlyData = {};
      allTransactions.forEach(t => {
        if (!t.date) return;
        const month = t.date.substring(0, 7); 
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        monthlyData[month][t.type] += t.amount;
      });
      
      const monthlySummary = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

      return {
        balance: kpis.currentBalance || 0,
        totalIncome: kpis.totalIncome || 0,
        totalExpenses: kpis.totalExpense || 0, 
        budget: kpis.totalBudget || 0,
        remainingBudget: kpis.remainingBudget || 0,
        
        recentTransactions: allTransactions.slice(0, 5),
        monthlySummary,
      };

    } catch (error) {
      console.error("Error generating dashboard:", error);
      throw error;
    }
  }

//Transactions
  export const getTransactions = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        api.get(`/income/get?userId=${getUserId()}`),
        api.get(`/expense/get?userId=${getUserId()}`)
      ]);

      const incomes = incomeRes.data.map(inc => ({
        id: `inc_${inc.incomeId}`, 
        type: 'income',
        title: inc.incomeSource,
        amount: inc.incomeAmount,
        category: inc.incomeCategory,
        date: inc.incomeDate,
        time: inc.incomeTime,
      }));

      const expenses = expenseRes.data.map(exp => ({
        id: `exp_${exp.expenseId}`,
        type: 'expense',
        title: exp.expendedOn || exp.expenseName,
        amount: exp.expendedAmount || exp.expenseAmount,
        category: exp.expenseCategory,
        date: exp.expendedDate || exp.expenseDate,
        time: exp.expendedTime || exp.expenseTime,
      }));

      const allTransactions = [...incomes, ...expenses];

      allTransactions.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA; 
      });

      return { data: allTransactions }; 

    } catch (error) {
      console.error("Error generating transactions:", error);
      throw error;
    }
  }

  //password
export const getProfile = () =>
  api.get(`/users/profile?userId=${getUserId()}`);

export const updateProfile = (user) =>
  api.put(`/users/profile?userId=${getUserId()}`, user);
  
  export const changePassword = (passwordData) =>
    api.put(
        `/users/change-password?userId=${getUserId()}`,
        passwordData
    );

//REPORTS
  export const getReports = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        api.get(`/income/get?userId=${getUserId()}`),
        api.get(`/expense/get?userId=${getUserId()}`)
      ]);

      const incomes = incomeRes.data || [];
      const expenses = expenseRes.data || [];

      const totalIncome = incomes.reduce((sum, item) => sum + (Number(item.incomeAmount) || 0), 0);

      const categoryTotals = {};
      const totalExpenses = expenses.reduce((sum, item) => {
        const amount = Number(item.expendedAmount || item.expenseAmount) || 0;
        const category = item.expenseCategory || "Uncategorized";

        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        return sum + amount;
      }, 0);

      const expenseByCategory = Object.entries(categoryTotals).map(
        ([name, value]) => ({ name, value })
      );

      const monthlyData = {};

      incomes.forEach(inc => {
        const date = inc.incomeDate; 
        if (!date) return;
        const month = date.substring(0, 7);
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        monthlyData[month].income += (Number(inc.incomeAmount) || 0);
      });

      expenses.forEach(exp => {
        const date = exp.expendedDate || exp.expenseDate;
        if (!date) return;
        const month = date.substring(0, 7); 
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        monthlyData[month].expense += (Number(exp.expendedAmount || exp.expenseAmount) || 0);
      });

      const monthlySummary = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

      return {
        expenseByCategory,
        monthlySummary,
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
      };

    } catch (error) {
      console.error("Error generating reports:", error);
      throw error;
    }
  }


export default api;