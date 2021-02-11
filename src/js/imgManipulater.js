import audioParser from './audioParser'

const ftt = 64
const img = new Image()
img.src = '/assets/cover.jpg'

const canvas = document.getElementById('canvas-img')
const ctx = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500
function drawTimeDomain(amplitudeArray) {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData

  for (let i = 0; i < data.length; i += amplitudeArray.length * 3) {
    for (let j = 0; j < amplitudeArray.length; j += 1) {
      const parsedValue = amplitudeArray[j] - 100

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

const { pause, play } = audioParser('/assets/music.mp3', requestAnimeFrame, ftt)

document.getElementById('start').addEventListener('click', play)
document.getElementById('stop').addEventListener('click', pause)
