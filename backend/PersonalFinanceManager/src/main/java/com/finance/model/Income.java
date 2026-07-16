package com.finance.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Income {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "income_id")
	private Long incomeId;
	private String incomeSource;
	private String incomeCategory;
	private String incomeDescription;
	private Long incomeAmount;
	private String incomeDate;
	private String incomeTime;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	
	public Income() {
		super();
	}
	
	
	public Income(Long incomeId, String incomeSource, Long incomeAmount, String incomeDate, String incomeTime, String incomeCategory, User user) {
		super();
		this.incomeId = incomeId;
		this.incomeSource = incomeSource;
		this.incomeAmount = incomeAmount;
		this.incomeCategory = incomeCategory;
		this.incomeDescription = incomeDescription;
		this.incomeDate = incomeDate;
		this.incomeTime = incomeTime;
		this.user = user;
	}
	
	
	@Override
	public String toString() {
		return "Income [incomeId=" + incomeId + ", incomeSource=" + incomeSource + ", incomeAmount=" + incomeAmount
				+ "incomeCategory=" + incomeCategory + ",user=" + user + ",incomeDescription=" + incomeDescription + ", incomeDate=" + incomeDate + ", incomeTime=" + incomeTime + "]";
	}
	
	
	public Long getIncomeId() {
		return incomeId;
	}
	public void setIncomeId(Long incomeId) {
		this.incomeId = incomeId;
	}
	public String getIncomeSource() {
		return incomeSource;
	}
	public void setIncomeSource(String incomeSource) {
		this.incomeSource = incomeSource;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getIncomeCategory() {
		return incomeCategory;
	}
	public void setIncomeCategory(String incomeCategory) {
		this.incomeCategory = incomeCategory;
	}
	public String getIncomeDescription() {
		return incomeDescription;
	}
	public void setIncomeDescription(String incomeDescription) {
		this.incomeDescription = incomeDescription;
	}
	public Long getIncomeAmount() {
		return incomeAmount;
	}
	public void setIncomeAmount(Long incomeAmount) {
		this.incomeAmount = incomeAmount;
	}
	public String getIncomeDate() {
		return incomeDate;
	}
	public void setIncomeDate(String incomeDate) {
		this.incomeDate = incomeDate;
	}
	public String getIncomeTime() {
		return incomeTime;
	}
	public void setIncomeTime(String incomeTime) {
		this.incomeTime = incomeTime;
	}
}




