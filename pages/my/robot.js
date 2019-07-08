let i=0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [{ text:'Hi~ o(*￣▽￣*)ブ'}],
    currentIndex:0,
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  send:function(e){
    let that = this
    let list = that.data.list
    let val = e.detail.value.text

    list.push({ type: 1, text: val, id: i})
    that.setData({
      list:list,
      currentIndex: i,
      val :''
    })
    i++
    wx.request({
      url: "https://api.qingyunke.com/api.php?key=free&appid=0&msg=" + val,
      method:'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        if (res.data.result == 0){
          list.push({ text: res.data.content ,id: i })
          that.setData({
            list: list,
            currentIndex: i,
            val:''
          })
        } else{
          list.push({ text: '小仙女不舒服，请帮我叫一下开发者，谢谢，亲' })
          that.setData({
            list: list,
            currentIndex: i,
            val: ''
          })
        }
        i++ 
      },
      fail:(err)=>{
        list.push({ text: '小仙女不舒服，请帮我叫一下开发者，谢谢，亲' })
        that.setData({
          list: list,
          currentIndex: i,
          val: ''
        })
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
      title: "萌萌哒小仙女",        // 默认是小程序的名称
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