function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }

  return array;
}

// 请求服务器
function http(url, callBack) {
  wx.request({
    url,
    method: 'GET',
    success: function (res) {
      callBack(res.data);
    },
    fail: function () {
    }
  })
}

module.exports = {
  convertToStarsArray,
  http
}