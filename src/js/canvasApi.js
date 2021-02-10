import audioParser from './audioParser'

function drawTimeDomain(amplitudeArray) {
  // eslint-disable-next-line no-console
  console.log(amplitudeArray)
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
const { pause, play } = audioParser('/assets/viber.mp3', requestAnimeFrame, 32)
