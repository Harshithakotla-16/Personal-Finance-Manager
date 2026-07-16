package com.finance.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finance.model.Expense;
import com.finance.model.Income;
import com.finance.model.User;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>{
	List<Expense> findByUser(User user);
	Optional<Expense> findByExpenseIdAndUser(Long ExpenseId, User user);
	@Query("SELECT COALESCE(SUM(e.expendedAmount),0) FROM Expense e WHERE e.user.id = :userId")
	BigDecimal getTotalExpense(@Param("userId") Long userId);
}
