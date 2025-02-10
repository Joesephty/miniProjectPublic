'use strict';

const path = window.location.pathname.split("/").pop(),       // 페이지이름을 이용한 productNo 도출
    productId = path.split(".").shift(),
    orderlist = document.querySelector('#orderlist'),
    infoImgHtml = orderlist.querySelector('.infoImg'),
    infoTxtHtml = orderlist.querySelector('.productInfo'),
    submitBtn = orderlist.querySelector(".btn"),
    quantity = orderlist.querySelector('#quantity').value,
    userSession = sessionStorage.getItem('user'),
    user = JSON.parse(userSession);

async function getProductPrice() {
    try {
        const response = await axios.get('http://localhost:3000/productData'),        // DB 확인
            productInfo = response.data.find(obj => obj.prdctNo == productId),      // prdctNo가 productId와 동일한 제품 찾아오기
            productPrice = productInfo.prdctPrice,
            productName = productInfo.prdctName,
            productImg = productInfo.prdctImg;


        infoImgHtml.innerHTML = `<img src="${productImg}" alt="${productName}">`;
        infoTxtHtml.innerHTML = `
            <div>${productName}</div>
            <div><strong>${productPrice}</strong>원</div> 
            `;                                                              // 페이지에 상품 내역 삽입

        sessionStorage.setItem('productInfo', JSON.stringify(productInfo)); // 세션스토리지에 productInfo 저장


    } catch (err) {
        console.log('데이터를 가져오는 중 오류 발생');
        console.log(err.message);
    }
}

// async function getReview() {
//     try {
//         const response = await axios.get('http://localhost:3000/reviews'),
//             productReview = response.data.find(obj => obj.prdctNo == productId),
//             review = productR


//     } catch (err) {
//         console.log('데이터를 가져오는 중 오류 발생');
//         console.log(err.message);
//     }
// }



getProductPrice();



function tossOrderInfo() {
    if (user === null) {

        window.location.href = '../sign/signin.html';

    } else {
        const quantity = orderlist.querySelector('#quantity').value;
        sessionStorage.setItem('quantity', JSON.stringify(quantity));
        location.href = '../cart/order_page.html';
    }
}

submitBtn.addEventListener('click', tossOrderInfo);