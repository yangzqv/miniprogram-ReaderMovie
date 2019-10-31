// pages/movies/movies.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: []
  },

  // 数据处理
  processDoubanData: function(moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        movieId: subject.id,
        coverageUrl: subject.images.large,
        title,
        average: subject.rating.average,
      }

      movies.push(temp);
      this.setData({
        movies,
      })
    }
  },

  getMovieListData: function(url) {
    var that = this;
    wx.request({
      url,
      method: 'GET',
      success: function(res) {
        that.processDoubanData(res.data)
      },
      fail: function() {

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters?start=0&count=3`;
    var comingSoonUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon?start=0&count=3`;
    var top250Url = `${app.globalData.doubanBase}/v2/movie/top250?start=0&count=3`;

    this.getMovieListData(top250Url);
  }
  
})