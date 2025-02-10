
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // const form = document.getElementById('signForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError')
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    function validatePassword(password, regex) {
        if (!regex.test(password)) {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
    }

    function validateConfirmPassword() {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordError.style.display = 'block';
        } else {
            confirmPasswordError.style.display = 'none';
        }
    }
    function validatephone(phone, confirmNum) {
        if (phone.length !== confirmNum) {
            phoneError.style.display = 'block';
        } else {
            phoneError.style.display = 'none';
        }
    }

    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,21}$/;
        validatePassword(password, regex);
    });

    confirmPasswordInput.addEventListener('input', function () {
        validateConfirmPassword();
    });

    phoneInput.addEventListener('input', function () {
        const phone = phoneInput.value;
        const confirmNum = 11;
        validatephone(phone, confirmNum);
    });

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

    const userSignForm = document.userSignForm,
        submitBtn = userSignForm.submitBtn;

    async function addUser() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const phone = phoneInput.value;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,21}$/;
        if (!passwordRegex.test(password)) {
            passwordError.style.display = 'block';
            return;
        } else {
            passwordError.style.display = 'none';
        }

        if (password !== confirmPassword) {
            confirmPasswordError.style.display = 'block';
            return;
        } else {
            confirmPasswordError.style.display = 'none';
        }

        if (phone.length !== 11) {
            alert("핸드폰 번호는 11자리여야 합니다!");
            return;
        }

        try {

            // const hashingPW = bcrypt.hashSync(userSignForm.password.value, 10) ,
            // password 암호화 하기 위해 bcryptjs 라이브러리 이용하려했으나 실패
            // json-server-auth를 이용 성공

            // const userData = {
            //   email: userSignForm.email.value,
            //   userName: userSignForm.name.value,
            //   password: hashingPW,
            //   phone: userSignForm.phone.value,
            //   joindate : getnow(),
            //   grade: 0
            // };
            // 
            // console.log(userData);
            // object 추가 제거를 이용하면 더 쉽게 작업가능

            const formData = new FormData(userSignForm),
                userData = Object.fromEntries(formData);

            userData.greade = '0';
            userData.joindate = getnow();

            delete userData.confirmPassword;

            // console.log(getnow());
            // console.log(userData);

            axios.post('http://localhost:3000/users', userData);
            alert("회원가입이 완료되었습니다!");
            window.location.href = './signin.html';

        } catch (err) {
            console.log('데이터를 전송중 오류 발생');
            console.log(err.message);
        }
    }
    submitBtn.addEventListener('click', addUser);
});




// submitBtn.addEventListener('click', function(event){
//     event.preventDefault();

//     const password = passwordInput.value;
//     const confirmPassword = confirmPasswordInput.value;
//     const phoneNumber = phoneNumberInput.value;

//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,21}$/;
//     if (!passwordRegex.test(password)) {
//         passwordError.style.display = 'block';
//         return;
//     } else {
//         passwordError.style.display = 'none';
//     }

//     if (password !== confirmPassword) {
//         confirmPasswordError.style.display = 'block';
//         return;
//     } else {
//         confirmPasswordError.style.display = 'none';
//     }

//     if (phoneNumber.length !== 11) {
//         alert("핸드폰 번호는 11자리여야 합니다!");
//         return;
//     }
//     addUser();
//     alert("회원가입이 완료되었습니다!");
//     window.location.href = './signin.html';
// });