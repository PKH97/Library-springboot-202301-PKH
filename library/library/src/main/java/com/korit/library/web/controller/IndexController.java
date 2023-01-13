package com.korit.library.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping({"", "/index"}) // ->{}를 사용하면 두가지 이상의 명령을 줄 수 있다.
    public String index() {
        return "index";
    }
}
