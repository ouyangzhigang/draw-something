/* eslint-disable no-unused-vars */
const defaultSetting = {
  direaction: 'horizontal', // horizontal|vertical
  align: 'right', // top|bottom|center|left|right
  space: 0
}

const getSizeOptimizedImg = (canvas, options) => {

}

const base64ImgReg = /^data:image\/(png|jpeg);base64/

class Puzzle {
  constructor (conf) {
    this._config = {...defaultSetting, ...conf}
    this._sources = []
    this.createTargetCanvas()
  }

  createTargetCanvas () {
    this.targetCanvas = document.createElement('canvas')
    this.ctx = this.targetCanvas.getContext('2d')
  }

  add (source, options) {
  /**
   * source可分为三类：img，canvas，base64文件
   *
   */
    // 1. 若为base64图片，使用image包装之后
    alert(1)
    if (typeof source === 'string' && base64ImgReg.test(source)) {
      let img = document.createElement('img')
      let imgWidth
      let imgHeight
      img.src = source
      imgWidth = img.width
      imgHeight = img.height
      console.log(1)
      this._sources.push({
        ref: img,
        width: imgWidth,
        height: imgHeight
      })
    }

    // 2. 使用canvas直接绘制
    if (typeof source === 'object' && source.nodeName.toLowerCase() === 'canvas') {
      // 复制一份canvas，以确保source为同一个canvas时仍能正常使用
      let offlineCanvas = document.createElement('canvas')
      let ctx = offlineCanvas.getContext('2d')
      let canvasWidth = source.width
      let canvasHeight = source.height
      offlineCanvas.width = canvasWidth
      offlineCanvas.height = canvasHeight
      ctx.drawImage(source, 0, 0, canvasWidth, canvasHeight)
      console.log(2)
      this._sources.push({
        ref: offlineCanvas,
        width: canvasWidth,
        height: canvasHeight
      })
    }

    // 使用图片
    if (typeof source === 'object' && source.nodeName.toLowerCase() === 'img') {
      let imgWidth, imgHeight
      console.log(3)
      if (source.complete) {
        imgWidth = source.width
        imgHeight = source.height
        this._sources.push({
          ref: source,
          width: imgWidth,
          height: imgHeight
        })
      } else {
        let promise = new Promise((resolve, reject) => {
          source.onload = function () {
            resolve({
              ref: source,
              width: this.width,
              height: this.height
            })
          }
        })
        this._sources.push(promise)
      }
    }

    console.log('fuck_source', this._sources)
  }

  setCanvasSize () {
    // 根据方向筛选出最大宽度和最大高度
    // 计算总和
    let isHoriz = this._config.direaction === 'horizontal'
    let isVertical = this._config.direaction === 'vertical'
    let space = this._config.space
    let canvasSize = this._sources.reduce((a, b) => {
      let width = isHoriz ? (a.width + b.width + space) : Math.max(a.width, b.width)
      let height = isHoriz ? Math.max(a.height, b.height) : (a.height + b.height + space)
      return {
        width,
        height
      }
    })
    this.targetCanvas.width = canvasSize.width
    this.targetCanvas.height = canvasSize.height
  }

  drawImgInCanvas () {
    let alignType = this._config.align
    let direaction = this._config.direaction
    let width = this.targetCanvas.width
    let height = this.targetCanvas.height
    draw(this._sources, this.ctx, direaction, alignType, this._config.space)
    function draw (soures, context, direaction, align, space) {
      let isHoriz = direaction === 'horizontal'
      soures.reduce((a, b) => {
        if (isHoriz) {
          let top
          if (align === 'top') {
            top = 0
          } else if (align === 'center') {
            top = (height - b.height) / 2
          } else if (align === 'bottom') {
            top = height - b.height
          }
          context.drawImage(b.ref, a.start, top, b.width, b.height)
          return {
            start: a.start + b.width + space
          }
        } else {
          let left
          if (align === 'left') {
            left = 0
          } else if (align === 'center') {
            left = (width - b.width) / 2
          } else if (align === 'right') {
            left = width - b.width
          }
          context.drawImage(b.ref, left, a.start, b.width, b.height)
          return {
            start: a.start + b.height + space
          }
        }
      }, {start: 0})
    }
  }

  /**
   * type{string} jpeg|png|webp
   * encoderOptions{number} 0->1
   * options{object} {minSize:null,maxSize:null}
   */
  toDataUrl (type, encoderOptions, options) {
    let imgType, imgData
    // if (typeof type === 'string') {
    //   if (['png', 'jpeg', 'webp'].includes(type)) {
    //     imgType = 'image/' + type
    //   } else {
    //     // throw Error('type错误,type为png|jpeg|webp之一')
    //   }
    // }
    //
    // if (typeof type === 'object') { // 只传了option
    //   options = type
    // }
    //
    // if (options) {
    //   return getSizeOptimizedImg(this.canvas, type, options)
    // }
    this.setCanvasSize()
    this.drawImgInCanvas()
    imgData = this.targetCanvas.toDataURL()
    this._sources = []
    return imgData
  }
}

export default Puzzle
