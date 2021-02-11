import audioParser from './audioParser'

const ftt = 64
const img = new Image()
img.src = '/assets/cover.jpg'

const canvas = document.getElementById('canvas-img')
const ctx = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500
// eslint-disable-next-line no-unused-vars
function drawTimeDomain(amplitudeArray) {
  // eslint-disable-next-line no-console
  console.log(amplitudeArray[4])
  // eslint-disable-next-line no-console
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // eslint-disable-next-line no-console
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData
  // eslint-disable-next-line no-plusplus
  // for (let i = 3; i < data.length; i += amplitudeArray.length * 3) {
  //   for (let j = 0; j < amplitudeArray.length; j += 1) {
  //     data[i + j * 4] = parsedValue > 255 ? 255 : parsedValue
  //   }
  // }
  for (let i = 0; i < data.length; i += amplitudeArray.length * 3) {
    for (let j = 0; j < amplitudeArray.length; j += 1) {
      const parsedValue = amplitudeArray[j] - 100
      // if (
      //   data[i + j * 4] > 225 &&
      //   data[i + 1 + j * 4] > 225 &&
      //   data[i + 2 + j * 4] > 225
      // ) {
      //   data[i + j * 4] = parsedValue * 2
      //   data[i + 1 + j * 4] = parsedValue
      //   data[i + 2 + j * 4] = parsedValue * 3
      // }
      if (
        data[i + j * 4] > 128 &&
        data[i + 1 + j * 4] < 16 &&
        data[i + 2 + j * 4] < 16
      ) {
        data[i + j * 4] = parsedValue > 255 ? 255 : parsedValue * 5
      }
    }
  }
  ctx.putImageData(imageData, 0, 0)
  // const stepper = 1024 / ftt
  // for (let i = 0; i < amplitudeArray.length * stepper; i += 1) {
  //   const value = amplitudeArray[i / stepper]
  //   const y = value - 1
  //   ctx.fillStyle =
  //     'hsla(' + ((amplitudeArray[i] + stepper / i) % 365) + ',100%,50%, 20%)'
  //   const higt = (y * stepper) / ftt

  //   ctx.rotate(((i / stepper) * Math.PI) / 180)
  //   // ctx.translate(canvas.width / 2 - stepper, canvas.height / 2 - stepper)
  //   ctx.fillRect(
  //     canvas.width / 2 - stepper,
  //     canvas.height / 2 - stepper,
  //     stepper,
  //     higt
  //   )
  // }
}

function requestAnimeFrame(obj) {
  const drawer = () => drawTimeDomain(obj)
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(drawer)
  } else if (window.webkitRequestAnimationFrame) {
    window.webkitRequestAnimationFrame(drawer)
  } else if (window.mozRequestAnimationFrame) {
    window.mozRequestAnimationFrame(drawer)
  } else {
    window.setTimeout(drawer, 1000 / 60)
  }
}

// eslint-disable-next-line no-unused-vars
const { pause, play } = audioParser('/assets/music.mp3', requestAnimeFrame, ftt)

document.getElementById('start').addEventListener('click', play)
document.getElementById('stop').addEventListener('click', pause)
