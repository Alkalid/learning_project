var VideoID = "";
var d_color = "";
var uid = "";
var wsocket;
var alertTab; //用來顯示警告

vdderr = document.querySelector('video');

function youtube_parser(url) {    //獲得影片id
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

console.log(youtube_parser(document.URL));
console.log("time" +vdderr.duration );

VideoID = youtube_parser(document.URL);


checkNewPage();                   //最一開始


function checkNewPage() {
  chrome.storage.sync.get('nowVid', function (data) {
    console.log("nowVid" + data.nowVid);
    if (data.nowVid == "") {
      setStorage("nowVid", VideoID);
      getVideoComment();
    } else if (data.nowVid != VideoID) {    //跳影片了
      setStorage("nowVid", VideoID);
      getVideoComment();
    } else {
      setStorage("nowVid", VideoID);
      getVideoComment();

    }
  });
}

function getVideoComment() {

  wsocket = new WebSocket("wss://114.35.11.36:3000/test");
  wsocket.onopen = function (evt) {
    // 向server要資料
    wsocket.send("getDanmo " + VideoID);
  }

  wsocket.onmessage = function (re) {
    // server傳回的資料
    //console.log("01");
    var redata = "";
    redata = re.data.toString();

    console.log(redata);

    if (redata.split("@")[0] == "Danmo") {
      var PostArr = JSON.parse(redata.split("@")[1]);
      for (var i = 0; i < PostArr.length; i++) {  //獲得+處理影片註記


        var post_id = PostArr[i]['content'];
        console.log(post_id);
      }
      ShowMsgBoard(PostArr);
      showMarks(PostArr);

      console.log("aftershowMarks");
    }

  }
}






chrome.storage.onChanged.addListener(function (changes, namespace) {  //有東西改變的話

  for (var key in changes) {
    var storageChange = changes[key];

    if (key == "danmo_text") {
      newMarks(storageChange.newValue);
      //alert(storageChange.newValue);
    }

    if (key == "danmo_color") {
      d_color = storageChange.newValue;
      alert(storageChange.newValue);
    }

    if (key == "danmo_enable") {

    }

  }

});

var wsocket2;
function newMarks(text) {         //新增彈幕
  text_arr = text.split(";");
  wsocket2 = new WebSocket("wss://114.35.11.36:3000/test");
  getUid();
  wsocket2.onopen = function (evt) {
    // 向server要資料
    wsocket2.send("newDanmo " + VideoID + ";" + text_arr[0] + ";" + Math.floor(vdderr.currentTime) + ";" + uid + ";" + text_arr[1] + ";");
  }

  wsocket2.onmessage = function (re) {
    // server傳回的資料
    //console.log("01");
    var redata = "";
    redata = re.data.toString();

    console.log(redata);
    if (redata == "success") {
      //alert("close");
      wsocket2.close();
    }

  }
}

function showMarks(MarksArr)      ////////////////獲得現在影片的時間
{
  alertTab = new Array(Math.floor(vdderr.duration)); //燈號以秒計算
  for (var k = 0; k < alertTab.length; k++) {
    alertTab[k] = 0;
  }
    


  for (var i = 0; i < MarksArr.length; i++) {   //找出出現問題的地方
    if (MarksArr[i]['hashtag'] == "有問題" || MarksArr[i]['hashtag'] == "聽不懂") { 
      point = parseInt(MarksArr[i]['time']);
      console.log(point);
      for (var j = 5; j >= 1 && point >= 0; j--) {
        alertTab[point] += 1;
        point--;
      }

    }
  }

  for (var k = 0; k < alertTab.length; k++)
    console.log(k + " "+alertTab[k]);

  MarkIndex = 0;
  var VideoCurrentTime = 0;

  MarkIndex2 = 0;

  vdderr.addEventListener('timeupdate', function () {   //讀取影片現在的秒數
    //renewColor();
    console.log(this.currentTime);

    if(alertTab[Math.floor(this.currentTime)] == 0 )
    {
      alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: green;");
    }
    else if(alertTab[Math.floor(this.currentTime)] == 1 )
    {
      alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: yellow;");
    }
    else if(alertTab[Math.floor(this.currentTime)] > 0 )
    {
      alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: red;");
    }

    while (MarkIndex < MarksArr.length) {
      if (MarksArr[MarkIndex]['time'] < this.currentTime + 1 && MarksArr[MarkIndex]['time'] > this.currentTime) {

        console.log(MarksArr[MarkIndex]['content']);  //輸出danmo

        text.push(new Text(MarksArr[MarkIndex]['content'], d_color));  //顯示彈幕

        MarkIndex++;
      }
      else if (MarksArr[MarkIndex]['time'] < this.currentTime) {
        MarkIndex++;
      }
      else {
        break;
      }
    }


  });

  vdderr.addEventListener('click', function () {
    console.log("click");
  });

}


function ShowMsgBoard(MarksArr) {

  var MsgBoard_div = document.createElement('div');
  MsgBoard_div.setAttribute("style", "height:500px; width:450px; overflow:auto;");


  var content_div = document.createElement('div');
  content_div.setAttribute("style", "float:left;");

  var Sec_div = document.createElement('div');
  var thi_div = document.createElement('div');

  for (var i = 0; i < MarksArr.length; i++) {
    p1 = document.createElement('p');
    p2 = document.createElement('p');
    p3 = document.createElement('p');
    p1.innerHTML = MarksArr[i]['content'] + " ";
    p2.innerHTML = "  " + MarksArr[i]['time'];
    //p3.innerHTML = "  " + MarksArr[i]['date'];
    //MsgBoard_div.innerHTML += MarksArr[i]['content']  ;
    content_div.appendChild(p1);
    Sec_div.appendChild(p2);
    thi_div.appendChild(p3);
  }

  MsgBoard_div.appendChild(content_div);
  MsgBoard_div.appendChild(Sec_div);
  MsgBoard_div.appendChild(thi_div);

  var thebr = document.createElement('br');

  commentdiv = document.getElementById('secondary');
  commentdiv.setAttribute("style", "float:left");
  commentdiv.prepend(thebr);
  commentdiv.prepend(thebr);
  commentdiv.prepend(thebr);
  commentdiv.prepend(MsgBoard_div);
  commentdiv.prepend(thebr);
  commentdiv.prepend(alertbtn);

}

var alertbtn = document.createElement('button');
alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: green;");

var imgtag = document.createElement('img'); //第4 tag img
imgtag.setAttribute("src", "https://upload.cc/i1/2020/06/09/sHWv4f.png");
imgtag.setAttribute("style", "width: 200px;margin-left: 14px;margin-right: 7px;margin-top: 4px;float:left");
/*
commentdiv = document.getElementById('secondary');
commentdiv.setAttribute("style", "float:right");
commentdiv.prepend(imgtag);*/




function setStorage(key, value) {
  var jsonfile = {};
  jsonfile[key] = value;
  chrome.storage.sync.set(jsonfile, function () {
    console.log('Key:' + key + ' change to :' + value);
  });
}

function getUid() {
  chrome.storage.sync.get('uid', function (data) {
    uid = data.uid;
  });
}