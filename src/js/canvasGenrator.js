import audioParser from './audioParser'

const img = new Image()
img.src = '/assets/cover.jpg'

let ctx
const coverSize = 300
const audioPath = '/assets/viber.mp3'
const barsCountPower = 5
const ftt = 2 ** (barsCountPower + 1)
const scale = 1.5
const maxChangeInFrame = 10
const barWidth = 20
let lastFreq = new Array(2 ** 5).fill(0)

const { sqrt, PI, cos, abs, sign } = Math

const canvasGenrator = () => {
  const canvas = document.getElementById('canvas')
  canvas.height = coverSize * sqrt(2) * scale
  canvas.width = coverSize * sqrt(2) * scale
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
        -coverSize / (2 * cos(startAngle + (angleDuration * i) / array.length))
      const barHeight = minHeight + newValue / 1.5

      ctx.fillStyle = '#F90000'

      const x = (canvas.width - barWidth / 2) / 2
      const y = canvas.height / 2

      ctx.save()

      ctx.translate(x + barWidth / 2, y)
      ctx.rotate(startAngle + (angleDuration * i) / array.length)
      ctx.translate(-x - barWidth / 2, -y)
      ctx.fillRect(x, y, barWidth, barHeight)

      ctx.restore()
    }

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.drawImage(
      img,
      (canvas.width - coverSize) / 2,
      (canvas.height - coverSize) / 2,
      coverSize,
      coverSize
    )
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    ctx.arc(95, 50, 40, 0, 2 * Math.PI)
    const { data } = imageData

    for (let i = 0; i < data.length; i += array.length * 3) {
      for (let j = 0; j < array.length; j += 1) {
        const parsedValue = array[j] - 100

        if (
          data[i + j * 4] > 128 &&
          data[i + 1 + j * 4] < 16 &&
          data[i + 2 + j * 4] < 16
        ) {
          data[i + j * 4] = parsedValue > 255 ? 255 : parsedValue * 5
        }
        // if (
        //   data[i + j * 4] > 215 &&
        //   data[i + 1 + j * 4] > 215 &&
        //   data[i + 2 + j * 4] > 215
        // ) {
        //   data[i + j * 4] = parsedValue > 255 ? 255 : parsedValue * 5
        // }
      }
    }
    ctx.putImageData(imageData, 0, 0)
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

  const { play } = audioParser(audioPath, initAnimationFrame, ftt)

  play()
}

export default canvasGenrator
