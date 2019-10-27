// pages/posts/posts.js
var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: `/pages/posts/post-detail/post-detail?id=${postId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      posts_key: postsData.postList
    })
  }

 
})