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
        const response = await axios.get("http://localhost:3000/users"); // JSON 파일 요청
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

menu__item[1].style.borderRight = 'none';

/* 공통 끝 */



/* user_management.html 시작 */

let currentPage = 1;   // 현재 페이지 번호
const rowsPerPage = 3; // 페이지당 표시할 행


async function displayUsers() {
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = ""; // 기존 데이터 초기화

    const clients = await loadJSON(); // JSON 데이터 가져오기
    console.log("받은 데이터:", clients);

    const totalClients = clients.length;
    const totalPages = Math.ceil(totalClients / rowsPerPage);

    // 현재 페이지에 해당하는 제품들만 선택 (슬라이스 사용)
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedProducts = clients.slice(startIndex, endIndex);


    paginatedProducts.forEach(users => {
        let row = `
      <tr>
          <td>${users.id}</td>
          <td>${users.email}</td>
          <td>${users.name}</td>
          <td>${users.phone}</td>
          <td>${users.joindate}</td>
          <td>${users.greade}</td>
        </tr>`;
        userTable.innerHTML += row;
    });

    // 페이지네이션 컨테이너 요소 가져오기
    const paginationContainer = document.getElementById("pagination");
    if (paginationContainer) {
        // renderPagination 함수를 호출하여 페이지네이션 UI 생성
        renderPagination(currentPage, totalPages, paginationContainer, () => {
            // '이전' 버튼 클릭 시 실행할 함수: 현재 페이지 감소 후 다시 렌더링
            if (currentPage > 1) {
                currentPage--;
                displayUsers();
            }
        }, () => {
            // '다음' 버튼 클릭 시 실행할 함수: 현재 페이지 증가 후 다시 렌더링
            if (currentPage < totalPages) {
                currentPage++;
                displayUsers();
            }
        });
    }
}

// 페이지 로드 시 product__inventory() 실행
document.addEventListener("DOMContentLoaded", displayUsers);


// 검색 기능
async function searchUser() {
    const searchValue = document.getElementById("searchInput").value;
    const tableBody = document.getElementById("userTable");
    tableBody.innerHTML = "";
    const clients = await loadJSON(); // JSON 데이터 가져오기

    const filteredUsers = clients.filter(users =>
        users.userNickname.toLowerCase().includes(searchValue) || users.userId.toLowerCase().includes(searchValue)
    );

    filteredUsers.forEach(users => {
        let row = `<tr>
          <td>${users.id}</td>
          <td>${users.userId}</td>
          <td>${users.userNickname}</td>
          <td>${users.call}</td>
          <td>${users.joinDate}</td>
          <td>${users.grade}</td>

      </tr>`;
        tableBody.innerHTML += row;
    });
}

// 키보드 이벤트
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // 폼 자동 제출 방지
        searchUser(); // 검색 실행
    }
});

/* 회원 변동사항 표 시작 */

// 회원 변동사항 영역 불러오기
const membership__changes = document.querySelector('.membership__changes');

// 2025년에 가입한 신규 회원 수 확인
document.addEventListener("DOMContentLoaded", async () => {
    const clients = await loadJSON();
    const reviews = await axios.get("http://localhost:3000/reviews");
    console.log("전역 변수 clients에 저장된 데이터:", clients);
    // 이제 여기서 clientsData를 사용해서 필터 등 작업을 수행할 수 있음.
    let new_user_count = clients.filter(user => String(user.joinDate).startsWith("2025")).length;
    console.log("2025년에 가입한 회원 수:", new_user_count);
    // 회원 변동사항 데이터 설정
    const new_changes = [
        {
            all_user: clients.length,      // 총 회원 수
            new_user: new_user_count,    // 신규 가입자 수
            answer_complete: 8,         // 답변 완료 
            new_answer: 3,               // 신규 답변 
            grade_up: (reviews.data).length  // 신규리뷰
        }
    ];

    // 회원 변동사항 데이터를 테이블에 반영하는 함수
    let membership__value = membership__changes.querySelector('.membership__value');

    function membership__newvalue() {
        membership__value.innerHTML = ""; // 기존 데이터 초기화

        new_changes.forEach(change => {
            let row = `<tr>
            <td>${change.all_user}</td>
            <td>${change.new_user}</td>
            <td>${change.answer_complete}</td>
            <td>${change.new_answer}</td>
            <td>${change.grade_up}</td>
        </tr>`;
            membership__value.innerHTML += row;
        });
    }

    // 함수 실행하여 테이블 업데이트
    membership__newvalue();
});

/* 회원 변동사항 표 끝 */

/*user_management끝 */
