package com.amr.project.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cart-item")
public class CartItemController {

    @GetMapping("")
    public String getItem(){
        return "shopPage/home-shop-page";
    }
}
