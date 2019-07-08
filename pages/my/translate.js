const UTIL = require('../../utils/util.js')
var pageSelf = undefined;
var l = 'zh_CN', lo = 'en_US';

var plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt:'切换英文',
    text:'按下录音，松开结束',
    isChina:true,
    long:'zh_CN'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    manager.onRecognize = function (res) {
      console.log("current result", res.result)
    }
    manager.onStop = function (res) {
      // wx.hideLoading()
      // console.log(l, lo)
      // UTIL.translate(res.result, l, lo);

      wx.hideLoading()
      let long = that.data.isChina ? 'zh_CN' : 'en_US';
      let _long = that.data.isChina ? 'en_US' : 'zh_CN';
      l = long; lo = _long;
      UTIL.translate(res.result, long, _long);
    }
    manager.onError = function (res) {
      console.log("error msg", res.msg)
      wx.hideLoading()
      wx.showLoading({
        title: '请重新录音',
      })
      setTimeout(() => { wx.hideLoading() }, 2000)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //手指按下
  touchdown_plugin: function () {
    var _this = this
    UTIL.stopTTS();
    manager.start({ duration: 30000, lang: _this.data.long})
    console.log("开始")
  },
  //手指松开
  touchup_plugin: function () {
    let that = this;
    manager.stop();
    wx.showLoading({
      title: '正在识别...',
    })

    // manager.onStop = (res) => {
    //   wx.hideLoading()
    //   let long = this.data.isChina ? 'zh_CN' : 'en_US';
    //   let _long = that.data.isChina ? 'en_US' : 'zh_CN';
    //   l = long; lo = _long;
    //   UTIL.translate(res.result, long, _long);
    // }
  },
  exchange:function(){
    let isChina = !this.data.isChina;
    this.setData({
      isChina: isChina
    })
    let txt = this.data.isChina ? '切换英文' : 'Switching Chinese';
    let text = this.data.isChina ? '按下录音，松开结束' : 'Press the recording and release the end';
    let long = this.data.isChina ? 'zh_CN' : 'en_US'
    this.setData({
      txt:txt,
      text:text,
      long:long
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
      title: "同声传译",        // 默认是小程序的名称
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