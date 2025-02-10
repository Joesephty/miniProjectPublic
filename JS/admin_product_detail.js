'use strict'

async function loadJSON() {
    try {
        const response = await axios.get("http://localhost:3000/productData");
        return response.data;
    } catch (error) {
        console.error("JSON 로드 중 오류 발생:", error);
        return null;
    }
}
const product_infor_row = document.querySelector('.product_infor_row'),
    product_infor = product_infor_row.querySelector('.product_infor');

// async function call_prod() {
//     const findjson = await loadJSON(), //json 가져오기
//         product_img = document.querySelector('.product_img');
//     const params = new URLSearchParams(window.location.search),
//         id = params.get('id'); // URL에서 id 값을 가져옴

//     console.log("전달받은 상품 id:", id);

//     const info = findjson.filter(a => {
//         return a.prdctNo == id;
//     })
//     console.log(info);

//     info.forEach(b => {
//         let row =
//             `
//             <li>id :       ${b.id}</li>
//             <li>상품번호 :  ${b.prdctNo}</li>
//             <li>카테고리 :  ${b.prdctCategory}</li>
//             <li>상품이름 :  ${b.prdctName}</li>
//             <li>도수 :      ${b.prdctalcohol}</li>
//             <li>제조지역 :  ${b.prdctregion}</li>
//             <li>공급사 :   ${b.prdctCompany}</li>
//             <li>가격 :     ${b.prdctPrice}</li>
//             <li>수량 :     ${b.prdctInventory}</li>
//             <li>상품 설명 : ${b.prdctShortDesc}</li>
//             `;

//         let img = `<img src="${b.prdctImgUrl}" alt="토끼소주" class="cardImg">`;
//         console.log(img);
//         product_infor.innerHTML += row;
//         product_img.innerHTML += img;
//     });
// }
// call_prod()


async function call_prod() {  // 세션스토리지에서 가져오기
    const findjson = await loadJSON(), //json 가져오기
        product_img = document.querySelector('.product_img'),
        produ_num = sessionStorage.getItem('prdctNo');

    console.log(produ_num);
    const info = findjson.filter(prod => { //세션 스토리지에서 가져온 번호를 json에서 일치하는 배열 저장
        return prod.prdctNo == produ_num;
    })

    const fields = [ //label: 목록이름, name: 키값, editable: 변경 가불가, type: input타입
        { label: "ID", name: "id", editable: false, type: "text" },
        { label: "상품번호", name: "prdctNo", editable: true, type: "text" },
        { label: "카테고리", name: "prdctCategory", editable: true, type: "text" },
        { label: "제품이름", name: "prdctName", editable: true, type: "text" },
        { label: "도수", name: "prdctalcohol", editable: true, type: "text" },
        { label: "용량", name: "prdctVolume", editable: true, type: "text" },
        { label: "제조지역", name: "prdctregion", editable: true, type: "text" },
        { label: "제조사", name: "prdctCompany", editable: true, type: "text" },
        { label: "가격", name: "prdctPrice", editable: true, type: "text" },
        { label: "단맛", name: "sweetness", editable: true, type: "text" },
        { label: "신맛", name: "sourness", editable: true, type: "text" },
        { label: "탄산", name: "fizziness", editable: true, type: "text" },
        { label: "주재료", name: "material", editable: true, type: "text" },
        { label: "빠른 배송", name: "delivery", editable: true, type: "text" },
        { label: "수량", name: "prdctInventory", editable: true, type: "text" },
        { label: "상품 설명", name: "prdctShortDesc", editable: true, type: "text" },
        { label: "이미지", name: "prdctImg", editable: true, type: "text" },
        { label: "이미지 URL", name: "prdctImgUrl", editable: true, type: "text" }
    ];
    info.forEach(prod_inf => {
        const rowHTML = fields.map(field => {
            if (field.editable) {
                return `<div><label>${field.label} : <input type="${field.type || "text"}" name="${field.name}" value="${prod_inf[field.name]}" required></label></div>`;
            } else {
                return `<div><label>${field.label} : <input type="${field.type || "text"}" name="${field.name}" value="${prod_inf[field.name]}" readonly> </label></div>`;
            }
        }).join("");
        document.querySelector(".product_infor").innerHTML = rowHTML;
        let img = `<img src="${prod_inf.prdctImgUrl}" alt="토끼소주" class="cardImg">`;
        product_img.innerHTML += img;
    });

    // info.forEach(prod_inf => {
    //     let row =
    //         `
    //             <li>id :      <input type="text" name="prdctalcohol" value="${prod_inf.id}"required></li>
    //             <li>상품번호 :  ${prod_inf.prdctNo}</li>
    //             <li>카테고리 :  ${prod_inf.prdctCategory}</li>
    //             <li>제품이름 :  <input type="text" name="prdctName" value="${prod_inf.prdctName}" required></li>
    //             <li>도수 :      <input type="text" name="prdctalcohol" value="${prod_inf.prdctalcohol}" required></li>
    //             <li>용량 :      <input type="text" name="prdctVolume" value="${prod_inf.prdctVolume}"required></li>
    //             <li>제조지역 :  <input type="text" name="prdctregion" value="${prod_inf.prdctregion}" required></li>
    //             <li>제조사 :    <input type="text" name="prdctCompany" value="${prod_inf.prdctCompany}" required></li>
    //             <li>가격 :      <input type="text" name="prdctPrice" value="${prod_inf.prdctPrice}"required></li>
    //             <li>단맛 :      ${prod_inf.sweetness}</li>
    //             <li>신맛 :      ${prod_inf.sourness}</li>
    //             <li>탄산 :      ${prod_inf.fizziness}</li>
    //             <li>주재료 :    ${prod_inf.material}</li>
    //             <li>빠른 배송 : ${prod_inf.delivery}</li>
    //             <li>배송 :      ${prod_inf.prdctInventory}</li>
    //             <li>수량 :      ${prod_inf.prdctInventory}</li>
    //             <li>상품 설명 : ${prod_inf.prdctShortDesc}</li>
    //         `;
    //     let img = `<img src="${prod_inf.prdctImgUrl}" alt="토끼소주" class="cardImg">`;
    //     product_infor.innerHTML += row;
    //     product_img.innerHTML += img;
    // });
}
call_prod();

const correction_btn = product_infor_row.querySelector('#correction_btn');

async function updateProductDetail() {
    try {
        const getResponse = await axios.get('http://localhost:3000/productData');
        const produ_num = sessionStorage.getItem('prdctNo');

        const findClient = getResponse.data.find(prod => prod.prdctNo == produ_num);
        console.log(findClient);

        // 폼 데이터를 수집해서 객체로 변환
        const update_data = new FormData(product_infor);
        const productInputData = Object.fromEntries(update_data);
        console.log("폼 데이터:", productInputData);



        // 제품 데이터를 서버에 전송
        const putResponse = await axios.put(`http://localhost:3000/productData/${findClient.id}`, productInputData);


    } catch (err) {
        console.log('데이터 전송 중 오류 발생');
        console.log(err.message);
    }
}
correction_btn.addEventListener('click', updateProductDetail);

// 전송 버튼을 클릭할 때 addProductDetail 함수 실행
/*상품 수정 버튼 */


// const Del = product_infor_row.querySelector('#Del');
// Del.addEventListener('click', () => {
//     async function Delete_Produrct() {
//         try {
//             const Delete_data = await loadJSON(),
//                 produ_num = sessionStorage.getItem('prdctNo');
//             console.log(Delete_data);
//             console.log("삭제할 제품 번호:", produ_num);

//             const info = Delete_data.find(a => a.prdctNo == produ_num);
//             console.log(`${info.prdctNo}`);
//             const deleteResponse = await axios.delete(`http://localhost:3000/productData/${info.prdctNo}`);

//             console.log("삭제 결과:", deleteResponse.data);

//         } catch (error) {
//             console.log('데이터를 가져오는 중 오류 발생');
//             console.log(error.message);
//         }

//     }
//     Delete_Produrct();
// });

/* 상품 삭제 버튼 */
const Del = document.querySelector('#Del');

Del.addEventListener('click', async () => {
    try {
        // 최신 데이터 강제 로드 (loadJSON() 사용)
        const Delete_data = await loadJSON(); // 이때 Delete_data는 배열임
        const produ_num = sessionStorage.getItem('prdctNo');

        console.log("삭제할 제품 prdctNo:", produ_num);

        const info = Delete_data.find(a => a.prdctNo == produ_num);

        if (!info) {
            console.log("❌ 해당 제품을 찾을 수 없습니다.");
            return;
        }

        console.log("삭제할 제품 정보:", info);

        // DELETE 요청
        await axios.delete(`http://localhost:3000/productData/${info.id}`);
        console.log(`✅ 삭제 완료: ${info.id}`);

        alert('상품이 삭제되었습니다.');
        window.opener.location.reload();
        window.close(); // 팝업창 닫기

    } catch (error) {
        console.log('🚨 데이터 삭제 중 오류 발생');
        console.log(error.message);
    }

});

