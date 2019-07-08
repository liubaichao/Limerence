let url = 'http://bms.yjxw.4008978918.com'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    list: [
      {
        "id": 27324,
        "patientId": 40591,
        "presentVisitId": 36022,
        "expresstype": "患者快递",
        "expressserial": "1089219118630",
        "sender": "徐惠娟",
        "emailtype": "EMS",
        "materialcontent": "申请评估表,低收入证明原件,身份证正反面复印件,医学检查报告复印件,购药发票原件",
        "materialcontentremark": null,
        "pharmacyid": null,
        "sendpharmacy": null,
        "status": 0,
        "isdeleted": 0,
        "createtime": 1548595873000,
        "createuserid": 0,
        "updatetime": 1548595873000,
        "updateuserid": 0,
        "isReceived": 0
      },
      {
        "id": 27326,
        "patientId": 40700,
        "presentVisitId": 36202,
        "expresstype": "患者快递",
        "expressserial": "1089219118630",
        "sender": "徐惠娟",
        "emailtype": "EMS",
        "materialcontent": "申请评估表,低收入证明原件,身份证正反面复印件,医学检查报告复印件,购药发票原件",
        "materialcontentremark": null,
        "pharmacyid": null,
        "sendpharmacy": null,
        "status": 0,
        "isdeleted": 0,
        "createtime": 1548595890000,
        "createuserid": 0,
        "updatetime": 1548595890000,
        "updateuserid": 0,
        "isReceived": 0
      },],
    ids:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
  },
  sq:function(){
    let that = this
    
    wx.scanCode({
      success(res) {
        console.log(res)
        that.setData({
          code: res.result
        })
        wx.showLoading({
          title: '处理中...',
          mask: true
        })
        wx.request({
          url: url+'/t/express/getExpressListBySerNo',
           method: 'POST',
          data: { expressSerial: res.result },
          success: function (res) {
            wx.hideLoading()
            console.log(res)
            if (res.data.code == 1000) {
              console.log("333", res)
              that.setData({
                list: res.data.data
              })
            } else {
              toast(res.data.message)
            }
          }
        })
      }
    })
  },
  checkboxChange: function (e) {
    let arr = this.data.ids
    if (e.detail.value.length == 0){
      arr.map(function(item ,i){
        if (item == e.currentTarget.dataset.id){
          arr.splice(i, 1)
        }
      })
      this.setData({
        ids: arr
      })
    }else{
      arr.push(e.detail.value[0])
      arr = Array.from(new Set(arr))
      this.setData({
        ids: arr
      })
    }
    console.log(this.data.ids, arr)
  },
  formSubmit: function (e) {
    console.log(e)
    let that = this
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: '处理中...',
      mask: true
    })
    wx.request({
      url: url + '/t/express/changeIsReceived?ids=' + that.data.ids.join(','),
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == 1000) {
          console.log("666", res)
          toast(res.data.message)
          that.setData({
            code: ''
          })
        } else {
          toast(res.data.message)
        }
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
      title: "sqCode",        // 默认是小程序的名称
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
function toast(res) {
  wx.showToast({
    title: res,
    icon: 'none',
    duration: 1000
  })
}