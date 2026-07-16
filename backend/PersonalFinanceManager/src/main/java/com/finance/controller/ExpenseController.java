package com.finance.controller;

import com.finance.model.Expense;
import com.finance.service.ExpenseService;
import com.finance.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @PostMapping("/post")
    public Expense addExpense(@RequestParam Long userId,
                              @RequestBody Expense expense) {

        return service.addExpense(userId, expense);
    }

    @GetMapping("/get")
    public List<Expense> getAllExpenses(@RequestParam Long userId) {

        return service.getAllExpenses(userId);
    }
    @GetMapping("/get/{expenseId}")
    public Expense getExpenseById(@RequestParam Long userId,
                                  @PathVariable Long expenseId) {

        return service.getExpenseById(userId, expenseId);
    }

    @PutMapping("/update/{expenseId}")
    public Expense updateExpense(@RequestParam Long userId,
                                 @PathVariable Long expenseId,
                                 @RequestBody Expense expense) {

        return service.updateExpense(userId, expenseId, expense);
    }

    @DeleteMapping("/delete/{expenseId}")
    public String deleteExpense(@RequestParam Long userId,
                                @PathVariable Long expenseId) {

        service.deleteExpense(userId, expenseId);

        return "Expense deleted successfully";
    }
}