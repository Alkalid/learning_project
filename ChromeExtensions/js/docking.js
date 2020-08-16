var VideoID = "";
var d_color = "";
vdderr = document.querySelector('video');

function youtube_parser(url) {    //獲得影片id
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

console.log(youtube_parser(document.URL));
VideoID = youtube_parser(document.URL);



var wsocket

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
    showMarks(PostArr);

    console.log("aftershowMarks");
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

  }

});

var wsocket2;
function newMarks(text) {
  wsocket2 = new WebSocket("wss://114.35.11.36:3000/test");
  wsocket2.onopen = function (evt) {
    // 向server要資料
    wsocket2.send("newDanmo " + VideoID + ";" + text + ";" + Math.floor(vdderr.currentTime) + ";" + "UKpUTHTXgY");
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
  MarkIndex = 0;
  var VideoCurrentTime = 0;


  vdderr.addEventListener('timeupdate', function () {   //讀取影片現在的秒數
    //renewColor();
    console.log(this.currentTime);

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


var imgtag = document.createElement('img'); //第4 tag img
imgtag.setAttribute("src", "https://upload.cc/i1/2020/06/09/sHWv4f.png");
imgtag.setAttribute("style", "width: 200px;margin-left: 14px;margin-right: 7px;margin-top: 4px;float:left");

commentdiv = document.getElementById('secondary');
commentdiv.setAttribute("style", "float:right" );
commentdiv.prepend(imgtag);