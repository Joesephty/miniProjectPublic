'use strict';

// 체크박스 리스트는 하나만 열리게( 필터 조건 )================================
function toggleCheckboxList(id) {
    const allCheckboxLists = document.querySelectorAll('.checkbox-list');
    allCheckboxLists.forEach(list => {
        if (list.id !== id) {
            list.style.display = 'none';
        }
    });

    const currentList = document.getElementById(id);
    if (currentList.style.display === 'block') {
        currentList.style.display = 'none';
    } else {
        currentList.style.display = 'block';
    }
}

//===========================================================================

// 체크박스 리스트에 있는 항목을 누르면  label이 보이도록 =====================
// (x) 아이콘을 누르면 보이지 않게 됨 ========================================


//===========================================================================
// 인풋박스의 라벨과 체크박스의 조건 라벨이 함께 보이도록 수정해야 함
//===========================================================================

let products = []; // 전역 변수로 선언

document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('.checkbox-list input[type="checkbox"]');
    const selectedItemsContainer = document.querySelector('.selected-items-container');

    // 도수 관련 INPUT
    const low = document.getElementById('low');
    const high = document.getElementById('high');

    // 가격 관련 INPUT
    const min = document.getElementById('min');
    const max = document.getElementById('max');

    const application1 = document.getElementById('application1'); // 도수 적용 버튼
    const application2 = document.getElementById('application2'); // 가격 적용 버튼

    // 체크박스 값이 바뀔 때마다 라벨 업데이트
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedItems();
            applyFilters();
        });
    });

    // 도수 및 가격 적용 버튼 클릭 시 처리
    application1.addEventListener('click', () => {
        updateAlcohol();
        applyFilters();
    });
    application2.addEventListener('click', () => {
        updatePrice();
        applyFilters();
    });

    // 선택한 항목(체크박스) 업데이트
    function updateSelectedItems() {
        const selectedItems = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const label = checkbox.closest('label');
                if (label) {
                    selectedItems.push({
                        label: label.textContent,
                        element: checkbox // 체크박스 요소도 함께 저장
                    });
                }
            }
        });

        selectedItemsContainer.innerHTML = '';

        selectedItems.forEach(item => {
            const selectedItem = document.createElement('span');
            selectedItem.textContent = item.label;

            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-solid', 'fa-xmark');
            icon.style.marginLeft = '5px';

            // X 아이콘 클릭 시 해당 체크박스 해제 및 필터 재적용
            icon.addEventListener('click', function () {
                item.element.checked = false;
                updateSelectedItems();
                applyFilters();
            });

            selectedItem.appendChild(icon);
            selectedItemsContainer.appendChild(selectedItem);
        });
    }

    // 필터링된 결과 업데이트
    function applyFilters() {
        const filteredProducts = filterProducts();
        displayFilteredProducts(filteredProducts);
    }

    // 제품 필터링 함수
    function filterProducts() {
        let filteredProducts = products; // 전역 변수 products 사용

        // 체크박스 필터링 (선택된 카테고리에 해당하는 상품)
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterCriteria = checkbox.value;
                filteredProducts = filteredProducts.filter(product => product.category === filterCriteria);
            }
        });

        // 도수 범위 필터링
        const lowValue = low.value ? parseInt(low.value) : 0;
        const highValue = high.value ? parseInt(high.value) : Infinity;
        filteredProducts = filteredProducts.filter(product =>
            product.alcohol >= lowValue && product.alcohol <= highValue
        );

        // 가격 범위 필터링
        const minPrice = min.value ? parseFloat(min.value) : 0;
        const maxPrice = max.value ? parseFloat(max.value) : Infinity;
        filteredProducts = filteredProducts.filter(product =>
            product.price >= minPrice && product.price <= maxPrice
        );

        return filteredProducts;
    }

    // 필터링된 상품을 화면에 표시하는 함수
    function displayFilteredProducts(filteredProducts) {
        const productContainer = document.querySelector('.product-list');
        productContainer.innerHTML = '';

        if (filteredProducts.length === 0) {
            productContainer.innerHTML = '<p>조건에 맞는 상품이 없습니다.</p>';
        } else {
            filteredProducts.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}">
          <span>${product.name}</span>
          <span>${product.price}</span>
        `;
                productContainer.appendChild(productItem);
            });
        }
    }

    // 도수 범위 업데이트
    function updateAlcohol() {
        if (low.value && high.value && parseInt(low.value) > parseInt(high.value)) {
            alert('최소값은 최대값보다 클 수 없습니다.');
            low.value = high.value;
        }

        if (low.value || high.value) {
            const lowValue = low.value ? `${low.value}` : '';
            const highValue = high.value ? `${high.value}` : '';

            const selectedAlcoholRange = document.createElement('span');
            selectedAlcoholRange.textContent = `${lowValue}% - ${highValue}%`;

            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-solid', 'fa-xmark');
            icon.style.marginLeft = '5px';

            icon.addEventListener('click', function () {
                selectedItemsContainer.removeChild(selectedAlcoholRange);
                low.value = '';
                high.value = '';
                applyFilters();
            });

            selectedAlcoholRange.appendChild(icon);
            selectedItemsContainer.appendChild(selectedAlcoholRange);
        }
    }

    // 가격 범위 업데이트
    function updatePrice() {
        if (min.value && max.value && parseInt(min.value) > parseInt(max.value)) {
            alert('최소값은 최대값보다 클 수 없습니다.');
            min.value = max.value;
        }

        if (min.value || max.value) {
            const minValue = min.value ? `${min.value}` : '';
            const maxValue = max.value ? `${max.value}` : '';

            const selectedPriceRange = document.createElement('span');
            selectedPriceRange.textContent = `${minValue}원 - ${maxValue}원`;

            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-solid', 'fa-xmark');
            icon.style.marginLeft = '5px';

            icon.addEventListener('click', function () {
                selectedItemsContainer.removeChild(selectedPriceRange);
                min.value = '';
                max.value = '';
                applyFilters();
            });

            selectedPriceRange.appendChild(icon);
            selectedItemsContainer.appendChild(selectedPriceRange);
        }
    }

    // JSON 파일에서 제품 데이터 불러오기
    fetch('../database/database.json')
        .then(response => response.json())
        .then(data => {
            products = data.productData; // 전역 변수에 할당
            applyFilters(); // 초기 필터 적용 (혹은 전체 목록 표시)
        })
        .catch(error => console.error('데이터 로드 실패:', error));
});


//========================================================================

// 제이슨 파일에 있는 상품 내용 목록으로 불러오기
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../database/database.json');
        const data = await response.json();
        const products = data.productData;

        const productList1 = document.querySelector('.list1'); //증류주
        const productList2 = document.querySelector('.list2'); //막걸리
        const productList3 = document.querySelector('.list3'); //전체

        const filteringCount1 = document.getElementById('filteringcount1');
        const filteringCount2 = document.getElementById('filteringcount2');
        const filteringCount3 = document.getElementById('filteringcount3');

        // list1 카테고리 = 소주
        if (productList1) {
            const filteredSoju = products.filter(product => product.prdctCategory === '소주');
            if (filteringCount1) {
                filteringCount1.textContent = `${filteredSoju.length}개의 전통주 상품이 있습니다.`;
            }
            filteredSoju.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-info');

                productItem.innerHTML = `
                <div class="imgzoom">
                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                </div>
                <a href="#">
                    <span class="font">${product.prdctName}</span>
                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                    <span class="discount">10%</span> 
                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                </a>
                `;

                productList1.appendChild(productItem);
            });
        }

        // list2 = 막걸리
        if (productList2) {
            const filteredMakgeolli = products.filter(product => product.prdctCategory === '막걸리');
            if (filteringCount2) {
                filteringCount2.textContent = `${filteredMakgeolli.length}개의 막걸리 상품이 있습니다.`;
            }
            filteredMakgeolli.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-info');

                productItem.innerHTML = `
                <div class="imgzoom">
                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                </div>
                <a href="#">
                    <span class="font">${product.prdctName}</span>
                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                    <span class="discount">10%</span> 
                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                </a>
                `;

                productList2.appendChild(productItem);
            });
        }

        // list3 = 모든 리스트 (전체)
        if (productList3) {
            if (filteringCount3) {
                filteringCount3.textContent = `${products.length}개의 전체상품이 있습니다.`;
            }
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.classList.add('product-info');

                productItem.innerHTML = `
                <div class="imgzoom">
                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                </div>
                <a href="#">
                    <span class="font">${product.prdctName}</span>
                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                    <span class="discount">10%</span> 
                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                </a>
                `;

                productList3.appendChild(productItem);
            });
        }

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
});



//================================================================================================

// //필터링

//===========================================================================
// 인풋박스의 라벨과 체크박스의 조건 라벨이 함께 보이도록 수정해야 함
//===========================================================================
document.addEventListener("DOMContentLoaded", async function () {
    async function getProductData() {
        try {
            const response = await fetch('../database/database.json');
            const data = await response.json();
            console.log('Fetched data:', data);
            return Array.isArray(data.productData) ? data.productData : [];
        } catch (err) {
            console.error('상품 데이터를 불러오는 중 오류 발생:', err);
            return [];
        }
    }

    // 체크된 값
    function getSelectedValues(name) {
        return [...document.querySelectorAll(`.checkbox-list input[name="${name}"]:checked`)]
            .map(checkbox => checkbox.value);
    }


    // // 도수 범위
    // function getAlcolRange() {
    //     const low = document.getElementById('low');
    //     const high = document.getElementById('high');
    //     return {
    //         low: parseInt(low?.value) || 0,
    //         high: parseInt(high?.value) || Infinity
    //     };
    // }

    // // 가격 범위
    // function getPriceRange() {
    //     const min = document.getElementById('min');
    //     const max = document.getElementById('max');
    //     return {
    //         minPrice: parseFloat(min?.value) || 0,
    //         maxPrice: parseFloat(max?.value) || Infinity
    //     };
    // }

    async function renderProducts(products, containerClass) {
        const container = document.querySelector(containerClass);

        if (container) {
            container.innerHTML = '';
        } else {
            console.log(`${containerClass} not found`);
            return;
        }

        if (products.length === 0) {
            container.innerHTML = '<p>조건에 맞는 상품이 없습니다.</p>';
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-info');
            productElement.innerHTML = `
                <div class="imgzoom">
                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                </div>
                <a href="#">
                    <span class="font">${product.prdctName}</span>
                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                    <span class="discount">10%</span>
                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                </a>
            `;

            container.appendChild(productElement);
        });
    }

    // 필터 적용
    async function applyFilters(products) {
        const sweetnessValues = getSelectedValues('sweetness');
        const sournessValues = getSelectedValues('sourness');
        const fizzinessValues = getSelectedValues('fizziness');
        const materialValues = getSelectedValues('material');
        // const { minPrice, maxPrice } = getPriceRange();
        // const { low, high } = getAlcolRange();

        const sojuProducts = products.filter(product =>
            product.prdctCategory === '소주' &&
            (
                (sweetnessValues.includes(product.sweetness) ||
                    sournessValues.includes(product.sourness) ||
                    fizzinessValues.includes(product.fizziness) ||
                    materialValues.includes(product.material)) ||
                (sweetnessValues.length === 0 &&
                    sournessValues.length === 0 &&
                    fizzinessValues.length === 0 &&
                    materialValues.length === 0)
            ) //&&
            // // product.prdctPrice >= minPrice &&
            // // product.prdctPrice <= maxPrice &&
            // // product.prdctalcohol >= low &&
            // // product.prdctalcohol <= high
        );

        const makgeolliProducts = products.filter(product =>
            product.prdctCategory === '막걸리' &&
            (
                (sweetnessValues.includes(product.sweetness) ||
                    sournessValues.includes(product.sourness) ||
                    fizzinessValues.includes(product.fizziness) ||
                    materialValues.includes(product.material)) ||
                (sweetnessValues.length === 0 &&
                    sournessValues.length === 0 &&
                    fizzinessValues.length === 0 &&
                    materialValues.length === 0)
            ) // &&
            // product.prdctPrice >= minPrice &&
            // product.prdctPrice <= maxPrice &&
            // product.prdctalcohol >= low &&
            // product.prdctalcohol <= high
        );

        const filteredProducts = products.filter(product =>
        (
            (sweetnessValues.includes(product.sweetness) ||
                sournessValues.includes(product.sourness) ||
                fizzinessValues.includes(product.fizziness) ||
                materialValues.includes(product.material)) ||
            (sweetnessValues.length === 0 &&
                sournessValues.length === 0 &&
                fizzinessValues.length === 0 &&
                materialValues.length === 0)
        ) // &&
            // product.prdctPrice >= minPrice &&
            // product.prdctPrice <= maxPrice &&
            // product.prdctalcohol >= low &&
            // product.prdctalcohol <= high
        );

        renderProducts(sojuProducts, '.list1');
        renderProducts(makgeolliProducts, '.list2');
        renderProducts(filteredProducts, '.list3');

        console.log('Filtered Soju Products:', sojuProducts);
        console.log('Filtered Makgeolli Products:', makgeolliProducts);
        console.log('Filtered Products:', filteredProducts);

        const sojuProductsCount = sojuProducts.length;
        const makgeolliProductsCount = makgeolliProducts.length;
        const filteringCount = filteredProducts.length;

        if (document.getElementById('filteringcount1')) {
            document.getElementById('filteringcount1').textContent = `${sojuProductsCount}건의 결과가 있어요`;
        }

        if (document.getElementById('filteringcount2')) {
            document.getElementById('filteringcount2').textContent = `${makgeolliProductsCount}건의 결과가 있어요`;
        }

        if (document.getElementById('filteringcount3')) {
            document.getElementById('filteringcount3').textContent = `${filteringCount}건의 결과가 있어요`;
        }
    }

    const products = await getProductData();
    applyFilters(products);

    document.querySelectorAll('.checkbox-list input').forEach(input => {
        input.addEventListener('change', () => {
            applyFilters(products);
        });
    });

    document.querySelectorAll('.button3')?.forEach(button => {
        button.addEventListener('click', () => {
            applyFilters(products);
        });
    });
});


// //=========================================================================================================
// 빠른 배송 버튼 효과
document.addEventListener('DOMContentLoaded', function () {
    const fastdelivery = document.getElementById('fastdelivery');
    if (fastdelivery) {
        fastdelivery.addEventListener('click', function () {
            this.classList.toggle('active');
            filterProducts(); // 버튼을 누를 때마다 필터링 상태를 반영
        });
    } else {
        console.error('fastdelivery 요소를 찾을 수 없습니다.');
    }
});

//=============================================================================================================
// 빠른 배송 버튼을 눌렀을 때 db delivery에 "1"이라고 저장되어 있는 데이터만 추출
// 빠른 배송 1 일반 배송 2로 데이터를 지정해둠
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../database/database.json');
        const data = await response.json();
        window.products = data.productData; // 전역 변수로 제품 데이터를 저장

        const button1 = document.querySelector('.button1');
        if (button1) {
            button1.addEventListener('click', function () {
                // 증류주 (소주)
                const container1 = document.querySelector('.list1');
                if (container1) {
                    container1.innerHTML = '';
                    const filteredSoju = window.products.filter(product => product.prdctCategory === '소주' && product.delivery === 1);

                    if (filteredSoju.length === 0) {
                        container1.innerHTML = '<p>조건에 맞는 상품이 없습니다.</p>';
                    } else {
                        filteredSoju.forEach(product => {
                            const productItem = document.createElement('div');
                            productItem.classList.add('product-info');
                            productItem.innerHTML = `
                                <div class="imgzoom">
                                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                                </div>
                                <a href="#">
                                    <span class="font">${product.prdctName}</span>
                                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                                    <span class="discount">10%</span>
                                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                                </a>
                            `;
                            container1.appendChild(productItem);
                        });
                    }
                }

                // 막걸리
                const container2 = document.querySelector('.list2');
                if (container2) {
                    container2.innerHTML = '';
                    const filteredMakgeolli = window.products.filter(product => product.prdctCategory === '막걸리' && product.delivery === 1);

                    if (filteredMakgeolli.length === 0) {
                        container2.innerHTML = '<p>조건에 맞는 상품이 없습니다.</p>';
                    } else {
                        filteredMakgeolli.forEach(product => {
                            const productItem = document.createElement('div');
                            productItem.classList.add('product-info');
                            productItem.innerHTML = `
                                <div class="imgzoom">
                                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                                </div>
                                <a href="#">
                                    <span class="font">${product.prdctName}</span>
                                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                                    <span class="discount">10%</span>
                                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                                </a>
                            `;
                            container2.appendChild(productItem);
                        });
                    }
                }

                //전체
                const container3 = document.querySelector('.list3');
                if (container3) {
                    container3.innerHTML = '';
                    const filteredAll = window.products.filter(product => product.delivery === 1);

                    if (filteredAll.length === 0) {
                        container3.innerHTML = '<p>조건에 맞는 상품이 없습니다.</p>';
                    } else {
                        filteredAll.forEach(product => {
                            const productItem = document.createElement('div');
                            productItem.classList.add('product-info');
                            productItem.innerHTML = `
                                <div class="imgzoom">
                                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                                </div>
                                <a href="#">
                                    <span class="font">${product.prdctName}</span>
                                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                                    <span class="discount">10%</span>
                                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                                </a>
                            `;
                            container3.appendChild(productItem);
                        });
                    }
                }
            });
        }

    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
});

// 빠른 배송 필터링 기능
function filterProducts() {
    const fastdeliveryButton = document.querySelector('#fastdelivery');
    const productsContainer = document.querySelector('.product-container'); // 전체 제품을 출력할 컨테이너
    const isActive = fastdeliveryButton.classList.contains('active'); // 버튼의 활성화 상태 확인

    // 필터링된 제품을 구하는 함수
    const filteredProducts = isActive
        ? window.products.filter(product => product.delivery === 1) // 빠른 배송만 필터링
        : window.products; // 전체 목록

    // 제품 목록 갱신
    productsContainer.innerHTML = '';  // 기존 목록을 비움

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p>조건에 맞는 상품이 없습니다.</p>';
    } else {
        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-info');
            productItem.innerHTML = `
                <div class="imgzoom">
                    <img class="productimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
                </div>
                <a href="#">
                    <span class="font">${product.prdctName}</span>
                    <div class="orginprice">${product.prdctPrice.toLocaleString()}원</div>
                    <span class="discount">10%</span>
                    <span class="font">${(product.prdctPrice * 0.9).toLocaleString()}원</span>
                </a>
            `;
            productsContainer.appendChild(productItem);
        });
    }
}



//========================================================================
//지역별
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../database/database.json');
        const data = await response.json();
        const products = data.productData;

        const region = document.querySelectorAll('path');  // SVG의 지역별 아이디 값을 불러옴

        region.forEach(path => {
            path.addEventListener('click', (event) => {
                const regionId = path.id;
                mapProductInfo(regionId, products, event);  // 클릭한 위치의 이벤트 전달
            });
        });
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
});

const regionNameMap = {
    "KR-11": "서울",
    "KR-26": "부산",
    "KR-27": "대구",
    "KR-28": "인천",
    "KR-29": "광주",
    "KR-30": "대전",
    "KR-31": "울산",
    "KR-41": "경기",
    "KR-42": "강원",
    "KR-43": "충북",
    "KR-44": "충남",
    "KR-45": "전북",
    "KR-46": "전남",
    "KR-47": "경북",
    "KR-48": "경남",
    "KR-49": "제주",
    "KR-50": "세종"
}

const regionColorMap = {
    "KR-11": "#FF5733",  // 서울
    "KR-26": "#33FF57",  // 부산
    "KR-27": "#3357FF",  // 대구
    "KR-28": "#FFD700",  // 인천
    "KR-29": "#FF1493",  // 광주
    "KR-30": "#1E90FF",  // 대전
    "KR-31": "#8A2BE2",  // 울산
    "KR-41": "#00FF7F",  // 경기
    "KR-42": "#FF6347",  // 강원
    "KR-43": "#20B2AA",  // 충북
    "KR-44": "#FF4500",  // 충남
    "KR-45": "#D2691E",  // 전북
    "KR-46": "#9932CC",  // 전남
    "KR-47": "#8B0000",  // 경북
    "KR-48": "#2E8B57",  // 경남
    "KR-49": "#FF8C00",  // 제주
    "KR-50": "#4B0082"   // 세종
};

// 지역에 맞는 상품 정보를 표시하는 함수
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('../database/database.json');
        const data = await response.json();
        const products = data.productData;

        const regions = document.querySelectorAll('path');  // SVG 지역 요소(아이디 값)

        regions.forEach(path => {
            path.addEventListener('click', (event) => {
                const regionId = path.id;
                mapProductInfo(regionId, products, event);  // 클릭된 위치 이벤트 추가

                highlightRegion(path, regionId);
            });
        });
    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }
});

// 클릭한 지역에 맞게 상품 정보 표시
function mapProductInfo(regionId, products, event) {
    const regionfilter = document.getElementById('regionfilter');
    regionfilter.innerHTML = '';

    // 매핑한 지역 배열에서 일치하는 아이디 찾기(출력해서 보여주기 위함)
    const regionName = regionNameMap[regionId]
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('regionHeader');
    headerDiv.innerHTML = `<h2>${regionName}</h2>`;

    //필터링(일치하는 지역)
    const filteredProducts = products.filter(product => product.prdctregion === regionId);

    // 클릭된 지역의 위치 정보 얻기
    const regionBounds = event.target.getBoundingClientRect();

    // korea_map의 위치 정보 얻기
    const koreaMap = document.getElementById('korea_map');
    const koreaMapBounds = koreaMap.getBoundingClientRect();

    // regionfilter가 korea_map 내부에 위치하도록 설정
    regionfilter.style.top = `${regionBounds.top - koreaMapBounds.top + window.scrollY + 15}px`;
    regionfilter.style.left = `${regionBounds.left - koreaMapBounds.left + window.scrollX + 15}px`;

    // 지역명 추가
    regionfilter.appendChild(headerDiv);

    if (filteredProducts.length > 0) {
        // 상품이 있을 경우 상품 표시
        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('mapProduct');
            productDiv.innerHTML = `
         <a href="../productdetail/1001.html">
             <img class="regionimg" src="${product.prdctImgUrl}" alt="${product.prdctName}">
             <span class="font">${product.prdctName}</span><br>
             </a><br>
         `;
            regionfilter.appendChild(productDiv);
        });


        //디자인 수정 하기 (글자, a 태그 모양)

        regionfilter.innerHTML += '<a class="more-products" href="../product/alllist.html"><span>더 많은 상품 보기</span></a>';
        regionfilter.innerHTML += '<p class="#">상품 이미지를 클릭하면 상세 페이지로 이동합니다.</p>';
    } else {

        //  regionfilter.innerHTML = '<p>해당 지역에 대한 상품이 없습니다.</p>';로 할 경우에는 지역명이 뜨지 않음

        regionfilter.innerHTML += `
        <p>해당 지역에 대한 상품이 없습니다.</p>
        <a class="more-products" href="../product/alllist.html"><span>더 많은 상품 보기</span></a>
    `;

    }
}
function highlightRegion(path, regionId) {
    const regions = document.querySelectorAll('path');
    regions.forEach(region => {
        region.style.fill = '';
    });

    const regionColor = regionColorMap[regionId] || '#000000';
    path.style.fill = regionColor;
}



