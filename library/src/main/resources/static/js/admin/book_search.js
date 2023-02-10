window.onload = () => {
    BookService.getInstance().loadBookList();
    BookService.getInstance().loadCategories();
    ComponentEvent.getInstance().addClickEventSearchButton();
    ComponentEvent.getInstance().addClickEventDeleteButton();
    ComponentEvent.getInstance().addClickEventDeleteCheckAll();
}

let searchObj = {
    page : 1,
    category : "",
    searchValue : "",
    order : "bookId",
    limit : "Y",
    count : 20
}

class BookSearchApi {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new BookSearchApi();
        }
        return this.#instance;
    }

    getBookList(searchObj) {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/books",
            data: searchObj,
            dataType: "json",
            success: response => {
                console.log(response);
                returnData = response.data;
            },
            error: error => {
                console.log(error);
            }
        });
        return returnData;
    }

    getBookTotalCount(searchObj) {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/books/totalcount",
            data: {
                "category" : searchObj.category,
                "searchValue" : searchObj.searchValue
            },
            dataType: "json",
            success: response => {
                console.log(response);
                returnData = response.data;
            },
            error: error => {
                console.log(error);
            }
        });
        return returnData;
    }

    getCategories() {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://localhost:8000/api/admin/categories",
            data: searchObj,
            dataType: "json",
            success: response => {
                console.log(response);
                returnData = response.data;
            },
            error: error => {
                console.log(error);
            }
        });

        return returnData;
    }

    deleteBooks(deleteArray) {
        let returnFlag = false; 

        $.ajax({
            async: false, //O
            type: "delete", // 작성안함
            url: "http://localhost:8000/api/admin/books", // O
            contentType: "application/json",
            data: JSON.stringify(
                {
                    userIds: deleteArray //-> 객체정보
                } // 작성안함
            ),
            dataType: "json", // O
            success: response => {
                // console.log(response); -> 오답
                // returnFlag = response.data;
                returnFlag = true; // 정답
            },
            error: error => {
                console.log(error);
            }

        });
        return returnFlag;
    }
}

class BookService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new BookService();
        }
        return this.#instance;
    }
    
    loadBookList() {
        const responseData = BookSearchApi.getInstance().getBookList(searchObj);

        const checkAll = document.querySelector(".delete-checkall");
        checkAll.checked = false;

        // list를 뿌림
        const bookListBody = document.querySelector(".content-table tbody");
        bookListBody.innerHTML = "";

        responseData.forEach((data, index) => {
            bookListBody.innerHTML += `
                <tr>
                    <td><input type="checkbox" class="delete-checkbox"></td>
                    <td class="book-id">${data.bookId}</td>
                    <td>${data.bookCode}</td>
                    <td>${data.bookName}</td>
                    <td>${data.author}</td>
                    <td>${data.publisher}</td>
                    <td>${data.publicationDate}</td>
                    <td>${data.category}</td>
                    <td>${data.rentalStatus == "Y" ? "대여중" : "대여가능"}</td>
                    <td><a href="/templates/admin/book_modification.html?bookCode=${data.bookCode}"><i class="fa-solid fa-square-pen"></i></td>
                </tr>
            `;
        });
        this.loadSearchNumberList();
        ComponentEvent.getInstance().addClickEventDeleteCheckBox();
    }

    loadSearchNumberList() {
        // 페이지 넘버링 버튼 
        const pageController = document.querySelector(".page-controller");
        pageController.innerHTML = "";
        
        const totalCount = BookSearchApi.getInstance().getBookTotalCount(searchObj);
        const maxPageNumer = totalCount % searchObj.count == 0 
                            ? Math.floor(totalCount / searchObj.count) 
                            : Math.floor(totalCount / searchObj.count) + 1;

        pageController.innerHTML = `
            <a href="javascript:void(0)" class="pre-button disabled">이전</a>
            <ul class="page-numbers">
            </ul>
            <a href="javascript:void(0)" class="next-button disabled">다음</a>
        `;

        //이전 페이지 버튼
        if(searchObj.page != 1) {
            const preButton = pageController.querySelector(".pre-button");
            preButton.classList.remove("disabled");

            preButton.onclick = () => {
                searchObj.page--;
                this.loadBookList();
            }
        }

        //다음 페이지 버튼
        if(searchObj.page != maxPageNumer) {
            const nextButton = pageController.querySelector(".next-button");
            nextButton.classList.remove("disabled");

            nextButton.onclick = () => {
                searchObj.page++;
                this.loadBookList();
            }
        }

        //숫자 버튼
        const startIndex = searchObj.page % 5 == 0 
                        ? searchObj.page - 4 
                        : searchObj.page - (searchObj.page % 5) + 1;

        const endIndex = startIndex + 4 <= maxPageNumer ? startIndex + 4 : maxPageNumer;

        const pageNumbers = document.querySelector(".page-numbers");

        for(let i = startIndex; i <= endIndex; i++) {
            pageNumbers.innerHTML += `
                <a href="javascript:void(0)"class="page-button ${i == searchObj.page ? "disabled" : ""}"><li>${i}</li></a>
            `;
        }

        const pageButtons = document.querySelectorAll(".page-button");
        pageButtons.forEach(button => {
            const pageNumber = button.textContent;
            if(pageNumber != searchObj.page) {
                button.onclick = () => {
                    searchObj.page = pageNumber;
                    this.loadBookList();
                }
            }
        });
    }

    loadCategories() {
        const responseData = BookSearchApi.getInstance().getCategories();

        const categorySelect = document.querySelector(".category-select");
        categorySelect.innerHTML = `<option value="">전체조회</option>`;

        responseData.forEach(data => {
            categorySelect.innerHTML += `
                <option value="${data.category}">${data.category}</option>
            `;
        });
    }

    removeBooks(deleteArray) {
        let successFlag = BookSearchApi.getInstance().deleteBooks(deleteArray);
        if(successFlag) {
            searchObj.page = 1;
            this.loadBookList();
        } //-> 정답

        // const deleteData = BookSearchApi.getInstance().deleteBooks(deleteArray);
        // const removeButton = document.querySelector(".delete-button");
        // removeButton.innerHTML = `<button type="button" class="delete-button">삭제</button>`;
        // deleteData.forEach(button => {
        //     const aaa = button.textContent;
        // }); -> 내가 작성한 답
    }
}

class ComponentEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new ComponentEvent();
        }
        return this.#instance;
    }

    addClickEventSearchButton() {
        const categorySelect = document.querySelector(".category-select");
        const searchInput = document.querySelector(".search-input");
        const searchButton = document.querySelector(".search-button");

        searchButton.onclick = () => {
            searchObj.category = categorySelect.value;
            searchObj.searchValue = searchInput.value;
            searchObj.page = 1;

            BookService.getInstance().loadBookList();
        }

        searchInput.onkeyup = () => {
            if(window.event.keyCode == 13){
                searchButton.click();
            }
        }
    }

    addClickEventDeleteButton() {
        const deleteButton = document.querySelector(".delete-button");

        deleteButton.onclick = () => {
            if(confirm("정말로 삭제하시겠습니까?")) { //-> 정답
                const deleteArray = new Array();

                const deleteCheckboxs = document.querySelectorAll(".delete-checkbox");
    
                deleteCheckboxs.forEach((deleteCheckbox, index) => {
                    if(deleteCheckbox.checked) {
                        const bookIds = document.querySelectorAll(".book-id");
                        deleteArray.push(bookIds[index].textContent);
                        console.log(bookIds[index].textContent);
                    }
                });
    
                BookService.getInstance().removeBooks(deleteArray); // -> 정답
            }
        }
    }

    addClickEventDeleteCheckAll() {
        const checkAll = document.querySelector(".delete-checkall");

        checkAll.onclick = () => {
            const deleteCheckboxs = document.querySelectorAll(".delete-checkbox");
            deleteCheckboxs.forEach(deleteCheckbox => {
                deleteCheckbox.checked = checkAll.checked;
            });
        }
    }

    addClickEventDeleteCheckBox() {
        const deleteCheckboxs = document.querySelectorAll(".delete-checkbox");
        const checkAll = document.querySelector(".delete-checkall");

        deleteCheckboxs.forEach(deleteCheckbox => {
            deleteCheckbox.onclick = () => {
                const deleteCheckedCheckboxs = document.querySelectorAll(".delete-checkbox:checked");
                console.log("선택: " + deleteCheckedCheckboxs.length);
                console.log("전체: " + deleteCheckboxs.length);

                if(deleteCheckedCheckboxs.length == deleteCheckboxs.length) {
                    checkAll.checked = true;
                }else {
                    checkAll.checked = false;
                }
            }
        });
    }

}
