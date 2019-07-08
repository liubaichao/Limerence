//index.js
//获取应用实例
const app = getApp()

let url, page = 1;

Page({
  data: {
    currentIndex:'0',
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
    this.setData({
      currentIndex: e.currentTarget.dataset.i
    })
    if(this.data['type' + e.currentTarget.dataset.i]==""){ //点击切换如果等于空就加载数据
      this.getList(e.currentTarget.dataset.i, this)
    }
  },
  getIndex:function(e){
    if (e.detail.source){
      this.setData({
        currentIndex: e.detail.current + ''
      })
      if (this.data['type' + e.detail.current] == "") { //滑动切换如果等于空就加载数据
        this.getList(e.detail.current + '', this)
      }
    }
  },
  onLoad: function () {
    this.getList('0',this)
  },
  playvideo:function(e){
    if (e.currentTarget.dataset.name){
      wx.navigateTo({
        url: 'detail?videosrc=' + e.currentTarget.dataset.videosrc + '&name=' + e.currentTarget.dataset.name + '&head=' + e.currentTarget.dataset.head + '&content=' + e.currentTarget.dataset.content,
      })
    }else{
      wx.navigateTo({
        url: 'detail?videosrc=' + e.currentTarget.dataset.videosrc
      })
    }
      
  },
  openImg:function(e){
    if (e.currentTarget.dataset.name) {
      wx.navigateTo({
        url: 'detail?imgsrc=' + e.currentTarget.dataset.imgsrc + '&name=' + e.currentTarget.dataset.name + '&head=' + e.currentTarget.dataset.head + '&content=' + e.currentTarget.dataset.content,
      })
    }else{
      wx.navigateTo({
        url: 'detail?imgsrc=' + e.currentTarget.dataset.imgsrc 
      })
    }
    
  },
  getList:function(type ,that){ 
    wx.showNavigationBarLoading()
    console.log(type)
    let url = '';
    switch (type){
      case '0':
        url = 'https://www.apiopen.top/satinApi?type=1&page=' + page;
        break;
      case '1':
        url = 'https://www.apiopen.top/femaleNameApi?page=' + page;
        break;
      case '2':
        url = 'https://www.apiopen.top/meituApi?page=' + page;
        break;
      case '3':
        url = 'https://www.apiopen.top/satinGodApi?type=1&page=' + page;
        break;
      case '4':
        url = 'https://www.apiopen.top/satinApi?type=1&page=' + page;
        break;
    } 
    console.log(url)
    wx.request({
      url: url,
      method: 'GET',
      success: function (res) { 
        let l = that.data['type' + type]
        for (var i = 0; i < res.data.data.length; i++) {
          l.push(res.data.data[i])
        }
        switch (that.data.currentIndex) {
          case '0':
            that.setData({ type0: l });
            break;
          case '1':
            that.setData({ type1: l });
            break;
          case '2':
            that.setData({ type2: l });
            break;
          case '3':
            that.setData({ type3: l });
            break;
          case '4':
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
