package com.finance.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Expense {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long expenseId;
	private String expendedOn;
	private Long expendedAmount;
	private String expenseCategory;
	private String expenseDescription;
	private String expendedDate;
	private String expendedTime;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	
	public Expense() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Expense(Long expenseId, String expendedOn, Long expendedAmount, String expendedDate, String expendedTime, User user) {
		super();
		this.expenseId = expenseId;
		this.expendedOn = expendedOn;
		this.expendedAmount = expendedAmount;
		this.expenseCategory = expenseCategory;
		this.expenseDescription = expenseDescription;
		this.expendedDate = expendedDate;
		this.expendedTime = expendedTime;
		this.user = user; 
	}


	@Override
	public String toString() {
		return "Expense [expenseId=" + expenseId + ", expendedOn=" + expendedOn + ", expendedAmount=" + expendedAmount
				+ ",expenseCategory=" + expenseCategory + ",user=" + user + ",expenceDescription=" + expenseDescription +", expendedDate=" + expendedDate + ", expendedTime=" + expendedTime + "]";
	}


	public Long getExpenseId() {
		return expenseId;
	}
	public void setExpenseId(Long expenseId) {
		this.expenseId = expenseId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getExpendedOn() {
		return expendedOn;
	}
	public void setExpendedOn(String expendedOn) {
		this.expendedOn = expendedOn;
	}
	public Long getExpendedAmount() {
		return expendedAmount;
	}
	public void setExpendedAmount(Long expendedAmount) {
		this.expendedAmount = expendedAmount;
	}
	public String getExpenseCategory() {
		return expenseCategory;
	}
	public void setExpenseCategory(String expenseCategory) {
		this.expenseCategory = expenseCategory;
	}
	public String getExpenseDescription() {
		return expenseDescription;
	}
	public void setExpenseDescription(String expenseDescription) {
		this.expenseDescription = expenseDescription;
	}
	public String getExpendedDate() {
		return expendedDate;
	}
	public void setExpendedDate(String expendedDate) {
		this.expendedDate = expendedDate;
	}
	public String getExpendedTime() {
		return expendedTime;
	}
	public void setExpendedTime(String expendedTime) {
		this.expendedTime = expendedTime;
	}
	
	
	
}
