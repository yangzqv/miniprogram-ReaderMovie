// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    collected: false,
    postId: null,
    isPlayingMusic: false,
  },

  showModal: function(postsCollected, postCollected) {
    var _this = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章' : '取消收藏该文章',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确定',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          _this.setData({
            collected: postCollected,
          })
        }
      }
    })
  },

  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected,
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
    })
  },

  setMusicMonitor: function() {
    var _this = this;
    wx.onBackgroundAudioPlay(function () {
      _this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_isPlayingMusicPostId = _this.data.postId;
    })
    wx.onBackgroundAudioPause(function () {
      _this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_isPlayingMusicPostId = null;
    })
    wx.onBackgroundAudioStop(function() {
      _this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_isPlayingMusicPostId = null;
    })
  },

  onCollectionTap: function(event) {
    // 先从本地获取对应文章的收藏状态，然后取反。
    // 更新data数据，点击按钮让对应文章的收藏图片切换。
    // 并且对本地的storage实施更新，方便下次重新打开页面时获取对应文章的收藏状态
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.postId];
    postCollected = !postCollected;
    postsCollected[this.data.postId] = postCollected;

    // this.showModal(postsCollected, postCollected);
    this.showToast(postsCollected, postCollected);
  },

  onShareTap: function(event) {
    var itemList = [
      "微信好友",
      "朋友圈",
      "QQ",
      "微博",
    ]
    wx.showActionSheet({
      itemList,
      itemColor: '#405F80',
      success: function(res) {
        wx.showModal({
          title: '用户分享到：' + itemList[res.tapIndex],
          content: '现在还不能分享哦',
        })
      }
    })
  },

  onMusicTap: function(event) {
    // 分析
    // 多个文章不同列表的音乐关系
    // 总控开关与我们自定义开关的关系
    // 音乐的总控开关只会出现在微信的首页里面
    var currentPostId = this.data.postId;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postList[currentPostId];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: !isPlayingMusic
      }) 
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: !isPlayingMusic
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id;
    this.setData({
      postId
    });
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

    // 页面开始加载的时候就监听全局变量
    if (app.globalData.g_isPlayingMusic && app.globalData.g_isPlayingMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }

    // 页面开始加载的时候我们就监听音乐的播放状态
    this.setMusicMonitor();
  }
})