package com.korit.library.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter{

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
//    -> 보안을 걸지 않게 해주는 코드. 보안을 무시한다.

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.httpBasic().disable(); //    ->기본적으로 제공하는 로그인 창을 없앰
        http.authorizeRequests()
                .antMatchers("/mypage/**", "/security/**") // 인증이 필요하다.
                .authenticated()
                .anyRequest()
                .permitAll() // 위의 설정된 주소 외엔 필요 없음
                .and()
                .formLogin()
                .loginPage("/account/login") //로그인 페이지 get 요청
                .loginProcessingUrl("/account/login") // 로그인 인증 post 요청
                .defaultSuccessUrl("/index");
    }
}
