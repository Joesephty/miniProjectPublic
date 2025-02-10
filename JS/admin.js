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
    const response = await axios.get("http://localhost:3000/faqs"); // JSON 파일 요청
    return response.data; // axios는 응답 데이터를 data 속성에 담아 반환합니다.

  } catch (error) {
    console.error("JSON 로드 중 오류 발생:", error);
    return null;
  }
}

/* 공통 끝 */

/* 네비에서 현재 위치가 어디있는지 표시해준다 */
const menu__item = admin_workspace.getElementsByClassName('menu__item');

menu__item[0].style.borderRight = 'none';




// 관리자 대시보드 페이지 시작
/* 공급사 메일 관리 시작*/
const ctx = document.getElementById("myChart").getContext("2d");
const sales_volume_ct = document.getElementById("sales_volume").getContext("2d");
new Chart(ctx, {
  type: "line", // 라인 그래프 
  data: {
    labels:
      ["1월", "2월", "3월", "4월", "5월", '6월', "7월", '8월', '9월', '10월', '11월', '12월'], // X축 라벨
    datasets: [
      {
        label: "월별 판매량",
        data: [1, 5, 12, 17, 23, 15, 23, 21, 31, 42, 62, 70], // 값
        backgroundColor: "rgba(75, 192, 192, 0.5)", // 막대 색상
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: false, // 크기 고정
    scales: {
      y: {
        beginAtZero: true, // Y축 0부터 시작
      },
    },
  },
});

new Chart(sales_volume_ct, {

  data: {
    labels: ["1월", "2월", "3월", "4월", "5월", '6월', "7월", '8월', '9월', '10월', '11월', '12월'], // X축 라벨
    datasets: [
      {
        type: "bar", // 막대 그래프 (다른 그래프도 가능)
        label: "월별 지출금",
        data: [1, 35, 42, 32, 25, 15, 21, 20, 33, 32, 42, 63], // 값
        backgroundColor: "rgba(75, 192, 192, 0.5)", // 막대 색상
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      }, {
        type: "line", // 라인 그래프 (다른 그래프도 가능)
        label: "월별 수익금",
        data: [1, 5, 12, 17, 23, 15, 23, 21, 31, 42, 62, 70], // 값
        backgroundColor: "rgba(192, 75, 75, 0.5)", // 막대 색상
        borderColor: "rgb(192, 75, 75)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: false, // 크기 고정
    scales: {
      y: {
        beginAtZero: true, // Y축 0부터 시작
      },
    },
  },
});



// 메일 데이터 배열
const mailData = [
  { supplier: "공급사 1", message: "재고가 없어 술을 빚는 중이니 당분간 재고 없음으로 표시해 주세요.", date: "2025-01-27" },
  { supplier: "공급사 2", message: "저희 전통주를 새로 공급하고 싶습니다.", date: "2025-01-27" },
  { supplier: "공급사 3", message: "다음 달부터 새로운 상품을 공급할 예정입니다.", date: "2025-02-01" },
];

// 테이블의 tbody DOM 요소 가져오기
const mailTableBody = document.getElementById("mailTableBody");

// 모달 관련 DOM 요소 가져오기
const mailModal = document.getElementById("mailModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

// 텍스트 길이 제한 함수
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// 메일 테이블 렌더링
function renderMails() {
  mailTableBody.innerHTML = ""; // 기존 내용 초기화
  mailData.forEach((mail, index) => {
    const row = `
      <tr class="mail-row" data-index="${index}">
        <td>${mail.supplier}</td>
        <td>${truncateText(mail.message, 15)}</td>
        <td>${mail.date}</td>
      </tr>
    `;
    mailTableBody.innerHTML += row;
  });
}

// 특정 메일 모달 띄우기
function showMailModal(mail) {
  modalTitle.textContent = `공급사: ${mail.supplier}`;
  modalContent.innerHTML = `<br> ${mail.message.replace(/\n/g, "<br>")}<br><br>날짜: ${mail.date}`;
  /*  \n → 줄바꿈 문자(개행 문자, newline character)를 의미함.
      / ... / → 정규식을 정의하는 기호.
      g(global) → 문자열 전체에서 모든 \n을 찾아 변환하도록 하는 플래그. */
  mailModal.style.display = "block";
}

// 테이블 행 클릭 이벤트
mailTableBody.addEventListener("click", function (e) {
  const row = e.target.closest(".mail-row");
  if (row) {
    const index = row.dataset.index;
    const mail = mailData[index];
    showMailModal(mail);
  }
});

// 모달 닫기 이벤트
closeModal.addEventListener("click", function () {
  mailModal.style.display = "none";
});

// 초기 데이터 렌더링
renderMails();


// 모달 및 입력 요소 가져오기
const modal = document.getElementById("modal");
const titleInput = document.getElementById("faq-title");
const contentInput = document.getElementById("faq-content");
const saveBtn = document.getElementById("save-btn");
const closeBtn = document.getElementById("close-btn");

let currentFaq = null; // 현재 수정 중인 FAQ 전체 객체 저장

// FAQ 클릭 시 모달에 데이터 표시하는 함수
async function openModal(faqTitle) {
  const data = await loadJSON();
  if (!data) return;

  // 제목을 기준으로 FAQ 객체 찾기 (제목이 유일해야 함)
  const selectedFaq = data.find(faq => faq.title === faqTitle);
  if (!selectedFaq) {
    console.error("FAQ를 찾을 수 없습니다.");
    return;
  }
  console.log("선택된 FAQ:", selectedFaq);

  // 전체 객체 저장 (answer만 저장하면 id를 사용할 수 없음)
  currentFaq = selectedFaq;

  // 모달 창에 기존 데이터 채우기
  titleInput.value = selectedFaq.title;
  contentInput.value = selectedFaq.answer;

  // 모달 창 보이기
  modal.style.display = "flex";
  console.log("저장할 FAQ 객체:", currentFaq);
}

// 저장 버튼 클릭 시 실행하는 함수 (PATCH 사용)
async function saveFaq() {
  if (!currentFaq) {
    console.error("저장할 FAQ가 선택되지 않았습니다.");
    return;
  }

  const updatedAnswer = contentInput.value;
  console.log("업데이트할 FAQ ID:", currentFaq.id, "새 answer:", updatedAnswer);

  try {
    // PATCH 요청으로 answer 필드만 업데이트
    await axios.patch(`http://localhost:3000/faqs/${currentFaq.id}`, {
      answer: updatedAnswer
    });
    alert("FAQ가 성공적으로 수정되었습니다.");

    // 모달 창 닫기
    modal.style.display = "none";
  } catch (error) {
    console.error("FAQ 저장 중 오류 발생:", error);
  }
}

// 모달 닫기 기능
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// FAQ 목록 클릭 이벤트 추가
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".content-item a");

  faqItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 동작 막기
      // 클릭한 FAQ 제목을 openModal로 전달
      openModal(event.target.textContent.trim());
    });
  });
});

// 저장 버튼에 저장 함수 할당
saveBtn.addEventListener("click", saveFaq);



//관리자 대시보드 이벤트 끝