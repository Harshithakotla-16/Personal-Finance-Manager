package com.finance.controller;

import com.finance.model.Budget;
import com.finance.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Allows Vite React app to connect
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping("/budget")
    public ResponseEntity<Budget> createBudget(
            @RequestParam Long userId,
            @RequestBody Budget budget) {

        return ResponseEntity.ok(
                budgetService.createBudget(userId, budget));
    }

    @GetMapping("/budget")
    public ResponseEntity<List<Budget>> getAllBudgets(
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                budgetService.getAllBudgets(userId));
    }

    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<Budget> getBudgetById(
            @RequestParam Long userId,
            @PathVariable Long budgetId) {

        return ResponseEntity.ok(
                budgetService.getBudgetById(userId, budgetId));
    }

    @PutMapping("/budget/{budgetId}")
    public ResponseEntity<Budget> updateBudget(
            @RequestParam Long userId,
            @PathVariable Long budgetId,
            @RequestBody Budget budget) {

        return ResponseEntity.ok(
                budgetService.updateBudget(
                        userId,
                        budgetId,
                        budget));
    }

    @DeleteMapping("/budget/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @RequestParam Long userId,
            @PathVariable Long budgetId) {

        budgetService.deleteBudget(userId, budgetId);

        return ResponseEntity.noContent().build();
    }
}