package com.finance.controller;

import com.finance.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/get")
    public Map<String, Object> getDashboardSummary(
            @RequestParam Long userId) {

        return dashboardService.getDashboardSummary(userId);
    }
}