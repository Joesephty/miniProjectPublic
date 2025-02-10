'use strict';

const form = document.querySelector('.signForm'),
    submitBtn = form.submitBtn;

async function signin() {
    try {
        const formData = new FormData(form),
            userData = Object.fromEntries(formData),
            response = await axios.post('http://localhost:3000/login', userData),
            token = response.data.accessToken,
            user = response.data.user;

        // document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
        // document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=3600; SameSite=Lax`;
        // 쿠키 저장 방식 사용하려 했으나 실패

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        alert(`${user.name}님 환영합니다.`);
        location.href = '../index.html';

    } catch (err) {
        console.error("로그인 실패:", err.response.data);
        alert(`로그인 실패 : ${err.response?.data}`);
    }
}

submitBtn.addEventListener('click', signin);