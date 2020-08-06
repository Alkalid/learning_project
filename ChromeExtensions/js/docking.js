var VideoID = "";
var d_color = "";


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

function showMarks(MarksArr)      ////////////////獲得現在影片的時間
{
  MarkIndex = 0;
  var VideoCurrentTime = 0;
  vdderr = document.querySelector('video');

  vdderr.addEventListener('timeupdate', function () {   //讀取影片現在的秒數
    renewColor();
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

function renewColor() {
  chrome.storage.sync.get('danmo_color', function (data) {
    d_color = data.danmo_color;
  });
}

