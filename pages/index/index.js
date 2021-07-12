//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js")
let url, page = 1;

Page({
  data: {
    currentIndex:'2',
    type0: [],
    type1: [],
    type2: [],
    type3: [],
    type4: []
  },
  onPullDownRefresh: function (e) {
    console.log("刷新")
    page = 1;
    switch (this.data.currentIndex){
      case '0':
        this.setData({type0: []});
        break;
      case '1':
        this.setData({ type1: [] });
        break;
      case '2':
        this.setData({ type2: [] });
        break;
      case '3':
        this.setData({ type3: [] });
        break;
      case '4':
        this.setData({ type4: [] });
        break;
    }
    this.getList(this.data.currentIndex, this)
  },
  onReachBottom: function (e) {
    console.log("下一页")
    //this.getList(this.data.currentIndex, this)
  },
  lower: function (e) {
    console.log("底部",e)
    this.getList(this.data.currentIndex, this)
  },
  go:function(e){
    page = 1
    this.setData({
      currentIndex: e.currentTarget.dataset.i
    })
    if(this.data['type' + e.currentTarget.dataset.i]==""){ //点击切换如果等于空就加载数据
      this.getList(e.currentTarget.dataset.i, this)
    }
  },
  getIndex:function(e){
    if (e.detail.source){
      page = 1
      this.setData({
        currentIndex: e.detail.current + ''
      })
      if (this.data['type' + e.detail.current] == "") { //滑动切换如果等于空就加载数据 
        this.getList(e.detail.current + '', this)
      }
    }
  },
  onLoad: function () {
    this.getList('2',this)
  },
  // playvideo:function(e){
  //   if (e.currentTarget.dataset.name){
  //     wx.navigateTo({
  //       url: 'detail?videosrc=' + e.currentTarget.dataset.videosrc + '&name=' + e.currentTarget.dataset.name + '&head=' + e.currentTarget.dataset.head + '&content=' + e.currentTarget.dataset.content,
  //     })
  //   }else{
  //     wx.navigateTo({
  //       url: 'detail?videosrc=' + e.currentTarget.dataset.videosrc
  //     })
  //   }
      
  // },
  // openImg:function(e){
  //   if (e.currentTarget.dataset.name) {
  //     wx.navigateTo({
  //       url: 'detail?imgsrc=' + e.currentTarget.dataset.imgsrc + '&name=' + e.currentTarget.dataset.name + '&head=' + e.currentTarget.dataset.head + '&content=' + e.currentTarget.dataset.content,
  //     })
  //   }else{
  //     wx.navigateTo({
  //       url: 'detail?imgsrc=' + e.currentTarget.dataset.imgsrc 
  //     })
  //   }
    
  // },
  getList:function(type ,that){ 
    wx.showNavigationBarLoading()
    console.log(type)
    let url = '';
    switch (type){
      case '0':
        url = '/jokes/list/random?page=' + page;
        break;
      case '1':
        url = '/daily_word/recommend?count=20&page=' + page;
        break;
      case '2':
        url = '/image/girl/list?page=' + page;
        break;
      case '3':
        url = '/image/girl/list/random?page=' + page;
        break;
      case '4':
        url = '/jokes/list?page=' + page;
        break;
    } 
    console.log(url)
    wx.request({
      url: 'https://www.mxnzp.com/api'+url,
      method: 'GET',
      header:{
        'app_id':'h3rmpujrsqireuqn',
        'app_secret':'akMzRUF2Qnp2QWRZSk9qQjJnek5KZz09'
      },
      success: function (res) { 
        let l = that.data['type' + type]
        switch (that.data.currentIndex) {
          case '0':
            l = [...l,...res.data.data]
            that.setData({ type0: l });
            break;
          case '1':
            l = [...l,...res.data.data]
            that.setData({ type1: l });
            break;
          case '2':
            l = [...l,...res.data.data.list]
            that.setData({ type2: l });
            break;
          case '3':
            l = [...l,...res.data.data]
            that.setData({ type3: l });
            break;
          case '4':
            l = [...l,...res.data.data.list]
            that.setData({ type4: l });
            break;
        }
        page++;
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log(l)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  copy:function(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success() {
      }
    })
  },
  // 长按保存功能
  saveImage (e) {
    util.saveImage(e)
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "江畔何人初见月？",        // 默认是小程序的名称
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function (err) {
        if (err.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (err.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    　　return shareObj
  }
})
