// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var nowVid = "";
var opened = 0;
var uid = "";

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

function checkForValidUrl(tabId, changeInfo, tab) //確認開啟擴充的網址
{
  
  if (youtube_parser(tab.url) != false) 
  {
      
      
      chrome.pageAction.show(tabId);
      
      setStorage("nowVid", youtube_parser(tab.url));
      if(nowVid == "")
      {
        nowVid = youtube_parser(tab.url);
        opened = 0;
      }
      else if(nowVid != youtube_parser(tab.url) ) //表示換頁
      {
        //chrome.tabs.reload();
        nowVid = youtube_parser(tab.url);
        opened = 0;
      }
      
  }
 
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);  //當網址改變的時候會觸發的事件

chrome.tabs.onRemoved.addListener();  //關閉分頁

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

chrome.pageAction.onClicked.addListener(tab => {
  
  
  chrome.storage.sync.get('uid', function (data) {
    if(data.uid == "")
    {
      chrome.tabs.create({
        url: chrome.extension.getURL("options.html")
      });
      //toLogin();
      console.log("跳轉");
    }
    else{
      uid = data.uid;
      console.log("有uid: "+ data.uid);
    }
  });
  
})

function toLogin() {
  chrome.tabs.create({
    url: chrome.extension.getURL("options.html")
  });
}

function setStorage(key, value) {
  var jsonfile = {};
  jsonfile[key] = value;
  chrome.storage.sync.set(jsonfile, function () {
    console.log('Key:' + key + ' change to :' + value);
  });
}
/*
function setStorage(key,value){
  chrome.storage.sync.set({
    key: value
  }, function () {
    console.log('Key:'+key+' change to :'+value);
  });
}*/


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){   
  
  

  if(message.popupOpen && opened == 0 ) {   //當右上角按鈕被按下時
    chrome.tabs.executeScript({file: "js/jquery.min.js"});
    chrome.tabs.executeScript({file: "js/danmo.js"});
    chrome.tabs.executeScript({file: "js/function.js"});
    chrome.tabs.executeScript({file: "js/insert.js"});
    chrome.tabs.executeScript({file: "js/docking.js"});
    opened = 1;
   }
});



var token;
chrome.runtime.onInstalled.addListener(function () {    //註冊監聽事件
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  chrome.storage.sync.set({
    danmo_channel: text
  }, function () {
    console.log('The danmo_channel is set.');
  });
  chrome.storage.sync.set({
    danmo_enable: "false"
  }, function () {
    console.log('The danmo_channel is set.');
  });

  chrome.storage.sync.set({
    danmo_color: "#000000"
  }, function () {
    console.log('The danmo_color is set.');
  });

  chrome.storage.sync.set({
    danmo_text: ""
  }, function () {
    console.log('The danmo_text is set.');
  });

  chrome.storage.sync.set({
    uid: ""
  }, function () {
    
  });

  chrome.storage.sync.set({
    nowVid: ""
  }, function () {
    console.log('The danmo_text is set.');
  });

});
