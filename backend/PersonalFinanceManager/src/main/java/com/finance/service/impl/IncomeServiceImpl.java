package com.finance.service.impl;

import com.finance.model.Income;
import com.finance.model.User;
import com.finance.repository.IncomeRepository;
import com.finance.repository.UserRepository;
import com.finance.service.IncomeService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository repository;

    private final UserRepository userRepository;
    
    public IncomeServiceImpl(IncomeRepository repository,
            UserRepository userRepository) {
    	this.repository = repository;
    	this.userRepository = userRepository;
}

    @Override
    public Income addIncome(Long userId, Income income) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        income.setUser(user);

        return repository.save(income);
    }

    @Override
    public List<Income> getAllIncome(Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return List.of();

        return repository.findByUser(user);
    }

    @Override
    public Income getIncomeById(Long userId, Long id) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        return repository.findByIncomeIdAndUser(id, user).orElse(null);
    }

    @Override
    public Income updateIncome(Long userId, Long id, Income income) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return null;

        Income existingIncome =
                repository.findByIncomeIdAndUser(id, user).orElse(null);

        if(existingIncome == null)
            return null;

        existingIncome.setIncomeSource(income.getIncomeSource());
        existingIncome.setIncomeAmount(income.getIncomeAmount());
        existingIncome.setIncomeCategory(income.getIncomeCategory());
        existingIncome.setIncomeDate(income.getIncomeDate());
        existingIncome.setIncomeTime(income.getIncomeTime());
        existingIncome.setIncomeDescription(income.getIncomeDescription());

        return repository.save(existingIncome);
    }

    @Override
    public void deleteIncome(Long userId, Long id) {

        User user = userRepository.findById(userId).orElse(null);

        if(user == null)
            return;

        Income income =
                repository.findByIncomeIdAndUser(id, user).orElse(null);

        if(income != null)
            repository.delete(income);
    }
}