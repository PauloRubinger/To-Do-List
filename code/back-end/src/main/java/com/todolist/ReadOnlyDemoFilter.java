package com.todolist;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ReadOnlyDemoFilter extends OncePerRequestFilter {
    private final boolean readOnly;

    public ReadOnlyDemoFilter(@Value("${demo.read-only:false}") boolean readOnly) {
        this.readOnly = readOnly;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String method = request.getMethod();

        if (readOnly && !method.equals("GET") && !method.equals("HEAD") && !method.equals("OPTIONS")) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "A demonstração está disponível somente para leitura");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
