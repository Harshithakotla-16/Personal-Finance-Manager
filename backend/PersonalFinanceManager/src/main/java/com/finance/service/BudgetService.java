package com.finance.service;

import com.finance.model.Budget;
import java.util.List;

public interface BudgetService {

    Budget createBudget(Long userId, Budget budget);

    List<Budget> getAllBudgets(Long userId);

    Budget getBudgetById(Long userId, Long budgetId);

    Budget updateBudget(Long userId, Long budgetId, Budget budget);

    void deleteBudget(Long userId, Long budgetId);

}