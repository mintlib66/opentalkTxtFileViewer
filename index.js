const fileInput = document.querySelector("#fileInput");
const viewer = document.querySelector(".viewer");

//파일 불러오기
async function loadFile(){
    const file = new FileReader();
    file.onload = () => {
        console.log("--get text--");
        let textFile = file.result;
        console.log(textFile);
        makeChat(splitLine(textFile));
    }
    file.readAsText(this.files[0]);

}

//엔터 찾아서 배열로 담기
function splitLine(text){
    return text.split("\n");
}
//라인 종류 구분 : 채팅방정보, 날짜구분, 공지텍스트, 일반 대화텍스트
function classifyText(lineText){

}
//배열로 담은거 뷰어영역에 엘리먼트로 추가
function makeChat(textArr){
    textArr.forEach((text, index)=>{
        const li = document.createElement("li");

        //채팅방 정보(최초 2라인)
        if(index === 0 || index === 1){
            li.className="notice";
            li.innerText = text;
        }
        //날짜구분 -- 정규식으로 가능할듯. 
        else if(text.includes("---------------")){
            const arr = text.split("---------------");
            li.className="dateDivision";
            li.innerText = arr[1];
        }
        else{
        //일반 채팅
            li.className="chatting";
            const div = document.createElement("div");
            div.className="chat-box"
            const name = document.createElement("span");
            const timestamp = document.createElement("span");
            const chat = document.createElement("p");
            name.className = "name";
            timestamp.className = "time";
            chat.className = "chat";

            const arr = text.split("] ");
            if(arr[0] !== undefined){
                name.innerText = arr[0].slice(1);
            }
            if(arr[2] !== undefined){
                chat.innerText = arr[2];
                div.append(chat);
            }
            if(arr[1] !== undefined){
                timestamp.innerText = arr[1].slice(1);
                div.append(timestamp);
            }

            
            li.append(name, div);
        }

        viewer.appendChild(li);
    
    })
}



/* =============== 이벤트 리스너 =============== */

//파일 첨부 이벤트 리스너
fileInput.addEventListener("change", loadFile);