const UTIL = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide:true,
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){          
      let newsId = options.newsId
      this.getDetail(newsId)
    } 
  },
  getDetail(newsId){
    wx.request({
      url: 'https://www.mxnzp.com/api/news/details?newsId='+newsId,
      method: 'GET',
      header:{
        'app_id':'h3rmpujrsqireuqn',
        'app_secret':'akMzRUF2Qnp2QWRZSk9qQjJnek5KZz09'
      },
      success: (res) => { 
        if(res.data.code){
          this.setData({
            detail:res.data.data
          }); 
        }else{
          this.setData({
            isHide:false
          }); 
        }       
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  no:function(e){
    console.log(e.detail)
    console.log(e.detail.errMsg)
    this.setData({
      isHide:false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  /**
      * 用户点击右上角分享
      */
  onShareAppMessage: function () {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "你的好友邀请你来看",        // 默认是小程序的名称
      path: '/pages/index/detail?data=' + JSON.stringify(that.data.list),
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log('/pages/index/detail?data=' + JSON.stringify(that.data.list)+"66666666"+res)
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