'use strict';

// 제품 등록 폼 관련 코드
const productRegistraionForm = document.productRegistraionForm,
    submitBtn = productRegistraionForm.submitBtn;


async function addProductDetail() {
    try {
        // 폼 데이터를 수집해서 객체로 변환
        const formData = new FormData(productRegistraionForm);
        const productInputData = Object.fromEntries(formData);
        console.log("폼 데이터:", productInputData);

        // 제품 카테고리에 따라 접두어 결정
        // 소주 → 접두어 "1", 막걸리 → "2", 기타 → "0"
        let prefix;
        if (productInputData.prdctCategory === "소주") {
            prefix = "1";
        } else if (productInputData.prdctCategory === "막걸리") {
            prefix = "2";
        } else {
            prefix = "0";
        }

        // 해당 카테고리의 기존 제품 개수를 가져와서 카운트
        const categoryResponse = await axios.get(
            `http://localhost:3000/productData?prdctCategory=${encodeURIComponent(productInputData.prdctCategory)}`
        );
        const categoryCount = categoryResponse.data.length;

        // 새로운 제품 번호(prdctNo)는 접두어 + (기존 제품 수 + 1)를 3자리 숫자로 포맷
        productInputData.prdctNo = prefix + String(categoryCount + 1).padStart(3, "0");

        // id는 전체 제품의 개수를 기준으로 설정 (또는 JSON Server가 자동 할당하게 할 수도 있음)
        const allProductsResponse = await axios.get('http://localhost:3000/productData');
        const allProducts = allProductsResponse.data;
        productInputData.id = String(allProducts.length + 1);

        console.log("등록할 제품 데이터:", productInputData);

        // 제품 데이터를 서버에 전송
        await axios.post('http://localhost:3000/productData', productInputData);
        window.opener.location.reload();
    } catch (err) {
        console.log('데이터 전송 중 오류 발생');
        console.log(err.message);
    }
}

// function setThumbnail(event) {
//     let reader = new FileReader();

//     reader.onload = function(event) {
//       let img = document.createElement("img");
//       img.setAttribute("src", event.target.result);
//       document.querySelector("div#image_container").appendChild(img);
//     };

//     reader.readAsDataURL(event.target.files[0]);
//   }
// 전송 버튼을 클릭할 때 addProductDetail 함수 실행
submitBtn.addEventListener('click', addProductDetail);
