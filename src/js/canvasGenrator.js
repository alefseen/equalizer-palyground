let ctx
let canvas
const audioPath = '/assets/music.mp3'

const { sqrt } = Math

const canvasGenrator = () => {
  canvas = document.getElementById('canvas')
  const coverRect = canvas.parentElement.getBoundingClientRect()
  canvas.height = coverRect.height * sqrt(2) * 2
  canvas.width = coverRect.width * sqrt(2) * 2
  ctx = canvas.getContext('2d')
}

export default canvasGenrator
