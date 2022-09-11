//변수 선언
const fileInput = document.querySelector('#fileInput')
const viewer = document.querySelector('.viewer')
const loading = document.querySelector('.loading')
const chatList = document.createElement('ul')
chatList.className = 'chatList'

//로딩 창
function startLoading() {
  loading.innerHTML = `<img src="./style/loading-spinner.gif" />`
}
function endLoading() {
  loading.innerHTML = ``
}
//파일 불러오기
async function loadFile() {
  const file = new FileReader()

  initializeChatList()
  startLoading()
  file.readAsText(this.files[0])
  endLoading
  file.onload = () => {
    let textFile = file.result
    makeChatList(textFile)
  }
}

//엔터로 구분, 텍스트 자르기
function splitLine(text) {
  return text.split('\n')
}
//빈 내용 검사
function checkNothing(text) {
  return text === '' ? true : false
}
//라인 종류 구분 : 채팅방정보, 날짜구분, 공지텍스트, 일반 대화텍스트
function classifyText(lineText) {}

function initializeChatList() {
  viewer.innerHTML = ''
}

function makeChatList(text) {
  const textArr = text.split('\n')

  //채팅방 정보(최초 2라인)
  const titleArr = textArr.slice(0, 2)
  const listTitle = document.createElement('div')
  listTitle.className = 'listTitle'
  listTitle.innerHTML = `<h1 class='title'>${titleArr[0]}</h1><p class='saveDate'>${titleArr[1]}</p>`
  viewer.appendChild(listTitle)

  //채팅 내용
  textArr.splice(0, 2)
  textArr.forEach((text, index) => {
    const li = document.createElement('li')

    //운영정책 등 안내 문구
    if (
      text.includes(
        '운영정책을 위반한 메시지로 신고 접수 시 카카오톡 이용에 제한이 있을 수 있습니다.'
      )
    ) {
      li.className = 'notice dateDivision'
      li.innerHTML = `<span class='noticeText'>${text}</span>`
    }
    //날짜구분 -- 정규식으로
    else if (text.match(/-{15}\s.+\s-{15}/)) {
      //const regExp = "/-{15}\s\d{4}[년]\s\d[월]\s\d[일]\s(월|화|수|목|금|토|일)[요일]\s-{15}/"
      //console.log('날짜: ', text)
      const arr = text.split('---------------')
      li.className = 'notice'
      li.innerHTML = `
      <span class='noticeText'>
        <i class="far fa-calendar-alt icon-date"></i>
        <span>${arr[1]}</span>
      </span>
      `
    }
    //일반 채팅 -- 정규식으로 구분할것. 엔터쳐서 구분한 채팅 내용은 포함 어떻게할지?
    else if (text.match(/\[.+\]\s\[.+\]\s.+/)) {
      //text.search("/\[[.]{1-20}\]\s/\[[오(전|후)]\s[0-9]{1,2}:[0-9]{1,2}\]\s/")
      //[닉네임] [오전 5:05] 내용
      li.className = 'chatting'

      const chatting = {
        name: '',
        timestamp: '',
        text: '',
      }

      //대괄호로 이름/시간/채팅내용 구분
      const arr = text.split('] ')
      if (arr[0] !== undefined) {
        chatting.name = arr[0].slice(1)
      }
      if (arr[2] !== undefined) {
        chatting.text = arr[2]
      }
      if (arr[1] !== undefined) {
        chatting.timestamp = arr[1].slice(1)
      }

      li.innerHTML = `
      <div class="pic">
        <span class="initial">${chatting.name.charAt(0)}</span>
      </div>
      <div class="chat-wrap">
        <span class="name">${chatting.name}</span>
        <div class="chat-box">
            <p class="bubble">${chatting.text}<br></p>
            <span class="time">${chatting.timestamp}</span>
        </div>
      </div>
      `

      //   li.append(name, div)
    }
    //if end
    //else로는 공지들어가도?

    //비어있는 내용인지 검사
    if (!(text === '' || text === undefined || text === null)) {
      chatList.appendChild(li)
    }
  })
  viewer.appendChild(chatList)
}

/* =============== 이벤트 리스너 =============== */

//파일 첨부 이벤트 리스너
fileInput.addEventListener('change', loadFile)

/*=== to do ===
1. 닉네임 구분 => 배열이나 오브젝트등에 담아두고 프사/ 채팅형태 나와 타인 형태로 분리
2. 텍스트 종류 정리(일반챗, 공지, 날짜...) 
3. 채팅내역이 일정량 이상으로 많을 경우, 사용자 마우스 클릭 시 이후 채팅내역을 추가로 보여주는 기능 
4. 채팅 검색 기능 
5.사용방법 안내를 상단에 추가 (최상단에 넣고 아이콘으로 접고 펼치기 되게 하면 좋을듯.) 
6. 뷰어 바깥 스타일링 
7. 파일 불러오는 동안 프로그래스 바 표시 

*/
