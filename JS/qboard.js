// 'use strict';


// async function QuestionList() {
//     const table = document.querySelector('.productQuestion'),
//         qboard = table.querySelector('qboard'),
        
//         QuestionList = await axios.get('http://localhost:3000/qboardPost'),
//         totalQuestion = QuestionList.length,
        
//         currentPage = 1,
//         rowsPerPage =  10,
        
//         totalPage = Math.ceil(totalQuestion / rowsPerPage),
        
//         startIndex = (currentPage - 1) * rowsPerPage,
//         endIndex = startIndex + rowsPerPage,
//         paginatedQuestion= QuestionList.slice(startIndex, endIndex);

//     qboard.innerHTML = ``;

//     paginatedQuestion.forEach(qboardPost) => {
//         function formatPostDate(postDate) {
//             // 숫자일 경우 문자열로 변환
//             const str = postDateDate.toString();

//             // 17자리가 아닐 경우 그냥 원래 값을 반환
//             if (str.length !== 17) return postDate;

//             // 각 부분을 슬라이스
//             const year = str.slice(0, 4);   // "2025"
//             const month = str.slice(4, 6);   // "02"
//             const day = str.slice(6, 8);   // "07"
//             const hour = str.slice(8, 10);  // "17"
//             const minute = str.slice(10, 12); // "06"
//             const rest = str.slice(12);     // "00105"

//             // 포맷팅 예시: "2025년 02월 07일 17시 06분 00105"
//             return `${year}.${month}.${day}`;

//             // 만약 "2025.02.07 17시 06분 00105" 형태로 원한다면 아래처럼 사용:
//             // return `${year}.${month}.${day} ${hour}시 ${minute}분 ${rest}`;
//         }

//         let row = `
//             <tr class="qboardRows">
//                 <td>${qboardPost.qboardNo}</td>
//                 <td>${qboardPost.qboardTitle}</td>
//                 <td>${qboardPost.email}</td>
//                 <td>${formatPostDate(qboardPost.postDate)}</td>
//             </tr>
//         `;
//         qboard.innerHTML += row;
//     }
    
// }

