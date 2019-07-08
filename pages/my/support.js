//logs.js
const util = require('../../utils/util.js')

Page({
  data: {   
  
  },
  onLoad: function () {
 
  },
  save: function (e) {
    wx.getImageInfo({
      src: e.currentTarget.dataset.src,
      success: function (ret) {
        var path = ret.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            console.log(result)
          }
        })
      }
    })
  }, 
  onPullDownRefresh: function () {
    console.log("刷新")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载")
  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "赏你个炸弹",        // 默认是小程序的名称
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
