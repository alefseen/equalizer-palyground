import audioParser from './audioParser'

const img = new Image()
img.src = '/assets/cover.jpg'

const canvas = document.getElementById('canvas-img')
const ctx = canvas.getContext('2d')

function drawTimeDomain(amplitudeArray) {
  // eslint-disable-next-line no-console
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i += amplitudeArray.length) {
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < amplitudeArray.length; j++) {
      data[i + j] = data[data.length - i + (amplitudeArray[j] - 256)]
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

// eslint-disable-next-line no-unused-vars
const { pause, play } = audioParser('/assets/music.mp3', requestAnimeFrame, 32)

document.getElementById('start').addEventListener('click', play)
document.getElementById('stop').addEventListener('click', pause)
