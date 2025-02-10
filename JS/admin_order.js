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
        const response = await axios.get("http://localhost:3000/promiseOrder"); // JSON 파일 요청
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

/* 공통 끝 */

/* 네비에서 현재 위치가 어디있는지 표시해준다 */
const menu__item = admin_workspace.getElementsByClassName('menu__item');

menu__item[3].style.borderRight = 'none';
/* admin_order 시작 */

// 전역 변수: 현재 페이지 번호와 한 페이지당 표시할 행(row)의 개수
let currentPage = 1;   // 현재 페이지 번호
const rowsPerPage = 10;// 페이지당 표시할 행

async function admin_order() {
    const order_list = document.querySelector('#order_list');

    order_list.innerHTML = ''; // 기존데이터 초기화

    const orderData = await loadJSON();
    console.log(orderData);

    const total_order = orderData.length;
    console.log(total_order); // 배열 길이 출력

    const totalPages = Math.ceil(total_order / rowsPerPage);
    console.log(totalPages);

    // 현재 페이지에 해당하는 제품들만 선택 (슬라이스 사용)
    const startIndex = (currentPage - 1) * rowsPerPage;

    const endIndex = startIndex + rowsPerPage;
    const paginatedOrder = orderData.slice(startIndex, endIndex);
    console.log(paginatedOrder);

    // 선택된 제품들을 테이블에 추가
    paginatedOrder.forEach(promiseOrder => {
        function formatOrderDate(orderDate) {
            // 숫자일 경우 문자열로 변환
            const str = orderDate.toString();

            // 17자리가 아닐 경우 그냥 원래 값을 반환
            if (str.length !== 17) return orderDate;

            // 각 부분을 슬라이스
            const year = str.slice(0, 4);   // "2025"
            const month = str.slice(4, 6);   // "02"
            const day = str.slice(6, 8);   // "07"
            const hour = str.slice(8, 10);  // "17"
            const minute = str.slice(10, 12); // "06"
            const rest = str.slice(12);     // "00105"

            // 포맷팅 예시: "2025년 02월 07일 17시 06분 00105"
            return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${rest}`;

            // 만약 "2025.02.07 17시 06분 00105" 형태로 원한다면 아래처럼 사용:
            // return `${year}.${month}.${day} ${hour}시 ${minute}분 ${rest}`;
        }

        let row = `<tr class="order-row" data-id="${promiseOrder.id}">
            <td>${promiseOrder.id}</td>
            <td>${promiseOrder.orderUserName}</td>
            <td>${promiseOrder.phone}</td>
            <td>${promiseOrder.address}</td>
          <td>${promiseOrder.memo}</td>
          <td>${promiseOrder.productId}</td>
          <td>${promiseOrder.productName}</td>
          <td>${promiseOrder.productPrice}</td>
          <td>${promiseOrder.quantity}</td>
          <td>${Number(promiseOrder.quantity) * Number(promiseOrder.productPrice)}</td>
          <td>${formatOrderDate(promiseOrder.orderDate)}</td>
          <td>${(promiseOrder.bankTransfer) == 0 ? '입금전' : '입금완료'}</td>
          </tr>`;
        order_list.innerHTML += row;
    });

    // 페이지네이션 컨테이너 요소 가져오기
    const paginationContainer = document.getElementById("pagination");
    if (paginationContainer) {
        // renderPagination 함수를 호출하여 페이지네이션 UI 생성
        renderPagination(currentPage, totalPages, paginationContainer, () => {
            // '이전' 버튼 클릭 시 실행할 함수: 현재 페이지 감소 후 다시 렌더링
            if (currentPage > 1) {
                currentPage--;
                admin_order();
            }
        }, () => {
            // '다음' 버튼 클릭 시 실행할 함수: 현재 페이지 증가 후 다시 렌더링
            if (currentPage < totalPages) {
                currentPage++;
                admin_order();
            }
        });
    }
}
// 페이지 로드 시 product__inventory() 실행
document.addEventListener("DOMContentLoaded", admin_order);



/* 검색이벤트 */
async function searchOrder() {
    const searchValue = document.getElementById("searchInput").value;
    console.log(searchValue);

    const tableBody = document.getElementById("order_list");
    console.log(tableBody);

    tableBody.innerHTML = "";
    const ordersearch = await loadJSON(); // JSON 데이터 가져오기
    console.log(ordersearch);

    // const filteredUsers = ordersearch.filter(promiseOrder => {
    //     const searchLower = searchValue.toLowerCase();
    //     return String(promiseOrder.orderUserName).includes(searchLower) ||
    //     promiseOrder.phone.toLowerCase().includes(searchLower);
    // });
    // console.log(searchValue);
    // const filteredUsers = ordersearch.filter(promiseOrder =>
    //     promiseOrder.orderUserName.toLowerCase().includes(searchValue) || promiseOrder.phone.toLowerCase().includes(searchValue)
    // );

    // 모든 객체에서 안전하게 문자열 변환 후 검색
    const lowerSearchValue = searchValue.toLowerCase();
    const filteredUsers = ordersearch.filter(promiseOrder => {
        const userName = (promiseOrder.orderUserName || "").toLowerCase();
        const phone = (promiseOrder.phone || "").toLowerCase();

        return userName.includes(lowerSearchValue) || phone.includes(lowerSearchValue);
    });

    filteredUsers.forEach(promiseOrder => {
        let row = `<tr class="order-row" data-id="${promiseOrder.id}">
            <td>${promiseOrder.id}</td>
            <td>${promiseOrder.orderUserName}</td>
            <td>${promiseOrder.phone}</td>
            <td>${promiseOrder.address}</td>
          <td>${promiseOrder.memo}</td>
          <td>${promiseOrder.productId}</td>
          <td>${promiseOrder.productName}</td>
          <td>${promiseOrder.productPrice}</td>
          <td>${promiseOrder.quantity}</td>
          <td>${Number(promiseOrder.quantity) * Number(promiseOrder.productPrice)}</td>
          <td>${promiseOrder.orderDate}</td>
          <td>${(promiseOrder.bankTransfer) == 0 ? '입금전' : '입금완료'}</td>
          </tr>`;
        tableBody.innerHTML += row;
    });
}

//키보드 엔터 이벤트
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // 폼 자동 제출 방지
        searchOrder(); // 검색 실행
    }
});


// 모달 및 입력 요소 가져오기
const modal = document.getElementById("modal");
const titleInput = document.getElementById("order-title");
const order_date = document.getElementById("order-date"),
    user_name = document.getElementById("order-user_name"),
    order_phone = document.getElementById("order-phone"),
    order_address = document.getElementById("order-address"),
    order_productId = document.getElementById("order-productId"),
    order_productName = document.getElementById("order-productName"),
    product_Price = document.getElementById("product_Price"),
    quantity = document.getElementById("quantity"),
    order_total = document.getElementById("order-total"),
    memo = document.getElementById("memo"),
    bankTransfer = document.getElementById("bankTransfer");


const saveBtn = document.getElementById("save-btn");
const closeBtn = document.getElementById("close-btn");

let currentOrder = null; // 현재 수정 중인 주문내역 전체 객체 저장

// 거래내역 클릭 시 모달에 데이터 표시하는 함수
async function openModal(order_id) {
    const data = await loadJSON();
    if (!data) return;

    // id를 기준으로 주문내역 찾기 (id가 유일해야 함)
    const selectedOrder = data.find(order => order.id == order_id);
    if (!selectedOrder) {
        console.error("거래내역을 찾을 수 없습니다.");
        return;
    }
    console.log("선택된 order:", selectedOrder);

    // 전체 객체 저장 (answer만 저장하면 id를 사용할 수 없음)
    currentOrder = selectedOrder;

    // orderDate의 포맷팅 함수 (이미 작성된 함수가 있다면 그대로 사용)
    function formatOrderDate(orderDate) {
        const str = orderDate.toString();
        if (str.length !== 17) return orderDate;
        const year = str.slice(0, 4);   // "2025"
        const month = str.slice(4, 6);   // "02"
        const day = str.slice(6, 8);   // "07"
        const hour = str.slice(8, 10);  // "17"
        const minute = str.slice(10, 12); // "06"
        const rest = str.slice(12);     // "00104" (예시)
        // 예시 포맷: "2025년 02월 07일 17시 06분 00104"
        return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분 ${rest}`;
        // 또는 "2025.02.07 17시 06분 00104" 형태로:
        // return `${year}.${month}.${day} ${hour}시 ${minute}분 ${rest}`;
    }

    // 선택된 주문 객체(selectedOrder)가 있다고 가정하고,
    // 해당 값을 모달의 input 요소에 채워 넣기 위한 매핑 배열을 생성합니다.
    const orderFieldMapping = [
        { key: 'orderDate', id: 'order-date', transform: order => formatOrderDate(order.orderDate) },
        { key: 'orderUserName', id: 'order-user_name' },
        { key: 'phone', id: 'order-phone' },
        { key: 'address', id: 'order-address' },
        { key: 'productId', id: 'order-productId' },
        { key: 'productName', id: 'order-productName' },
        { key: 'productPrice', id: 'product_Price' },
        { key: 'quantity', id: 'quantity' },
        { key: 'total', id: 'order-total', transform: order => Number(order.quantity) * Number(order.productPrice) },
        { key: 'memo', id: 'memo' },
        { key: 'bankTransfer', id: 'bankTransfer' }
    ];


    // 모달에 값을 채워넣기 위해 orderFieldMapping 배열을 순회해 값을 넣음
    orderFieldMapping.forEach(mapping => {
        const elem = document.getElementById(mapping.id);
        if (elem) {
            let value;
            // transform 함수에 전체 주문 객체(currentOrder)를 전달하여 필요한 값으로 변환
            if (mapping.transform) {
                value = mapping.transform(currentOrder);
            } else {
                value = currentOrder[mapping.key];
            }
            elem.value = value;
        }
    });



    // 모달 창 보이기
    modal.style.display = "flex";
    console.log("저장할 거래내역 객체:", currentOrder);
}

// 저장 버튼 클릭 시 실행하는 함수 (PATCH 사용)
async function saveOrder() {
    if (!currentOrder) {
        console.error("저장할 거래내역이 선택되지 않았습니다.");
        return;
    }

    const updatedAnswer = bankTransfer.value;
    console.log("무통장 입금 여부:", currentOrder.id, "새 answer:", updatedAnswer);

    try {
        // PATCH 요청으로 answer 필드만 업데이트
        await axios.patch(`http://localhost:3000/promiseOrder/${currentOrder.id}`, {
            bankTransfer: updatedAnswer
        });
        alert("거래내역이 성공적으로 수정되었습니다.");

        // 모달 창 닫기
        modal.style.display = "none";
    } catch (error) {
        console.error("거래내역 저장 중 오류 발생:", error);
    }
}

// 모달 닫기 기능
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// 거래내역 목록 클릭 이벤트 추가
document.addEventListener("DOMContentLoaded", () => {
    const orderItems = document.querySelectorAll(".order-row");

    orderItems.forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault(); // 기본 링크 동작 막기
            // 클릭한 거래내역을 openModal로 전달
            openModal(event.target.textContent.trim());
        });
    });
});

document.getElementById("order_list").addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (row) {
        // data-id 속성에서 주문 고유 id를 가져옵니다.
        const orderId = row.getAttribute("data-id");
        openModal(orderId);
    }
});


// 저장 버튼에 저장 함수 할당
saveBtn.addEventListener("click", saveOrder);
