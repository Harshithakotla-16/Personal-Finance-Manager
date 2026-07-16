package com.finance.service;
import java.util.List;
import com.finance.model.Income;

public interface IncomeService {

    Income addIncome(Long userId, Income income);

    List<Income> getAllIncome(Long userId);

    Income getIncomeById(Long userId, Long id);

    Income updateIncome(Long userId, Long id, Income income);

    void deleteIncome(Long userId, Long id);

}