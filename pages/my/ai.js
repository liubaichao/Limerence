const upng = require('../../utils/upng-js/UPNG.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token:'',
    currentIndex:'0',
    result:[],
    canvasW:'100%',
    canvasHL:'400'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
   wx.request({
     url: 'https://aip.baidubce.com/oauth/2.0/token?',
     method: 'GET',
     data:{
       'grant_type': 'client_credentials',
       'client_id': 't7F3VUyVrkjthjY7Ih8wtKBX',
       'client_secret': 'luauWqeOvVtidUmiGAZuKMuVDDdxzV5X'
     },
     success: function (res) {
        console.log("百度", res)
        that.setData({
          access_token: res.data.access_token
        })
     }
   })
  },
  go: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.i
    })
  },
  select: function(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let path = res.tempFilePaths[0]
        wx.showLoading({
          title: '识别中...',
        })
        wx.getImageInfo({
          src: path ,
          success: function (res) {
            let width =res.width
            let height = res.height
            that.setData({
              canvasW: width,
              canvasH: height
            })
            let canvas = wx.createCanvasContext('firstCanvas')
            // 1. 绘制图片至canvas
            canvas.drawImage(path, 0, 0, width, height)
            // 绘制完成后执行回调，API 1.7.0
            canvas.draw(false, () => {
              // 2. 获取图像数据， API 1.9.0
              wx.canvasGetImageData({
                canvasId: 'firstCanvas',
                x: 0,
                y: 0,
                width: width,
                height: height,
                success(res) {
                  // 3. png编码
                  let pngData = upng.encode([res.data.buffer], res.width, res.height)
                  // 4. base64编码
                  let base64 = wx.arrayBufferToBase64(pngData)    
                  let key = ''     
                  switch (that.data.currentIndex){
                    case '0':
                      key = 'ocr/v1/general_basic'
                    break;
                    case '1':
                      key = 'image-classify/v1/plant'
                    break;
                    case '2':
                      key = 'image-classify/v1/animal'
                      break;
                    case '3':
                      key = 'image-classify/v1/car'
                      break;
                    case '4':
                      key = 'image-classify/v2/dish'
                      break;
                  }
                  wx.request({
                    url: 'https://aip.baidubce.com/rest/2.0/'+key+'?access_token=' + that.data.access_token,
                    method: 'POST',
                    header: {
                      'content-Type':'application/x-www-form-urlencoded'
                    },
                    data: {
                      'image': base64
                    },
                    success: function (res) {
                      console.log("shuju", res)
                      let data = ''
                      if (that.data.currentIndex == "0"){
                        data = res.data.words_result
                      }else{
                        data = res.data.result
                      }
                      that.setData({
                        result: data
                      })
                      wx.hideLoading()
                      if (res.data.error_code == '17'){
                        wx.showToast({
                          title: '识别已达今日上限',
                          icon: 'none'
                        })
                      }
                    },
                    fail:function(err){
                      wx.showToast({
                        title: '识别出错请重试',
                        icon: 'none'
                      })
                      console.log("识别失败",err)
                    }
                  })
                }
              })
            })
          }
        })       
      }
    })
  },
  copy: function (e) {
    let arr = []
    let n = this.data.currentIndex
    this.data.result.map((item) => {
      if(n=="0"){
        arr.push(item.words)
      }else{
        arr.push(item.name)
      }   
    })
    wx.setClipboardData({
      data: arr.join(" "),
      success() {
        
      }
    })
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
      title: "传图识字",        // 默认是小程序的名称
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
