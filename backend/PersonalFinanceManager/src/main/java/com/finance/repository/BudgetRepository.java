package com.finance.repository;

import com.finance.model.Budget;
import com.finance.model.Income;
import com.finance.model.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
	List<Budget> findByUser(User user);
	Optional<Budget> findByBudgetIdAndUser(Long budgetId, User user);
	@Query("SELECT COALESCE(SUM(b.budgetAmount),0) FROM Budget b WHERE b.user.id = :userId")
	BigDecimal getTotalBudget(@Param("userId") Long userId);
	}