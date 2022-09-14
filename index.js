window.onload = () => {
  //변수 선언
  const fileInput = document.querySelector('#fileInput')
  const fileName = document.querySelector('.file-name')
  const viewer = document.querySelector('.viewer')
  const loading = document.querySelector('.loading')

  const chatList = document.createElement('ul')
  const chatInfo = {
    myName: '',
    names: [],
  }
  chatList.className = 'chatList'

  //파일 불러오기
  async function loadFile() {
    if (this) {
      const file = new FileReader()
      fileName.value = this.value.replace(/c:\\fakepath\\/i, '')

      initializeChatList()
      startLoading()
      file.readAsText(this.files[0])
      file.onload = () => {
        let textFile = file.result
        makeChatList(textFile)
        endLoading()
      }
    } else {
      console.log('파일 없음')
    }
  }
  //로딩 바
  function startLoading() {
    loading.innerHTML = `<img src="./style/loading-spinner.gif" />`
  }
  function endLoading() {
    loading.innerHTML = ``
  }

  //라인 종류 구분 : 채팅방정보, 날짜구분, 공지텍스트, 일반 대화텍스트
  function classifyChat(lineText) {}

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
      let li = document.createElement('li')

      //운영정책 등 안내 문구
      if (
        text.includes(
          '운영정책을 위반한 메시지로 신고 접수 시 카카오톡 이용에 제한이 있을 수 있습니다.'
        )
      ) {
        li = makeNotice(li, text)

        //닉네임 최대 20자
        if (index === 2) {
          if (text.includes('님이 들어왔습니다')) {
            console.log(`${index}: ${text}`)
            console.log(text.match(/\S+님/))
          }
          chatInfo.myName = text.split('님이')[0]
          console.log(chatInfo.myName)
        }
      }
      //날짜구분 -- 정규식으로
      else if (text.match(/-{15}\s.+\s-{15}/)) {
        //const regExp = "/-{15}\s\d{4}[년]\s\d[월]\s\d[일]\s(월|화|수|목|금|토|일)[요일]\s-{15}/"
        li = makeDate(li, text)
      }
      //일반 채팅 -- 정규식으로 구분할것. 엔터쳐서 구분한 채팅 내용은 포함 어떻게할지?
      else if (text.match(/\[.+\]\s\[.+\]\s.+/)) {
        //text.search("/\[[.]{1-20}\]\s/\[[오(전|후)]\s[0-9]{1,2}:[0-9]{1,2}\]\s/")
        //[닉네임] [오전 5:05] 내용
        li = makeChat(li, text)
      }
      //if end

      //비어있는 내용인지 검사
      if (!(text === '' || text === undefined || text === null)) {
        chatList.appendChild(li)
      }
    })
    viewer.appendChild(chatList)
  }

  function makeNotice(li, text) {
    li.className = 'notice'
    li.innerHTML = `<span class='noticeText'>${text}</span>`
    return li
  }
  function makeDate(li, text) {
    const arr = text.split('---------------')
    li.className = 'notice'
    li.innerHTML = `
  <span class='noticeText'>
    <i class="far fa-calendar-alt icon-date"></i>
    <span>${arr[1]}</span>
  </span>
  `
    return li
  }
  function makeChat(li, text) {
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

    if (chatting.name === chatInfo.myName) {
      li.classList.add('my-chat')
      li.innerHTML = `
      <div class="chatting-wrap">
        <div class="chat-wrap">
          <div class="chat-box">
          <span class="time">${chatting.timestamp}</span>
          <p class="bubble">${chatting.text}<br></p>
          </div>
        </div>
      </div>
      `
    } else {
      li.innerHTML = `
    <div class="chatting-wrap">
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
    </div>
    `
    }

    return li
  }

  /* =============== 이벤트 리스너 =============== */
  fileInput.addEventListener('change', loadFile)
}
