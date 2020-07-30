console.log("ddd");
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
    redata = re.data;
    console.log(redata);
    //respmsg = JSON.parse(re.data);
    //var type = respmsg.msg_type;
    
    //console.log(type);
}
