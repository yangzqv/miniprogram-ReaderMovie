// pages/movies/more-movie/more-movie.js
var util = require('../../../utils/util.js');
var app = getApp();

Page({
  data: {
    navigateTitle: "",
    movies: [],
    requestUrl: '',
    totalCount: 0,
    isEmpty: true // 表示是不是初次进来 
  },

  // 数据的处理 
  processDoubanData: function (moviesDouban) {
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

    if (!this.data.isEmpty) {
      var totalMovies = [];
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      })
    }

    this.setData({ 
      movies: totalMovies,
      totalCount: this.data.totalCount + 20
    });
    
  },

  onScrollLower: function(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
  },

  onLoad: function(options) {
    var category = options.id;
    var dataUrl = "";
    this.setData({ 
      navigateTitle: category
    })

    switch(category) {
      case "正在热映":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters`;
        break;
      case "即将上映":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon`;
        break;
      case "豆瓣Top250":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/top250`;
        break;
    }

    this.setData({
      requestUrl: dataUrl
    })
    util.http(dataUrl, this.processDoubanData);
  },

  onReady: function(options) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
})