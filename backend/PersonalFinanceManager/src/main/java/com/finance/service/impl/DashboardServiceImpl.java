package com.finance.service.impl;

import com.finance.repository.BudgetRepository;
import com.finance.repository.ExpenseRepository;
import com.finance.repository.IncomeRepository;
import com.finance.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Override
    public Map<String, Object> getDashboardSummary(Long userId){
    	BigDecimal totalIncome = incomeRepository.getTotalIncome(userId);

    	BigDecimal totalExpense = expenseRepository.getTotalExpense(userId);

    	BigDecimal totalBudget = budgetRepository.getTotalBudget(userId);

        BigDecimal currentBalance = totalIncome.subtract(totalExpense);
        BigDecimal remainingBudget = totalBudget.subtract(totalExpense);

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalIncome", totalIncome);
        dashboard.put("totalExpense", totalExpense);
        dashboard.put("currentBalance", currentBalance);
        dashboard.put("totalBudget", totalBudget);
        dashboard.put("remainingBudget", remainingBudget);

        return dashboard;
    }
}