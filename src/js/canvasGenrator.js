import audioParser from './audioParser'

let ctx
let canvas
const audioPath = '/assets/music.mp3'
const barsCountPower = 5
const scale = 1.5
const maxChangeInFrame = 10
const barWidth = 20
let lastFreq = new Array(2 ** 5).fill(0)

const { sqrt, PI, cos, abs, sign } = Math

const canvasGenrator = () => {
  canvas = document.getElementById('canvas')
  const coverRect = canvas.parentElement.getBoundingClientRect()
  canvas.height = coverRect.height * sqrt(2) * scale
  canvas.width = coverRect.width * sqrt(2) * scale
  ctx = canvas.getContext('2d')

  const fillCanvas = (array) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()

    const newFreq = []

    for (let i = 0; i < array.length; i += 1) {
      const newValue =
        abs(array[i] - lastFreq[i]) > maxChangeInFrame
          ? lastFreq[i] + maxChangeInFrame * sign(array[i] - lastFreq[i])
          : array[i]

      newFreq.push(newValue)

      const startAngle = (3 * PI) / 4
      const angleDuration = PI / 2

      const minHeight =
        -coverRect.height /
        (2 * cos(startAngle + (angleDuration * i) / array.length))
      const barHeight = minHeight + newValue / 1.5

      ctx.fillStyle = '#fff'

      const x = (canvas.width - barWidth / 2) / 2
      const y = canvas.height / 2

      ctx.save()

      ctx.translate(x + barWidth / 2, y)
      ctx.rotate(startAngle + (angleDuration * i) / array.length)
      ctx.translate(-x - barWidth / 2, -y)
      ctx.fillRect(x, y, barWidth, barHeight)

      ctx.restore()
    }

    lastFreq = [...newFreq]
  }

  const initAnimationFrame = (array) => {
    const drawer = () => {
      fillCanvas(array)
    }
    window.RequestAnimationFrame =
      window.requestAnimationFrame(drawer) ||
      window.msRequestAnimationFrame(drawer) ||
      window.mozRequestAnimationFrame(drawer) ||
      window.webkitRequestAnimationFrame(drawer)
  }

  const { play } = audioParser(
    audioPath,
    initAnimationFrame,
    2 ** (barsCountPower + 1)
  )

  play()
}

export default canvasGenrator
