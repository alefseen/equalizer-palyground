import audioParser from './audioParser'

const addImageProcess = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

let ctx
const coverSize = 300
const audioPath = '/assets/viber.mp3'
const coverPath = '/assets/cover.jpg'
const barsCountPower = 5
const ftt = 2 ** (barsCountPower + 1)
const scale = 1.5
const maxChangeInFrame = 5
const barWidth = 20
let lastFreq = new Array(2 ** 5).fill(0)

const { sqrt, PI, cos, abs, sign } = Math

const canvasGenrator = async () => {
  const canvas = document.getElementById('canvas')
  canvas.height = coverSize * sqrt(2) * scale
  canvas.width = coverSize * sqrt(2) * scale

  ctx = canvas.getContext('2d')
  const img = await addImageProcess(coverPath)

  const onEndAudioPlaying = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.drawImage(
      img,
      (canvas.width - coverSize) / 2,
      (canvas.height - coverSize) / 2,
      coverSize,
      coverSize
    )
  }

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
      const barHeight = minHeight + (newValue - 100) / 0.5

      ctx.fillStyle = '#f90000'

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
    const { data } = imageData

    for (let i = 0; i < data.length; i += array.length * 3) {
      for (let j = 0; j < array.length; j += 1) {
        const parsedValue = array[j] - 100

        if (
          data[i + j * 4] > 128 &&
          data[i + 1 + j * 4] < 16 &&
          data[i + 2 + j * 4] < 16
        ) {
          data[i + j * 4] = parsedValue > 255 ? 255 : parsedValue * 10
        }
      }
    }
    ctx.putImageData(imageData, 0, 0)
    lastFreq = [...newFreq]
  }

  const initAnimationFrame = (array, audioPlaying) => {
    const drawer = () => {
      fillCanvas(array, audioPlaying)
    }
    window.RequestAnimationFrame =
      window.requestAnimationFrame(drawer) ||
      window.msRequestAnimationFrame(drawer) ||
      window.mozRequestAnimationFrame(drawer) ||
      window.webkitRequestAnimationFrame(drawer)
  }

  const { play, pause } = audioParser(
    audioPath,
    initAnimationFrame,
    ftt,
    onEndAudioPlaying
  )
  play()
  return {
    play,
    pause,
  }
}

export default canvasGenrator
