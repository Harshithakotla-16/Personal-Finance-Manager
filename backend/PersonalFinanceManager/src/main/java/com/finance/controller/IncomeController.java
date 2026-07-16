package com.finance.controller;

import com.finance.model.Income;
import com.finance.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "http://localhost:5173")
public class IncomeController {

    private final IncomeService service;

    public IncomeController(IncomeService service) {
        this.service = service;
    }

    @PostMapping("/post")
    public Income addIncome(@RequestParam Long userId,
                            @RequestBody Income income) {

        return service.addIncome(userId, income);
    }

    @GetMapping("/get")
    public List<Income> getAllIncome(@RequestParam Long userId) {

        return service.getAllIncome(userId);
    }

    @GetMapping("/get/{id}")
    public Income getIncomeById(@RequestParam Long userId,
                                @PathVariable Long id) {

        return service.getIncomeById(userId, id);
    }

    @PutMapping("/update/{id}")
    public Income updateIncome(@RequestParam Long userId,
                               @PathVariable Long id,
                               @RequestBody Income income) {

        return service.updateIncome(userId, id, income);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteIncome(@RequestParam Long userId,
                               @PathVariable Long id) {

        service.deleteIncome(userId, id);

        return "Income deleted successfully";
    }
}