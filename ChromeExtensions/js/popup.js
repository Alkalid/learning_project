
'use strict';

chrome.runtime.sendMessage({ popupOpen: true });
///////////////by an
let ta = document.getElementById('ta');
let color_input = document.getElementById('color');
let comment_input = document.getElementById('comment');
let submit_input = document.getElementById('submitComment');
let toRecord_span = document.getElementById('toRecord_span');  //查看分析 按鈕

let emoji_input = document.getElementsByName('emoji'); //
for(var i=0;i<emoji_input.length;i++)
    emoji_input[i].onclick = newEmoji;

/////////////////////////////
//let channel_name_tag = document.getElementById('channel');
let channel_button = document.getElementById('setchannelbut');

let rand_set_cha = document.getElementById('randomset');
let LoginBoard = document.getElementById('LoginBoard');
let ControlBoard = document.getElementById('ControlBoard');

let account_input = document.getElementById('account_input');
let password_input = document.getElementById('password_input');
let login_btn = document.getElementById('login_btn');
let hashtag = document.getElementsByName('hashtag');

function setStorage(key, value) {                         //將要傳遞的資料(留言 彈幕顏色 傳遞給dockong.js)
  var jsonfile = {};
  jsonfile[key] = value;
  chrome.storage.sync.set(jsonfile, function () {
    console.log('Key:' + key + ' change to :' + value);
  });
}

function setOpen(bool) {
  setStorage("danmo_enable", bool)
}
$('#myonoffswitch').change(function () {
  if (this.checked) {
    setOpen("true");
  } else {
    setOpen("false");
  }
});
/*function setQRcode(channel){channel
  $('#qrcode').empty();
  $('#qrcode').qrcode("https://danmo.foxo.tw/#"+channel);
}*/

/*chrome.storage.sync.get('danmo_channel', function (data) {
  if (data.danmo_channel == null) {
    console.log("Channel Not set!");
  } else {
    channel_name_tag.value = data.danmo_channel;
    setQRcode(data.danmo_channel);
  }
});*/

chrome.storage.sync.get('danmo_enable', function (data) {
  if (data.danmo_enable == "true") {
    $('#myonoffswitch').prop('checked', true);
  } else {
    $('#myonoffswitch').prop('checked', false);
  }
});


///////////////////////////////////////////////////////////////////////by an
checkLogin();

function checkLogin() {
  chrome.storage.sync.get('uid', function (data) {
    ta.innerHTML = data.uid;
    if (data.uid == "") {
      PageSwitcher(0);
    } else {
      PageSwitcher(1);

    }
  });
}

var wsocket;
login_btn.onclick = function (element) {  //送出登入請求

  wsocket = new WebSocket("wss://114.35.11.36:3000/test");
  wsocket.onopen = function (evt) {
    wsocket.send("login " + account_input.value + ";" + password_input.value + ";");
  }

  wsocket.onmessage = function (re) {     //success ; uid         fail ;                                    
    var redata = "";
    redata = re.data.toString();
    var remsg = redata.split(";");
    console.log(redata);

    if (remsg[0] == "success") {
      ta.innerHTML = remsg[1];
      setStorage("uid", remsg[1]);
      PageSwitcher(1);
      wsocket.close();
    }
    else if (remsg[0] == "fail") {
      //alert("close");
      ta.innerHTML = "帳號或密碼錯誤";
      wsocket.close();
    }

  }
}



function PageSwitcher(state) {            //更改顯示的區塊
  if (state == 0) {
    LoginBoard.style.display = '';
    ControlBoard.style.display = 'none';
  }
  else if (state == 1) {
    LoginBoard.style.display = 'none';
    ControlBoard.style.display = '';
  }
}


color_input.onchange = function (element) {
  setStorage("danmo_color", color_input.value);
}

submit_input.onclick = function (element) {
  if (comment_input.value != '') {
    setDanmoText(comment_input.value);
    comment_input.value = "";
  }

}

function setDanmoText(text) {
  for (var i = 0; i < hashtag.length; i++) {
    if (hashtag[i].checked) {
      setStorage("danmo_text", text + ";" + hashtag[i].value);
    }
  }

}

function newEmoji(e) {
  //ta.innerText = this.value;
  setStorage("danmo_text", this.value + ";emoji" );
}

toRecord_span.onclick = function (element) {    //查看分析的按鈕被按下，就開啟新分頁
  window.open('http://114.35.11.36:5000/home');

}

  