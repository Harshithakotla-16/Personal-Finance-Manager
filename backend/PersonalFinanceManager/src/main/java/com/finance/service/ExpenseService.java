package com.finance.service;

import java.util.List;

import com.finance.model.Expense;

public interface ExpenseService {

    Expense addExpense(Long userId, Expense expense);

    List<Expense> getAllExpenses(Long userId);

    Expense getExpenseById(Long userId, Long expenseId);

    Expense updateExpense(Long userId, Long expenseId, Expense expense);

    void deleteExpense(Long userId, Long expenseId);

}