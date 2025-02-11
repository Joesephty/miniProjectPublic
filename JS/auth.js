'use strict';

function headerChange() {
    const header = document.querySelector('.header'),
        auth = header.querySelector('.signIn'),
        pageInfo = window.location.pathname.split("/").pop(),
        token = sessionStorage.getItem('token'),
        user = JSON.parse(sessionStorage.getItem('user'));

    if (token && user) {

        if (pageInfo !== 'index.html') {

            auth.innerHTML = `
                <a href="../mypage/mypage.html" >
                    <i class="fa-solid fa-user Clr6">
                        <span>마이페이지</span>
                    </i>
                </a>
                <a href="#" id="signOutBtn">
                    <i class="fa-solid fa-right-from-bracket Clr6">
                        <span>로그아웃</span>
                    </i>
                </a>
            `
            const signOutBtn = document.querySelector('#signOutBtn');
            signOutBtn.addEventListener('click', signOut);

        } else {

            auth.innerHTML = `
                <a href="./mypage/mypage.html" >
                    <i class="fa-solid fa-user Clr6">
                        <span>마이페이지</span>
                    </i>
                </a>
                <a href="#" id="signOutBtn">
                    <i class="fa-solid fa-right-from-bracket Clr6">
                        <span>로그아웃</span>
                    </i>
                </a>
            `
            const signOutBtn = document.querySelector('#signOutBtn');
            signOutBtn.addEventListener('click', signOut);
        }



    } else {

        if (pageInfo !== 'index.html') {

            auth.innerHTML = `
                <i class="fa-solid fa-user Clr6">
                    <span>로그인</span>
                </i>
            </a>
            `
        } else {
            auth.innerHTML = `
            <a href="./sign/signin.html" id="signInBtn">
                <i class="fa-solid fa-user Clr6">
                    <span>로그인</span>
                </i>
            </a>
            `
        }
    }
}


function initialset() {
    document.addEventListener("DOMContentLoaded", headerChange);
}

function signOut(event) {
    event.preventDefault();


    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    alert('로그아웃 되었습니다.');
    location.reload();
}

initialset();