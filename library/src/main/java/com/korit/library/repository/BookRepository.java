package com.korit.library.repository;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public class BookRepository {
    /* < 도서 DB 의 CRUD 구성 >
        C: 도서등록
        R: 도서전체조회
            도서 검색
                1. 도서코드
                2. 도서명
                3. 저자
                4. 출판사
                    1. 전체 조회
                    2. 20개씩 가져오기
        U: 도서수정
        D: 도서삭제
     */
}
