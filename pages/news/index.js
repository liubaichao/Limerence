//index.js
//获取应用实例
const app = getApp()

let url, page = 1;

Page({
  data: {
    currentIndex:'0',
    typeAll:[],
    dataObj:{},
  },
  onPullDownRefresh(e) {
    console.log("刷新")
    page = 1;
    let keyName = `dataObj.type${this.data.currentIndex}`
    this.setData({[keyName]:[]});
    this.getList(this.data.typeAll[this.data.currentIndex].typeId, this.data.currentIndex)
  },
  onReachBottom(e) {
    console.log("下一页")//swiper 是垂直方向的话，不会触发 onPullDownRefresh
    // this.getList(this.data.typeAll[this.data.currentIndex].typeId, this.data.currentIndex)
  },
  lower(e) {
    console.log("下一页")
    this.getList(this.data.typeAll[this.data.currentIndex].typeId, this.data.currentIndex)
  },
  go(e){
    page = 1
    let i = e.currentTarget.dataset.i
    this.setData({
      currentIndex: i
    })
    if(this.data.dataObj['type' + i]==""){ //点击切换如果等于空就加载数据
      this.getList(this.data.typeAll[i].typeId, i)
    }
  },
  getIndex(e){
    if (e.detail.source == 'touch'){
      page = 1
      let i = e.detail.current
      this.setData({
        currentIndex: i
      })
      if (this.data.dataObj['type' + i] == "") { //滑动切换如果等于空就加载数据
        this.getList(this.data.typeAll[i].typeId, i)
      }
    }
  },
  onLoad() {
    this.getNavList()
  },
  getNavList(){ //动态导航栏
    wx.request({
      url: 'https://www.mxnzp.com/api/news/types',
      method: 'GET',
      header:{
        'app_id':'h3rmpujrsqireuqn',
        'app_secret':'akMzRUF2Qnp2QWRZSk9qQjJnek5KZz09'
      },
      success: (res) => { 
        let obj = {}
        res.data.data.map((item,index)=>{
          obj['type'+index] = []
        })
        this.setData({//动态设置this.data属性
          dataObj:obj,
          typeAll:res.data.data
        }); 
        this.getList(res.data.data[0].typeId,0)
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  playvideo(e){
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
  openImg(e){
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
  getList(type,index){ 
    wx.showNavigationBarLoading()
    wx.request({
      url: `https://www.mxnzp.com/api/news/list?typeId=${type}&page=${page}`,
      method: 'GET',
      header:{
        'app_id':'h3rmpujrsqireuqn',
        'app_secret':'akMzRUF2Qnp2QWRZSk9qQjJnek5KZz09'
      },
      success: (res) => { 
        console.log(type,index,this.data.dataObj)
        let l = this.data.dataObj['type' + index]
        let keyName = `dataObj.type${index}`
        this.setData({[keyName]:[...l,...res.data.data]}); //动态设置this.data属性
        console.log(type,index,this.data.dataObj)
        page++;
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success() {
      }
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage() {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "江畔何人初见月？",        // 默认是小程序的名称
      success: (res) => {
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: (err) => {
        if (err.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (err.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: (res) =>{
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    　　return shareObj
  }
})
