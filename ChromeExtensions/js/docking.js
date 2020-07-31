var VideoID = "";

function youtube_parser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

console.log(youtube_parser(document.URL));
VideoID = youtube_parser(document.URL);

const cors = 'https://cors-anywhere.herokuapp.com/'; // use cors-anywhere to fetch api data
const url = 'https://114.35.11.36/'; // origin api url
/*
$.ajax({
    url: `${cors}${url}`,
    //url: 'https://114.35.11.36/',
    datatype: "json",
    success: function (retur) 
    {
        console.log(retur);
        alert(retur);
    }
})*/

//Vue.prototype.$axios = axios
/*var jQueryScript = document.createElement('script');  
jQueryScript.setAttribute('src','https://unpkg.com/axios/dist/axios.min.js');
document.head.appendChild(jQueryScript);*/


/** fetch api url by cors-anywhere */

/*
axios.get(`${cors}${url}`)
  .then((response) => {
    const msg = response.data;
    document.body.innerHTML = JSON.stringify(msg)
  },
    (error) => {
    }
  );*/

var wsocket

wsocket = new WebSocket("wss://114.35.11.36:3000/test");
wsocket.onopen = function (evt) {
  // 向server要資料
  wsocket.send("getDanmo " + VideoID);
}

wsocket.onmessage = function (re) {
  // 这是服务端返回的数据
  //console.log("01");
  var redata = "";
  redata = re.data.toString();
  //console.log(redata);
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
    
    console.log(this.currentTime);

    while (MarkIndex < MarksArr.length ) {
      if (MarksArr[MarkIndex]['time'] < this.currentTime + 1 && MarksArr[MarkIndex]['time'] > this.currentTime) {

        console.log(MarksArr[MarkIndex]['content']);  //輸出danmo

        text.push(new Text(MarksArr[MarkIndex]['content']));
        
        MarkIndex++;
      }
      else if(MarksArr[MarkIndex]['time'] < this.currentTime){
        MarkIndex++;
      }
      else{
        break;
      }
    }


  });

  vdderr.addEventListener('click', function () {
    console.log("click");
  });

  //alert(vdderr);
}
