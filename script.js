import { database } from "./firebase-config.js";

import {

    ref,

    push,

    set,

    onValue,

    remove

} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";





const productInput =
document.getElementById("product");


const expireInput =
document.getElementById("expire");


const list =
document.getElementById("list");


const historyList =
document.getElementById("history");


const summary =
document.getElementById("summary");





let products = [];




// Firebase 위치

const productRef =
ref(database,"products");


const historyRef =
ref(database,"history");







// 한국 시간

function koreaTime(){


    const now =
    new Date();


    const utc =
    now.getTime()
    +
    now.getTimezoneOffset()*60000;


    return new Date(
        utc + (9*60*60*1000)
    );

}







// 상품 추가

window.addItem=function(){


    const name =
    productInput.value.trim();


    const expire =
    expireInput.value;



    if(!name || !expire){

        alert(
        "제품명과 유통기한을 입력하세요."
        );

        return;

    }




    const newProduct =
    push(productRef);



    set(
        newProduct,
        {

            name:name,

            expire:expire

        }

    );



    productInput.value="";

    expireInput.value="";

};








// 상품 삭제

window.removeItem=function(id){


    remove(
        ref(
            database,
            "products/"+id
        )
    );


};









// 상품 실시간 불러오기


onValue(productRef,(snapshot)=>{


    products=[];


    snapshot.forEach((child)=>{


        products.push({

            id:child.key,

            ...child.val()

        });


    });



    checkExpired();


    render();


});









// 폐기 확인

function checkExpired(){


    const now =
    koreaTime();



    products.forEach(product=>{


        const expire =
        new Date(product.expire);



        const deleteTime =
        new Date(
            expire.getTime()
            +
            24*60*60*1000
        );



        // 24시간 이후 자동 삭제

        if(now >= deleteTime){



            const history =
            push(historyRef);



            set(
                history,
                {

                name:
                product.name,


                expire:
                product.expire,


                deletedAt:
                now.toLocaleString(
                    "ko-KR"
                )

                }

            );



            remove(
                ref(
                    database,
                    "products/"+product.id
                )
            );


        }


    });


}









// 화면 출력


function render(){


    list.innerHTML="";



    const now =
    koreaTime();



    let normal=0;

    let warning=0;

    let expired=0;



    products.sort(
        (a,b)=>
        new Date(a.expire)
        -
        new Date(b.expire)
    );





    products.forEach(product=>{


        const expire =
        new Date(product.expire);



        const diff =
        (
            expire-now
        )
        /
        (1000*60*60);




        let status;

        let className;



        if(diff<=0){


            status="🗑️ 폐기 대상";

            className="expired";

            expired++;


        }

        else if(diff<=24){


            status="⚠️ 유통기한 임박";

            className="warning";

            warning++;


        }

        else{


            status="✅ 판매 가능";

            className="normal";

            normal++;


        }





        list.innerHTML += `


        <tr>


        <td>
        ${product.name}
        </td>


        <td>
        ${formatDate(product.expire)}
        </td>


        <td class="${className}">
        ${status}
        </td>



        <td>

        <button
        class="delete"
        onclick="removeItem('${product.id}')">

        삭제

        </button>


        </td>



        </tr>


        `;



    });





    summary.innerHTML =

    `
    판매 가능 : ${normal}개 |
    임박 : ${warning}개 |
    폐기 대상 : ${expired}개
    `;


}









// 폐기 기록 표시


onValue(historyRef,(snapshot)=>{


    historyList.innerHTML="";



    snapshot.forEach((child)=>{


        const item =
        child.val();



        historyList.innerHTML += `


        <tr>


        <td>
        ${item.name}
        </td>


        <td>
        ${formatDate(item.expire)}
        </td>


        <td>
        ${item.deletedAt}
        </td>


        </tr>


        `;



    });


});









// 날짜 표시


function formatDate(value){


    const date =
    new Date(value);



    return (

        date.getFullYear()
        +
        "-"
        +
        String(date.getMonth()+1).padStart(2,"0")
        +
        "-"
        +
        String(date.getDate()).padStart(2,"0")
        +
        " "
        +
        String(date.getHours()).padStart(2,"0")
        +
        ":"
        +
        String(date.getMinutes()).padStart(2,"0")

    );


}








// 검색


window.searchItem=function(){


    const keyword =
    document.getElementById("search")
    .value
    .toLowerCase();



    const rows =
    document.querySelectorAll(
        "#list tr"
    );



    rows.forEach(row=>{


        const name =
        row.cells[0]
        .innerText
        .toLowerCase();



        row.style.display =

        name.includes(keyword)
        ?
        ""
        :
        "none";


    });


}







// 1분마다 시간 확인

setInterval(
    checkExpired,
    60000
);
