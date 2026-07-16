package com.finance.service.impl;

import com.finance.model.Budget;
import com.finance.model.User;
import com.finance.repository.BudgetRepository;
import com.finance.repository.UserRepository;
import com.finance.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public Budget createBudget(Long userId, Budget budget) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        budget.setUser(user);

        if (budget.getBudgetSpent() == null) {
            budget.setBudgetSpent(BigDecimal.ZERO);
        }

        if (budget.getBudgetAmount() != null) {
            budget.setBudgetLeft(
                    budget.getBudgetAmount().subtract(budget.getBudgetSpent()));
        }

        budget.setBudgetStatus(
                calculateStatus(
                        budget.getBudgetAmount(),
                        budget.getBudgetSpent()));

        return budgetRepository.save(budget);
    }

    @Override
    public List<Budget> getAllBudgets(Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return List.of();

        return budgetRepository.findByUser(user);
    }

    @Override
    public Budget getBudgetById(Long userId, Long budgetId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        return budgetRepository
                .findByBudgetIdAndUser(budgetId, user)
                .orElse(null);
    }

    @Override
    public Budget updateBudget(Long userId,
                               Long budgetId,
                               Budget budgetDetails) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        Budget existingBudget =
                budgetRepository
                .findByBudgetIdAndUser(budgetId, user)
                .orElse(null);

        if(existingBudget == null)
            return null;

        existingBudget.setBudgetCategory(
                budgetDetails.getBudgetCategory());

        existingBudget.setBudgetAmount(
                budgetDetails.getBudgetAmount());

        if (budgetDetails.getBudgetSpent() != null) {
            existingBudget.setBudgetSpent(
                    budgetDetails.getBudgetSpent());
        }

        existingBudget.setBudgetLeft(
                existingBudget.getBudgetAmount()
                        .subtract(existingBudget.getBudgetSpent()));

        existingBudget.setBudgetStatus(
                calculateStatus(
                        existingBudget.getBudgetAmount(),
                        existingBudget.getBudgetSpent()));

        return budgetRepository.save(existingBudget);
    }

    @Override
    public void deleteBudget(Long userId,
                             Long budgetId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return;

        Budget budget =
                budgetRepository
                .findByBudgetIdAndUser(budgetId, user)
                .orElse(null);

        if(budget != null)
            budgetRepository.delete(budget);
    }


    private String calculateStatus(BigDecimal amount, BigDecimal spent) {
        if (amount == null || spent == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            return "Unknown";
        }
        
        if (spent.compareTo(amount) > 0) {
            return "Overbudget";
        } 
        
        BigDecimal eightyPercent = amount.multiply(new BigDecimal("0.8"));
        if (spent.compareTo(eightyPercent) >= 0) {
            return "Warning"; 
        } 
        
        return "On Track";
    }
}