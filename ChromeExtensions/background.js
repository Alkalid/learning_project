// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

function checkForValidUrl(tabId, changeInfo, tab) //確認開啟擴充的網址
{
  
  //console.log(tab.url);
  //if (tab.url.indexOf('youtube.com') > -1) 
  if (youtube_parser(tab.url) != false) 
  {
      // ... show the page action.
      chrome.pageAction.show(tabId);
      
  }
  
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);


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
      console.log("有uid: "+ data.uid);
    }
  });
  
})

function toLogin() {
  chrome.tabs.create({
    url: chrome.extension.getURL("options.html")
  });
}


function setStorage(key,value){
  chrome.storage.sync.set({
    key: value
  }, function () {
    console.log('Key:'+key+' change to :'+value);
  });
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){   //當右上角按鈕被按下時
  
  
  if(message.popupOpen) {
    chrome.tabs.executeScript({file: "js/jquery.min.js"});
    chrome.tabs.executeScript({file: "js/danmo.js"});
    chrome.tabs.executeScript({file: "js/function.js"});
    chrome.tabs.executeScript({file: "js/insert.js"});
    
    chrome.tabs.executeScript({file: "js/docking.js"});
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
    uid: "UKoUTHTRz0a"
  }, function () {
    
  });

  chrome.storage.sync.set({
    nowVid: ""
  }, function () {
    console.log('The danmo_text is set.');
  });

});
