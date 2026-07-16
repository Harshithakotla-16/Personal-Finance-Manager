package com.finance.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets") 
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetId;

    private String budgetCategory;
    private BigDecimal budgetAmount;
    private BigDecimal budgetSpent;
    private BigDecimal budgetLeft;
    private String budgetStatus; 
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
  
    public Budget() {
    }

    
    
    @Override
	public String toString() {
		return "Budget [budgetId=" + budgetId + ", budgetCategory=" + budgetCategory + ", budgetAmount=" + budgetAmount
				+ ", budgetSpent=" + budgetSpent + ", user=" + user + ",budgetLeft=" + budgetLeft + ", budgetStatus=" + budgetStatus
				+ "]";
	}



    public Long getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Long budgetId) {
        this.budgetId = budgetId;
    }
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}

    public String getBudgetCategory() {
        return budgetCategory;
    }

    public void setBudgetCategory(String budgetCategory) {
        this.budgetCategory = budgetCategory;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public BigDecimal getBudgetSpent() {
        return budgetSpent;
    }

    public void setBudgetSpent(BigDecimal budgetSpent) {
        this.budgetSpent = budgetSpent;
    }

    public BigDecimal getBudgetLeft() {
        return budgetLeft;
    }

    public void setBudgetLeft(BigDecimal budgetLeft) {
        this.budgetLeft = budgetLeft;
    }

    public String getBudgetStatus() {
        return budgetStatus;
    }

    public void setBudgetStatus(String budgetStatus) {
        this.budgetStatus = budgetStatus;
    }
}