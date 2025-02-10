'use strict';

// document.addEventListener("DOMContentLoaded", function () {
//     const termsCheckbox = document.querySelector('.termsAgreeCheckbox');
//     const privacyCheckbox = document.querySelector('.privacyAgreeCheckbox');
//     const submitBtn = document.querySelector('.btn-us');

//     // ✅ 체크박스 상태 확인 후 버튼 활성화
//     function checkAgreement() {
//         if (termsCheckbox.checked && privacyCheckbox.checked) {
//             submitBtn.classList.add('active');
//             submitBtn.classList.remove('disabled');
//             submitBtn.removeAttribute('aria-disabled');
//         } else {
//             submitBtn.classList.remove('active');
//             submitBtn.classList.add('disabled');
//             submitBtn.setAttribute('aria-disabled', 'true');
//         }
//     }

//     // ✅ 체크박스 상태 변경 시 확인
//     termsCheckbox.addEventListener("change", checkAgreement);
//     privacyCheckbox.addEventListener("change", checkAgreement);

//     // ✅ 초기 상태 설정
//     checkAgreement();
// });




const form = document.querySelector('.userOfTermContainer'),
    termsAgree = form.querySelector('#termsAgree'),
    privacyAgree = form.querySelector('#privacyAgree'),
    btnSign = form.querySelector('.btnSign');

function checkAgreement() {

    if (termsAgree.checked && privacyAgree.checked) {

        btnSign.classList.remove('disabled');
        btnSign.classList.add('active');
        btnSign.addEventListener('click', () => {
            location.href = './signup.html';
        });

    } else {

        btnSign.classList.remove('active');
        btnSign.classList.add('disabled');

    }
}

// console.log(btnSign);
// console.log(termsAgree);
// console.log(privacyAgree);


termsAgree.addEventListener('change', checkAgreement);
privacyAgree.addEventListener('change', checkAgreement);