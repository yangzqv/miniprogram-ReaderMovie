import { Movie } from './class/Movie.js';
var app = getApp();

Page({
  data: {
    movie: {}
  },

  onLoad: function(options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    movie.getMovieData(movie => {
      this.setData({
        movie
      })
    })
  },

  // 查看图片
  viewMoviePostImg: function(event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,             // 当前图片的http链接
      urls: [src],              // 需要预览的图片http链接列表
    })
  }
})