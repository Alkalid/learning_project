// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.sendMessage({ popupOpen: true });
///////////////by an
let ta = document.getElementById('ta');
let color_input = document.getElementById('color');
let comment_input = document.getElementById('comment');
let submit_input = document.getElementById('submitComment');



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

function setStorage(key, value) {
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
/*function setChannel(channel) {
  setStorage("danmo_channel",channel);

    channel_name_tag.value = channel;
    msg.text = "更改成功";
    setQRcode(channel);

}*/
/*
channel_button.onclick = function (element) {
  setChannel(channel_name_tag.value);
}*/
/*
rand_set_cha.onclick = function (element) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
   text += possible.charAt(Math.floor(Math.random() * possible.length));
  setChannel(text);
}*/
/*$('#channel').keypress(function (e) {
  var key = e.which;
  if(key == 13)  // the enter key code
   {
    setChannel(channel_name_tag.value);
   }
 });*/


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
  comment_input.value = "";
  setDanmoText(comment_input.value);
  
}

function setDanmoText(text) {
  for (var i = 0;  i < hashtag.length; i++) {
    if (hashtag[i].checked) {
      setStorage("danmo_text", text + ";" + hashtag[i].value);
    }
  }

}
