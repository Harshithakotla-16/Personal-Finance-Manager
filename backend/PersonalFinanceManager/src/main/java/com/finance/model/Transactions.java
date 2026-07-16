package com.finance.model;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Transactions {
	private Long transactionId;
	private String transactionSource;
	private Long transactionAmount;
	private String transactionDate;
	private String transactionTime;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	public Transactions() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Transactions(Long transactionId, String transactionSource, Long transactionAmount, String transactionDate,
			String transactionTime, User user) {
		super();
		this.transactionId = transactionId;
		this.transactionSource = transactionSource;
		this.transactionAmount = transactionAmount;
		this.transactionDate = transactionDate;
		this.transactionTime = transactionTime;
		this.user = user;
	}
	@Override
	public String toString() {
		return "Transactions [transactionId=" + transactionId + ", transactionSource=" + transactionSource
				+ ",user=" + user + ", transactionAmount=" + transactionAmount + ", transactionDate=" + transactionDate
				+ ", transactionTime=" + transactionTime + "]";
	}
	public Long getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(Long transactionId) {
		this.transactionId = transactionId;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getTransactionSource() {
		return transactionSource;
	}
	public void setTransactionSource(String transactionSource) {
		this.transactionSource = transactionSource;
	}
	public Long getTransactionAmount() {
		return transactionAmount;
	}
	public void setTransactionAmount(Long transactionAmount) {
		this.transactionAmount = transactionAmount;
	}
	public String getTransactionDate() {
		return transactionDate;
	}
	public void setTransactionDate(String transactionDate) {
		this.transactionDate = transactionDate;
	}
	public String getTransactionTime() {
		return transactionTime;
	}
	public void setTransactionTime(String transactionTime) {
		this.transactionTime = transactionTime;
	}
	
	
}
