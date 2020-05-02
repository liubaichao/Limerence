// 时间 start
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间 end
// 翻译 start
var plugin = requirePlugin("WechatSI")

var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onError((res) => {
  // 播放音频失败的回调
})

function playTTS(text,long) {
  //need to add WXAPP plug-in unit: WechatSI
  plugin.textToSpeech({
    lang: long,
    tts: true,
    content: text,
    success: function (res) {
      console.log("succ tts", res.filename)
      innerAudioContext.src = res.filename;
      innerAudioContext.play()
    },
    fail: function (res) {
      console.log("fail tts", res)
    }
  })
}

const translate = (text, long, _long)=>{
  plugin.translate({
    lfrom: long,
    lto: _long,
    tts:true,
    content: text,
    success: function (res) {
      if (res.retcode == 0) {
        console.log("result", res)
        innerAudioContext.src = res.filename;
        innerAudioContext.play()
      } else {
        console.warn("翻译失败", res)
      }
    },
    fail: function (res) {
      console.log("网络失败", res)
    }
  })
}

function stopTTS() {
  innerAudioContext.stop();
}
// 翻译 end

// 长按保存图片 start
// 使用：bindlongpress="saveImage" data-url="{{item.imageUrl}}"
// 示例：<image bindlongpress="saveImage" data-url="{{item.imageUrl}}" src='{{item.imageUrl}}' lazy-load='{{true}}' mode="widthFix"></image>
// 长按保存功能--授权部分
const saveImage=(e)=>{
  wx.showActionSheet({
    itemList: ['保存到相册'],
    success:(res)=>{
      let url = e.currentTarget.dataset.url;
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                // 同意授权
                saveImgInner(url);
              },
              fail: (res) => {
                console.log(res);
                wx.showModal({
                  title: '保存失败',
                  content: '请开启访问手机相册权限',
                  success(res) {
                      wx.openSetting()
                  }
                })
              }
            })
          } else {
            // 已经授权了
            saveImgInner(url);
          }
        },
        fail: (res) => { console.log(res); }
      })   
    },
    fail:(res)=>{ console.log(res.errMsg) }
  })
}
// 长按保存功能--保存部分
const saveImgInner=(url)=>{
  wx.getImageInfo({
    src: url,
    success: (res) => {
      let path = res.path;
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
            console.log(res);
            wx.showToast({
                title: '已保存到相册',
            })
        },
        fail: (res) => { console.log(res); }
      })
    },
    fail: (res) => { console.log(res); }
  })
}
// 长按保存图片 end
module.exports = {
  saveImage:saveImage,
  formatTime: formatTime,
  playTTS: playTTS,
  stopTTS: stopTTS,
  translate: translate
}
