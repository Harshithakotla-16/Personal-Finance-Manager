package com.finance.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finance.model.Income;
import com.finance.model.User;

@Repository
public interface IncomeRepository extends JpaRepository<Income,Long>{
	List<Income> findByUser(User user);
	Optional<Income> findByIncomeIdAndUser(Long incomeId, User user);
	@Query("SELECT COALESCE(SUM(i.incomeAmount),0) FROM Income i WHERE i.user.id = :userId")
	BigDecimal getTotalIncome(@Param("userId") Long userId);
}
