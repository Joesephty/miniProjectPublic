'use strict';

const userOrderInfo = JSON.parse(sessionStorage.getItem('orderInputData')),
    orderName = userOrderInfo['orderUserName'],
    phone = userOrderInfo['phone'],
    address = userOrderInfo['address'],
    memo = userOrderInfo['memo'],
    productName = userOrderInfo['productName'],
    productId = userOrderInfo['productId'],
    quantity = userOrderInfo['quantity'],
    productPrice = userOrderInfo['productPrice'],
    orderReceipt = document.querySelector('.orderReceipt');

async function getorderInfo() {
    sessionStorage.removeItem('orderInputData');
    orderReceipt.innerHTML =
        `<div>checkout</div>
        <div>
            <div>
                <div class="receiptTitle">배송정보</div>
                <div class="receiptbody">${address}</div>
                <div class="receiptbody">${phone}</div>
                <div class="receiptbody">${memo}</div>
            </div>
            <div>
                <div class="receiptTitle">PAYMENT</div>
                <div class="receiptbody">가격 : </div> 
                <div class="receiptbody">${productPrice}</div>
                <div class="receiptbody">수량 : </div> 
                <div class="receiptbody">${quantity}</div>
                <div class="receiptbody">총액 : </div> 
                <div class="receiptbody">${Number(productPrice) * Number(quantity)}</div>
            </div>
            <div>
                <i class="fa-solid fa-sack-dollar"></i>
                <h2>무통장입금 안내</h2>
            </div>

            <div>무통장입금 주문시 주문자명 또는 상호명이 실제 주문자의 성함과
                <br>다를경우 입금 확인이 어렵습니다.
            </div>

            <div>아래 통장으로 입금해주시면 결제가 완료됩니다.</div>
            <div class="bankimg">
                <img src="../asset/logo_font2.svg" alt="달보드레">
                <div>농협 000 - 0000 - 00000000 (달보드레)</div>
            </div>
            <div>이용해주셔서 감사합니다.</div>
                <a href="../index.html" class="buy-comfirm">확인</a>
        </div>`;
}

getorderInfo();


