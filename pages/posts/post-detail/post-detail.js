// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    collected: false,
    postId: 0,
  },

  onCollectionTap: function(event) {
    // 先从本地获取对应文章的收藏状态，然后取反。
    // 更新data数据，点击按钮让对应文章的收藏图片切换。
    // 并且对本地的storage实施更新，方便下次重新打开页面时获取对应文章的收藏状态
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    this.setData({
      collected: postCollected,
    })
    postsCollected[this.data.postId] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.setData({postId});
    var postData = postsData.postList[postId];
    this.setData({
      postData
    })

    // 分析：
    // 不管所有文章的状态是否是收藏，storage应该用用一个对象表示所有文章对应状态的集合
    // 键名是文章序号，键值是布尔值  true or false
    // var postsCollected = {
    //   0: 'true',
    //   1: 'false',
    //   ....
    // }

    // 页面开始加载的时候从storage获取对应文章的收藏状态，根据这个状态让对应的图片显示
    // 通过控制data的数据来切换图片
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected,
      })
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
  }
})