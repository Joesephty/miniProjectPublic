'use strict'
/* 공통 시작 */
// 현재 페이지의 경로를 가져오기
const currentPath = window.location.pathname;

// 경로에서 마지막 부분을 가져와서 파일 이름 추출
const fileName = currentPath.split('/').pop();

/* A-side 관리자 공지 시작 */
const header = document.querySelector('header'),
    admin_workspace = document.querySelector('.admin_workspace'),
    toggleButton = admin_workspace.querySelector(".toggle-button"),   //"더보기" 또는 "숨기기" 버튼
    hiddenNotices = admin_workspace.querySelector(".hidden-notices"), //숨겨진 공지 내용의 HTML 요소.
    previousMailButton = admin_workspace.querySelector("#previousMailButton"),
    log_time = admin_workspace.querySelector('#log_time');

let today = new Date();
log_time.textContent = today.toLocaleString();

let isExpanded = 0; // 더보기 숨기기 버튼을 제어하는 변수 (0이면 더보기 1이면 숨기기)

toggleButton.addEventListener("click", () => { //더보기 버튼을 클릭했을때
    if (isExpanded) {  //버튼 제어함수
        // 숨기기
        hiddenNotices.style.display = "none"; //숨겨진 공지내용을 안보이게 하기
        toggleButton.textContent = "더보기";  //버튼에 더보기 표시
    } else {
        // 펼치기
        hiddenNotices.style.display = "block"; //숨겨진 공지내용을 보이게 하기
        toggleButton.textContent = "숨기기";   //버튼에 숨기기 표시
    }
    isExpanded = !isExpanded;     // 버튼을 클릭했을떄 공지 상태를 바꿀수 있게 만들어준다 
});
/* A-side 관리자 공지 끝*/

async function loadJSON() {
    try {
        const response = await axios.get("http://localhost:3000/productData"); // JSON 파일 요청
        return response.data; // axios는 응답 데이터를 data 속성에 담아 반환합니다.
        
    } catch (error) {
        console.error("JSON 로드 중 오류 발생:", error);
        return null;
    }
}
/**
 * renderPagination - 페이지네이션 UI를 생성하는 함수
 * 
 * @param {number} currentPage - 현재 페이지 번호
 * @param {number} totalPages - 총 페이지 수
 * @param {HTMLElement} containerElement - 페이지네이션 버튼들을 추가할 DOM 요소
 * @param {Function} prevCallback - '이전' 버튼 클릭 시 호출할 함수
 * @param {Function} nextCallback - '다음' 버튼 클릭 시 호출할 함수
 */

function renderPagination(currentPage, totalPages, containerElement, prevCallback, nextCallback) {
    // 컨테이너의 기존 내용을 초기화
    containerElement.innerHTML = "";

    // '이전' 버튼 생성
    const prevButton = document.createElement("button");
    prevButton.textContent = "이전";
    // 현재 페이지가 1이면 '이전' 버튼 비활성화
    prevButton.disabled = (currentPage === 1);
    prevButton.addEventListener("click", () => {
        // prevCallback 함수가 있으면 호출
        if (prevCallback) {
            prevCallback();
        }
    });
    containerElement.appendChild(prevButton);

    // 페이지 정보 표시 (예: "1 / 5")
    const pageInfo = document.createElement("span");
    pageInfo.textContent = ` ${currentPage} / ${totalPages} `;
    containerElement.appendChild(pageInfo);

    // '다음' 버튼 생성
    const nextButton = document.createElement("button");
    nextButton.textContent = "다음";
    // 현재 페이지가 마지막 페이지이면 '다음' 버튼 비활성화
    nextButton.disabled = (currentPage === totalPages);
    nextButton.addEventListener("click", () => {
        if (nextCallback) {
            nextCallback();
        }
    });
    containerElement.appendChild(nextButton);
}




/* 네비에서 현재 위치가 어디있는지 표시해준다 */
const menu__item = admin_workspace.getElementsByClassName('menu__item');

menu__item[2].style.borderRight = 'none';

/* 공통 끝 */


/* productmanagement 시작*/
let locationX = (screen.width - 1000) / 2;    // 팝업창의 중앙 배치를 위한 수평 좌표값 측정.
let locationY = (screen.height - 900);   // 팝업창의 중앙 배치를 위한 수직 좌표값 측정.


// 전역 변수: 현재 페이지 번호와 한 페이지당 표시할 행(row)의 개수
let currentPage = 1;   // 현재 페이지 번호
const rowsPerPage = 10;// 페이지당 표시할 행

// 텍스트 길이 제한 함수
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

async function product__inventory() {
    const inventory_list = document.getElementById("inventory_list");
    inventory_list.innerHTML = ""; // 기존 데이터 초기화

    const products = await loadJSON(); // JSON 데이터 가져오기
    console.log("받은 데이터:", products);

    const totalProducts = products.length;
    console.log(totalProducts);

    const totalPages = Math.ceil(totalProducts / rowsPerPage);

    // 현재 페이지에 해당하는 제품들만 선택 (슬라이스 사용)
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    

    // 선택된 제품들을 테이블에 추가
    paginatedProducts.forEach(productData => {
        let row = `
            
            <tr  class="product-row" data-id="${productData.prdctNo}">
            <td>${productData.id}</td>
            <td>
                    ${productData.prdctNo}
            </td>
            <td>${productData.prdctCategory}</td>
          <td>${productData.prdctName}</td>
          <td>${productData.prdctalcohol}</td>
          <td>${productData.prdctVolume}</td>
          <td>${productData.prdctregion}</td>
          <td>${productData.prdctCompany}</td>
          <td>${productData.prdctPrice}</td>
          <td>${productData.prdctInventory}</td>
          <td>${truncateText(productData.prdctShortDesc, 12)}</td>
          <td><img src="${productData.prdctImgUrl}" alt="${productData.prdctName}" width="50"></td>
          </tr>`;
        inventory_list.innerHTML += row;
    });


    //url로 상품 id값 전달
    // document.querySelectorAll('.product-row').forEach(function (row) {
    //     row.addEventListener('click', function () {
    //         // data-id 속성 값을 읽어옵니다.
    //         const id = row.getAttribute('data-id');
    //         window.location.href = 'admin_product_detail.html?id=' + encodeURIComponent(id);
    //     });
    // });


    document.querySelectorAll('.product-row').forEach(function (row) {
        row.addEventListener('click', () => {
            const productId = row.getAttribute('data-id'); // data-id 속성 값 가져오기
            sessionStorage.setItem('prdctNo', productId);
            open('./admin_product_detail.html', '팝업창1', `width=1000px, height=700px, left=${locationX}px, top=${locationY}px`);
        });
    })


    // 페이지네이션 컨테이너 요소 가져오기
    const paginationContainer = document.getElementById("pagination");
    if (paginationContainer) {
        // renderPagination 함수를 호출하여 페이지네이션 UI 생성
        renderPagination(currentPage, totalPages, paginationContainer, () => {
            // '이전' 버튼 클릭 시 실행할 함수: 현재 페이지 감소 후 다시 렌더링
            if (currentPage > 1) {
                currentPage--;
                product__inventory();
            }
        }, () => {
            // '다음' 버튼 클릭 시 실행할 함수: 현재 페이지 증가 후 다시 렌더링
            if (currentPage < totalPages) {
                currentPage++;
                product__inventory();
            }
        });
    }
}

// 페이지 로드 시 product__inventory() 실행
document.addEventListener("DOMContentLoaded", product__inventory);

//상품 추가 창 열기
const newprod = document.getElementById("newprod");
newprod.addEventListener('click', () => {
    open('./newproduct.html', '팝업창2', `width=1000px, height=700px, left=${locationX}px, top=${locationY}px`);
});


/* 정리
loadJSON() → JSON 파일을 불러와 객체로 변환.
product__inventory() → JSON 데이터를 HTML 테이블에 추가.
DOMContentLoaded 이벤트 → 페이지 로드 시 product__inventory() 실행.
addProductDetail() → 폼 입력 데이터를 서버에 저장하고 admin.html로 이동.
*/

async function searchProduct() {         //검색 이벤트
    const searchValue = document.getElementById("searchInput").value;
    const inventory_list = document.getElementById("inventory_list");
    inventory_list.innerHTML = "";
    const product = await loadJSON(); // JSON 데이터 가져오기

    const filteredProduct = product.filter(productData => {
        const searchLower = searchValue.toLowerCase();
        return String(productData.prdctNo).includes(searchLower) ||
               productData.prdctName.toLowerCase().includes(searchLower);
    });
    console.log(filteredProduct);
    

    filteredProduct.forEach(productData => {
        let row = `<tr  class="product-row" data-id="${productData.prdctNo}">
            <td>${productData.id}</td>
            <td>${productData.prdctNo}</td>
            <td>${productData.prdctCategory}</td>
          <td>${productData.prdctName}</td>
          <td>${productData.prdctalcohol}</td>
          <td>${productData.prdctVolume}</td>
          <td>${productData.prdctregion}</td>
          <td>${productData.prdctCompany}</td>
          <td>${productData.prdctPrice}</td>
          <td>${productData.prdctInventory}</td>
          <td>${truncateText(productData.prdctShortDesc, 12)}</td>
          <td><img src="${productData.prdctImgUrl}" alt="${productData.prdctName}" width="50"></td>
          </tr>`;
          inventory_list.innerHTML += row;
    });
};

//키보드 엔터 이벤트
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // 폼 자동 제출 방지
        searchProduct(); // 검색 실행
    }
});
/* productmanagement 끝 */