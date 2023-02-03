/* 구현해야할 것
    1. 체크박스 들고오는 방식
    2. 화면에 나오는 책의 갯수에 따른 화면 넘버링
    3. 한번에 가져올 도서정보의 양
*/

window.onload = () => {
    // SearchApi.getInstance().getCategories();
    SearchService.getInstance().loadCategosies();

    ComponentEvent.getInstance().addClickEventCategoryCheckboxs();
}

const searchObj = {
    page: 1,
    searchValue: null,
    categories: new Array(),
    count: 10
}



class SearchApi {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new SearchApi();
        }
        return this.#instance;
    }

    getCategories() {
        let returnData = null;

        $.ajax({
            async: false,
            type: "get",
            url: "http://127.0.0.1:8000/api/admin/categories",
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
}




class SearchService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new SearchService();
        }
        return this.#instance;
    }
    
    loadCategosies() {
        const categoryList = document.querySelector('.category-list');
        categoryList.innerHTML = ``;

        const responseData = SearchApi.getInstance().getCategories();
        responseData.forEach(categoryObj => {
            categoryList.innerHTML += `
                <div class="category-item">
                    <input type="checkbox" class="category-checkbox" id="${categoryObj.category}" value="${categoryObj.category}">
                    <label for="${categoryObj.category}">${categoryObj.category}</label>
                </div>
            `;
        });
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

    addClickEventCategoryCheckboxs() {
        const checkboxs = document.querySelectorAll(".category-checkbox");

        checkboxs.forEach(checkbox => {
            checkbox.onclick = () => {
                if(checkbox.checked) {
                    searchObj.categories.push(checkbox.value);
                }else {
                    const index = searchObj.categories.indexOf(checkbox.value);
                    searchObj.categories.splice(index, 1);
                }
                console.log(searchObj.categories);
            }
        });
    }
}



