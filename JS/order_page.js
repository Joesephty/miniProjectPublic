// 'use strict';

// const userOrderInfo = sessionStorage.getItem('order'),
//     productId = userOrderInfo.productId,
//     quantity = userOrderInfo.quantity,
//     userOrderForm = document.userOrderForm,
//     submitBtn = userOrderForm.submitBtn,
//     totalPrice = document.getElementsById('totalPrice');

// async function getProductPrice() {
//     try {
//         const getProductData = await axios.get('http://localhost:3000/productData'),
//             productInfo = getProductData.data.find(prdctNo => prdctNo.name === productId),
//             productPrice = productInfo.prdctPrice,
//             totalPrice = productPrice * quantity,
//             totalOrder = { productId, quantity, totalPrice };

//         totalPrice[0].innerHTML = `<div>가격 : ${productPrice}</div> <div>수량 : ${quantity}</div><div>총액 : ${totalPrice}</div>`;
//         sessionStorage.setItem('order', JSON.stringify(order));


//     } catch (err) {
//         console.log('데이터를 가져오는 중 오류 발생');
//         console.log(err.message);
//     }
// }

// getProductPrice();


// 'use strict';

// const
//     userOrderInfo = sessionStorage.getItem('order'),
//     // userOrderInfo = JSON.parse(sessionStorage.getItem('order')),
//     // session = sessionStorage.getItem('order'),
//     // userOrderInfo = JSON.parse(session),
//     // productId = userOrderInfo['productId'],
//     // quantity = userOrderInfo['quantity'],
//     userOrderForm = document.userOrderForm,
//     submitBtn = userOrderForm.submitBtn,
//     totalPrice = userOrderForm.getElementsByClassName('totalPrice');

// async function getProductPrice() {
//     try {
//         const getProductData = await axios.get('http://localhost:3000/productData'),
//             newOrder = JSON.parse(userOrderInfo),
//             newId = newOrder.productId,
//             newQuan = newOrder.quantity,
//             productInfo = getProductData.data.find(prdctNo => prdctNo.name === 1002),
//             productPrice = productInfo.prdctPrice;

//         // totalPrice[0].innerHTML = `<div>가격 : ${productPrice}</div> <div>수량 : ${newQuan}</div><div>총액 : ${productPrice * newQuan}</div>`;


//         console.log(JSON.parse(userOrderInfo));
//         console.log(newOrder.productId);
//         console.log(newOrder.quantity);
//         console.log('-------parse를 변수----------');
//         console.log(newOrder);
//         console.log(newId);
//         console.log(newQuan);
//         console.log('---------함수 외부 선언-----------');
//         console.log(userOrderInfo);

//     } catch (err) {
//         console.log('데이터를 가져오는 중 오류 발생');
//         console.log(err.message);
//     }
// }


// getProductPrice();




'use strict';

const productSession = sessionStorage.getItem('productInfo'),       // 세션스토리지에 저장된 order 읽어오기
    quantity = JSON.parse(sessionStorage.getItem('quantity')),           // 세션스토리지에서 로그인유저정보 읽어오기
    userSession = sessionStorage.getItem('user'),           // 세션스토리지에서 로그인유저정보 읽어오기
    userOrderForm = document.userOrderForm,
    submitBtn = userOrderForm.submitBtn,
    totalPrice = userOrderForm.querySelector('.totalPrice');

const productInfo = JSON.parse(productSession),             // 세션스토리지에서 읽어온 정보를 js 객체로 parse
    userInfo = JSON.parse(userSession),                     // 세션스토리지에서 읽어온 정보를 js 객체로 parse
    productId = productInfo.prdctNo,
    productName = productInfo.prdctName,                   // 제품번호
    productImg = productInfo.prdctImgUrl,                   // 제품번호
    productPrice = productInfo.prdctPrice,                   // 제품번호
    userEmail = userInfo.email;                          // 유저 id (email)





// 현재시간을 밀리초까지 YYYYMMDDhhmmssms 로 읽어오는 함수제작
function getnow() {
    let setnow = new Date(),
        year = setnow.getFullYear(),
        month = ('0' + (setnow.getMonth() + 1)).slice(-2),
        day = ('0' + (setnow.getDate())).slice(-2),
        hour = ('0' + (setnow.getHours())).slice(-2),
        min = ('0' + (setnow.getMinutes())).slice(-2),
        sec = ('0' + (setnow.getSeconds())).slice(-2),
        milsec = setnow.getMilliseconds(),
        now = `${year}${month}${day}${hour}${min}${sec}${milsec}`;

    return now;
}

function getProductPrice() {

    totalPrice.innerHTML =
        `<div class ="productImg">
            <img src="${productImg}" alt="${productName}">
        </div>
        <div class ="productInfo Clr6">
            <div>제품명 : </div>
            <div>${productName}</div>
            <div>가격 :</div>
            <div> ${productPrice}</div> 
            <div>수량 : </div>
            <div>${quantity}</div>
            <div>총액 : </div>
            <div>${Number(productPrice) * Number(quantity)}</div>
        </div>    
        `  // 페이지에 주문 내역 삽입
}


getProductPrice();



async function postPromiseOrderInfo() {
    const name = userOrderForm.clientName.value,
        phone = userOrderForm.phone.value,
        address = userOrderForm.address.value,
        memo = userOrderForm.memo.value,
        orderInputData = {
            email: userEmail,
            orderUserName: name,
            phone: phone,
            address: address,
            memo: memo,
            productId: Number(productId),
            productName: JSON.parse(sessionStorage.getItem('productName')),
            productPrice: Number(JSON.parse(sessionStorage.getItem('productPrice'))),
            quantity: Number(quantity),
            orderDate: Number(getnow()),
            bankTransfer: 0          // 입금확인 정보
        };

    if (name === "" || phone === "" || address === "null") {
        alert('배송정보를 입력해주세요.')
    } else {

        try {

            sessionStorage.removeItem('productInfo');                                       // 기존 세션스토리지 저장내역 삭제
            sessionStorage.removeItem('qunatity');                                           // 기존 세션스토리지 저장내역 삭제
            sessionStorage.setItem('orderInputData', JSON.stringify(orderInputData));       // 주문정보 다음페이지에 넘기기 위해 세션스토리지에 저장
            await axios.post('http://localhost:3000/promiseOrder', orderInputData);         // 주문정보 DB에 입력
            location.href = './banking.html';

        } catch (err) {
            console.log('데이터를 전송중 오류 발생');
            console.log(err.message);
        }
    }
}

submitBtn.addEventListener('click', postPromiseOrderInfo);          // 결제 버튼 누르면 


