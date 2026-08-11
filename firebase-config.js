//
// firebase-config.js
// Firebase 연결 설정 파일
//

// Firebase SDK 가져오기
import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getDatabase } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Firebase 콘솔에서 받은 설정값 입력
const firebaseConfig = {

    apiKey: "AIzaSyC56Icyhi544jPnOeJMRYK9DIZlHgMc-yI",

    authDomain:
    "s25-e192a.firebaseapp.com",

    databaseURL:
    "https://gs25-e192a-default-rtdb.firebaseio.com",

    projectId:
    "gs25-e192a",

    storageBucket:
    "gs25-e192a.firebasestorage.app",

    messagingSenderId:
    "416508506684",

    appId:
    "1:416508506684:web:e0badd26b8ad9277f18939"

};



// Firebase 초기화

const app = initializeApp(firebaseConfig);


// Realtime Database 연결

const database = getDatabase(app);


// 다른 파일에서 사용 가능하도록 export

export {
    database
};
