'use strict';

const doc = document.querySelector('main'),
    selectHtml = doc.querySelector('.select'),
    saleHtml = doc.querySelector('.sale'),
    newHtml = doc.querySelector('.new'),
    selectCard = selectHtml.getElementsByClassName('card'),   // cardview 2개 [0],[1]
    saleCard = saleHtml.getElementsByClassName('card'),       // cardview 2개 [0],[1]
    newCard = newHtml.getElementsByClassName('card');         // cardview 4개 [0],[1],[2],[3]




async function getProductData() {
    const response = await axios.get('http://localhost:3000/productData'),
        sortResponse = response.data.sort((a, b) => b.addDate - a.addDate), //addDate가 가장 큰값을 가져오기 위해 내림차순으로 정렬
        selectProduct = response.data.filter(obj => obj.select == 1),
        saleProduct = response.data.filter(obj => obj.sale == 1);

    for (let i = 0; i < selectProduct.length; i++) {

        selectCard[i].innerHTML = `
            <img src="${selectProduct[i].prdctImgUrl}" alt="${selectProduct[i].prdctName}" class="cardImg">
            <div class="cardInfo">
                <p class="cardTitle">${selectProduct[i].prdctName}</p>
                <p class="cardBody">${selectProduct[i].prdctShortDesc}</p>
            </div>
            <div class="cardFooter">
                <span class="cardTitle">${selectProduct[i].prdctPrice}원</span>
                <div class="cardBtn">
                    <a href="./productdetail/${selectProduct[i].prdctNo}.html">구매</a>
                </div>
            </div>
        `
    }


    for (let i = 0; i < saleProduct.length; i++) {

        saleCard[i].innerHTML = `
            <img src="${saleProduct[i].prdctImgUrl}" alt="${saleProduct[i].prdctName}" class="cardImg">
            <div class="cardInfo">
                <p class="cardTitle">${saleProduct[i].prdctName}</p>
                <p class="cardBody">${saleProduct[i].prdctShortDesc}</p>
            </div>
            <div class="cardFooter">
                <span class="cardTitle">${saleProduct[i].prdctPrice}원</span>
                <div class="cardBtn">
                    <a href="./productdetail/${saleProduct[i].prdctNo}.html">구매</a>
                </div>
            </div>
        `
    }


    for (let i = 0; i < 4; i++) {

        newCard[i].innerHTML = `
            <img src="${sortResponse[i].prdctImgUrl}" alt="${sortResponse[i].prdctName}" class="cardImg">
            <div class="cardInfo">
                <p class="cardTitle">${sortResponse[i].prdctName}</p>
                <p class="cardBody">${sortResponse[i].prdctShortDesc}</p>
            </div>
            <div class="cardFooter">
                <span class="cardTitle">${sortResponse[i].prdctPrice}원</span>
                <div class="cardBtn">
                    <a href="./productdetail/${sortResponse[i].prdctNo}.html">구매</a>
                </div>
            </div>
        `
    }


}

getProductData();
