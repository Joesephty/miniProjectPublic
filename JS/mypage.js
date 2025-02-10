'use strict';
const purchaseList = document.querySelector(".purchaseList");

// jason 에 저장된 productData 받아오기
async function loadpurchasList() {
    try {
        const response = await axios.get('http://localhost:3000/productData');
        const purchase = response.data;

        purchaseList.innerHTML = '';

        if (purchase.length > 0) {
            purchase.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("mypage_card");

                // 이미지클릭시 해당이미지 디테일로 이동
                const productDetailPage = `/productdetail/${product.prdctNo}.html`;

                card.innerHTML = `
                    <img class="image_small" src="${product.prdctImgUrl}" alt="상품 이미지" data-product-page="${productDetailPage}">
                    <div class="incard">
                    <div class="incard_detail">상품 이름</div> <div class="incard_detail"></div>
                    <div class="incard_detail">주소</div>      <div class="incard_detail"></div>
                    <div class="incard_detail">요청 사항</div> <div class="incard_detail"></div>
                    <div class="incard_detail">수량</div>      <div class="incard_detail"></div>
                    <div class="incard_detail">가격</div>      <div class="incard_detail"></div>
                    <div class="incard_detail">입금 확인</div> <div class="incard_detail"></div>
                    
                    </div>
                    <div class="btn_container">
                        <button class="btn review_btn" data-product="${product.prdctName}">
                            리뷰 쓰기
                        </button>
                        <button class="btn bottom">다시 구매</button>
                    </div>
                `;

                purchaseList.appendChild(card);
            });
        } else {
            purchaseList.innerHTML = "<p>구매내역 없음</p>";
        }
    } catch (error) {
        console.log("데이터 불러오기 실패 :", error);
        purchaseList.innerHTML = "<p>데이터 불러오기 실패</p>";
    }
}


// 페이지가 로드되면 실행
document.addEventListener("DOMContentLoaded", () => {
    loadpurchasList();
});

// 클릭시 이벤트 (이벤트 위임)
purchaseList.addEventListener("click", function (event) {
    const target = event.target;


    // 장바구니 이동
    if (target.classList.contains("mycart")) {
        window.location.href = "../cart/cart.html";
    }

    // 이미지 클릭 -> 이미지 디테일
    if (target.classList.contains("image_small")) {
        const productDetailPage = target.getAttribute("data-product-page");
        if (productDetailPage) {
            window.location.href = productDetailPage;
        }
    }
    // 리뷰 쓰기 버튼 누르기 -> 리뷰 모달 열기 
    if (target.classList.contains("review_btn")) {
        const productName = target.getAttribute("data-product");
        openReview(productName);
    }
    // 리뷰 쓰기 닫기버튼 -> 리뷰 닫기
    if (target.classList.contains("close_modal")) {
        closeReview();
    }



});

// 리뷰 모달 열기 함수
function openReview(productName) {
    const modal = document.querySelector(".modal");
    const submitButton = document.querySelector(".submit_review");

    if (modal) {
        modal.classList.add("show");
    }

    submitButton.onclick = function () {
        submitReview(productName);
    };

}
// 리뷰 모달 닫기 함수
function closeReview() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.classList.remove("show");
    }
}


// 리뷰 모달 닫기 기능 추가
document.addEventListener("DOMContentLoaded", function () {
    const closeModal = document.querySelector(".close_modal");
    if (closeModal) {
        closeModal.addEventListener("click", closeReview);

    }
});


// 리뷰 제출
async function submitReview(productName) {
    const review_text = document.querySelector(".review_text").value;

    // 글을 썻는지 유효성
    if (!review_text.trim()) {
        alert("글자를 써라!");
        return;
    }
    // 들어갈 데이터
    const review_data = {
        productName: productName,
        review: review_text,
        date: new Date()
    };

    try {
        const response = await axios.post("http://localhost:3000/reviews", review_data, {
        });

        alert("리뷰 저장!");
        document.querySelector(".modal").style.display = "none";
        document.querySelector(".review_text").value = "";

    } catch (err) {
        console.error("Error:", err);
        alert("리뷰 데이터 안보내짐");
    }
}

