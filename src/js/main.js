import canvasGenrator from './canvasGenrator'

export default () => {
  const container = document.createElement('div')
  container.append('Hello Amir Soltanyan!')

  window.addEventListener('load', () => {
    canvasGenrator()
  })

  return container
}
