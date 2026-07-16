package com.finance.service.impl;

import org.springframework.stereotype.Service;

import com.finance.model.Expense;
import com.finance.model.User;
import com.finance.repository.ExpenseRepository;
import com.finance.repository.UserRepository;
import com.finance.service.ExpenseService;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repository;
    
    private final UserRepository userRepository;

    public ExpenseServiceImpl(ExpenseRepository repository,
            UserRepository userRepository) {

    		this.repository = repository;
    		this.userRepository = userRepository;
}

    @Override
    public Expense addExpense(Long userId, Expense expense) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        expense.setUser(user);

        return repository.save(expense);
    }

    @Override
    public List<Expense> getAllExpenses(Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return List.of();

        return repository.findByUser(user);
    }

    @Override
    public Expense getExpenseById(Long userId, Long expenseId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        return repository.findByExpenseIdAndUser(expenseId, user).orElse(null);
    }

    @Override
    public Expense updateExpense(Long userId,
                                 Long expenseId,
                                 Expense expense) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        Expense existingExpense =
                repository.findByExpenseIdAndUser(expenseId, user).orElse(null);

        if(existingExpense == null)
            return null;

        existingExpense.setExpendedOn(expense.getExpendedOn());
        existingExpense.setExpendedAmount(expense.getExpendedAmount());
        existingExpense.setExpenseCategory(expense.getExpenseCategory());
        existingExpense.setExpendedDate(expense.getExpendedDate());
        existingExpense.setExpendedTime(expense.getExpendedTime());
        existingExpense.setExpenseDescription(expense.getExpenseDescription());

        return repository.save(existingExpense);
    }

    @Override
    public void deleteExpense(Long userId,
                              Long expenseId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return;

        Expense expense =
                repository.findByExpenseIdAndUser(expenseId, user).orElse(null);

        if(expense != null)
            repository.delete(expense);
    }
}