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

module.exports = {
  formatTime: formatTime,
  playTTS: playTTS,
  stopTTS: stopTTS,
  translate: translate
}
