package com.finance.service;

import java.util.Map;

public interface DashboardService {

    Map<String, Object> getDashboardSummary(Long userId);

}