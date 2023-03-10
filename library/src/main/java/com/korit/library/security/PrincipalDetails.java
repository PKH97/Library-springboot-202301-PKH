package com.korit.library.security;

import com.korit.library.entity.RoleDtl;
import com.korit.library.entity.RoleMst;
import com.korit.library.entity.UserMst;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import springfox.documentation.service.OAuth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@AllArgsConstructor
public class PrincipalDetails implements UserDetails, OAuth2User {

    @Getter
    private final UserMst user;
    private Map<String, Object> response;


    // 권한을 리스트로 관리하는 부분
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        ArrayList<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        List<RoleDtl> roleDtlList = user.getRoleDtl();
        for (int i = 0; i < roleDtlList.size(); i++) {
            RoleDtl dtl = roleDtlList.get(i); //0 = ROLE_USER, 1= ROLE_ADMIN
            RoleMst roleMst =  dtl.getRoleMst();
            String roleName = roleMst.getRoleName();

            GrantedAuthority role = new GrantedAuthority() {
                @Override
                public String getAuthority() {
                    return roleName;
                }
            };
            authorities.add(role);
        }

        // 람다식으로 만든것 (위의 리스트 코드와 동일)
//        user.getRoleDtlDto().forEach(dtl -> {
//            authorities.add(() -> dtl.getRoleMstDto().getRoleName());
//        });

        return authorities;
    }


    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /* 계정 만료 여부 */
    //휴면 계정
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /* 계정 잠김 여부 */
    // 계정의 블랙리스트
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /* 비밀번호 만료 여부 */
    //비밀번호 일정횟수 이상 틀렸을때
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /* 사용자 활성화 여부 */
    //전화번호나 이메일 인증을 거치지 않으면 false
    @Override
    public boolean isEnabled() {
        return true;
    }


    // OAuth 의 오버라이드
    @Override
    public String getName() {
        return user.getName();
    }

    @Override
    public Map<String, Object> getAttributes() { //유저정보가 다 들어있음. 중요함
        return response;
    }
}
