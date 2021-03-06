// pages/movies/movies.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    // inTheaters: {
    //   movies: []
    // }
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  // 数据处理
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
        stars: util.convertToStarsArray(subject.rating.stars)
        // stars: [1, 1, 1, 0, 0]类似这样的数组
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle,
      movies,
    }
    this.setData(readyData);
  },

  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url,
      method: 'GET',
      success: function(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function() {

      }
    })
  },

  onBindFocus: function(event) { 
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    }) 
  },

  onBindBlur: function (event) {
    var txt = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + txt;
    this.getMovieListData(searchUrl, "searchResult", "")
  },

  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/movies/more-movie/more-movie?id=' + category,
    })
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '/pages/movies/movie-detail/movie-detail?id=' + movieId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters?start=0&count=3`;
    var comingSoonUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon?start=0&count=3`;
    var top250Url = `${app.globalData.doubanBase}/v2/movie/top250?start=0&count=3`;

    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250');
  } 
})