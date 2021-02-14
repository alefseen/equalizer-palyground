function startParsing(audioElement, requestAnimeFrame, fftSize) {
  let audioContext
  let sourceNode
  let analyserNode
  let javascriptNode
  let audioPlaying = false
  const sampleSize = 1024
  let amplitudeArray

  window.AudioContext = (() =>
    window.webkitAudioContext ||
    window.AudioContext ||
    window.mozAudioContext)()

  function setupAudioNodes() {
    sourceNode = audioContext.createMediaElementSource(audioElement)
    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = fftSize
    javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1)

    amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount)

    sourceNode.connect(audioContext.destination)
    sourceNode.connect(analyserNode)
    analyserNode.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)
  }

  function loadSound() {
    if (sourceNode.mediaElement) {
      sourceNode.mediaElement.onplay = () => {
        audioPlaying = true
      }
      sourceNode.mediaElement.onpause = () => {
        audioPlaying = false
      }
    }
  }

  const start = () => {
    if (!audioContext) {
      try {
        audioContext = new AudioContext()
      } catch (m) {
        // eslint-disable-next-line no-alert
        alert('not support')
      }
    }

    setupAudioNodes()
    javascriptNode.onaudioprocess = () => {
      analyserNode.getByteTimeDomainData(amplitudeArray)
      if (audioPlaying === true) {
        requestAnimeFrame(amplitudeArray)
      }
    }
    loadSound()
  }

  return {
    start,
  }
}

export default startParsing
