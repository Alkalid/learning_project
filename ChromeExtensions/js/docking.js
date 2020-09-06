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
console.log("time" + vdderr.duration);

VideoID = youtube_parser(document.URL);


checkNewPage();                   //最一開始確定是不是新載入的頁面


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
      //setStorage("nowVid", VideoID);
      //getVideoComment();

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
      //alert(storageChange.newValue);
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

  for (var k = 0; k < alertTab.length; k++) //
    console.log(k + " " + alertTab[k]);


  MarkIndex = 0;
  var VideoLastTime = 0;

  MarkIndex2 = 0;
  //////////////////////////////////////////////////////////////////////
  vdderr.addEventListener('timeupdate', function () {   //讀取影片現在的秒數
    //renewColor();

    console.log(this.currentTime);

    //////////////////////////////////////////////////////////////////////燈號部分
    if (alertTab[Math.floor(this.currentTime)] == 0) {
      alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: green;");
    }
    else if (alertTab[Math.floor(this.currentTime)] == 1) {
      alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: yellow;");
    }
    else if (alertTab[Math.floor(this.currentTime)] > 0) {
      alertbtn.setAttribute("style", "width: 220px; height:20px; background-color: red;");
    }


    //////////////////////////////////////////彈幕部分

    //倒帶部分

    while (MarksArr[MarkIndex]['time'] > this.currentTime && MarkIndex > 0) {
      MarkIndex--;
    }


    while (MarkIndex < MarksArr.length) {
      if (MarksArr[MarkIndex]['time'] < this.currentTime && MarksArr[MarkIndex]['time'] > VideoLastTime && MarksArr[MarkIndex]['time'] > this.currentTime - 1) {

        console.log(MarksArr[MarkIndex]['content']);  //輸出danmo

        text.push(new Text(MarksArr[MarkIndex]['content'], d_color));  //顯示彈幕

        MarkIndex++;
      }
      else if (MarksArr[MarkIndex]['time'] < this.currentTime) {
        MarkIndex++;
      }
      else {
        VideoLastTime = this.currentTime;
        break;
      }
    }


  });

  vdderr.addEventListener('click', function () {
    console.log("click");
  });

}

//顯示留言板

function ShowMsgBoard(MarksArr) {

  

  var MsgBoard_div = document.createElement('div');
  MsgBoard_div.setAttribute("style", "height:500px; width:450px; overflow:auto;  margin-top: 10px;"); //留言區div
  MsgBoard_div.id = "MsgBoard_div";

  var content_div = document.createElement('div');
  content_div.setAttribute("style", "float:left; margin-right: 10px;");

  var Sec_div = document.createElement('div');
  Sec_div.setAttribute("style", "margin-left: 3px;");
  var thi_div = document.createElement('div');

  for (var i = 0; i < MarksArr.length; i++) {             //此迴圈生成留言板裡element

    content_div2 = document.createElement('li');          //字幕外框
    content_div2.setAttribute("style", "border-top:1px solid #bdbab8; list-style-type: none;  ");

    content_div_comment = document.createElement('div');  //上部
    content_div_comment.setAttribute("style", "margin-top:5px; font-size:18px; font-family:Microsoft JhengHei;");
    content_div_extra = document.createElement('div');    //下部
    content_div_extra.setAttribute("style", "margin-top:7px; margin-bottom: 5px;");

    time_span = document.createElement('span');                  //顯示字幕出現時間
    //time_span.innerHTML = "  " + MarksArr[i]['time'];
    time_span.innerHTML = time_convert(MarksArr[i]['time']);
    time_span.value = MarksArr[i]['time'];
    time_span.setAttribute("style", "color:blue; ");
    time_span.setAttribute("class", "time");
    time_span.onclick = function () { 
      jumpMovieTime(this.value-0.5);  //點選時間 跳到該時間
    };

    date_span = document.createElement('span');                 //顯示留言日期
    date_span.innerHTML = MarksArr[i]['date'].substring(0,10);
    date_span.setAttribute("style", "color:#ADADAD; float:right; margin-right: 5px;");

    

    p1 = document.createElement('p');
   
    
    p1.innerHTML = MarksArr[i]['content'] + " ";
    

    content_div_comment.innerHTML = MarksArr[i]['content'] + " ";

    
    //MsgBoard_div.innerHTML += MarksArr[i]['content']  ;
    content_div_extra.appendChild(time_span);
    content_div_extra.appendChild(date_span);

    content_div2.appendChild(content_div_comment);
    content_div2.appendChild(content_div_extra);
    MsgBoard_div.appendChild(content_div2);
    //content_div.appendChild(p1);
    //Sec_div.appendChild(p2);
    
  }

  MsgBoard_div.appendChild(content_div);
  MsgBoard_div.appendChild(Sec_div);
  MsgBoard_div.appendChild(thi_div);

  var thebr = document.createElement('br');

  commentdiv = document.getElementById('secondary');  //抓yt的右邊區塊
  commentdiv.setAttribute("style", "float:left; ");
  commentdiv.prepend(thebr);
  commentdiv.prepend(thebr);
  commentdiv.prepend(thebr);
  commentdiv.prepend(MsgBoard_div);
  commentdiv.prepend(thebr);
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


function jumpMovieTime(num) {
  vdderr.currentTime = num;
  
}

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

function time_convert(num)//把數字轉成時間格式
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  if (minutes < 10)
  {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;         
}