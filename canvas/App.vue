<template>
  <div id="app">
      <canvas id="testCanvas" width="300" height="300"></canvas>
      <div>
        <img :src="combinedImg" alt="">
      </div>
      <div>
        <p><button @click="randomDraw">随机画图</button></p>
        <p><button @click="generateCombinedImg">生成合成图</button></p>
      </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  import Puzzle from './puzzle.js'
  let puzzle = new Puzzle({
    align: 'bottom',
    space: 10
  })
export default {
    name: 'app',
    data () {
      return {
        combinedImg: null,
        canvas: null,
        context: null
      }
    },
    mounted () {
      this.canvas = document.getElementById('testCanvas')
      this.context = this.canvas.getContext('2d')
    },
    methods: {
      randomDraw () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        let colorR = Math.floor(Math.random() * 255)
        let colorG = Math.floor(Math.random() * 255)
        let colorB = Math.floor(Math.random() * 255)
        let color = `rgba(${colorR},${colorG},${colorB},1)`
        this.context.fillStyle = color
        let posX = Math.floor(Math.random() * 100)
        let posY = Math.floor(Math.random() * 100)
        let width = Math.floor(Math.random() * 50 + 50)

        let cvs = document.createElement('canvas')
        let ctx = cvs.getContext('2d')

        this.context.fillRect(0, 0, width, width)
        cvs.width = width
        cvs.height = width
        ctx.fillStyle = color
        ctx.fillRect(0, 0, width, width)
        // 调用puzzle添加
        puzzle.add(cvs)
      },
      generateCombinedImg () {
        this.combinedImg = puzzle.toDataUrl()
      }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

  #testCanvas {
    border:1px solid #2c3e50;
  }
</style>
