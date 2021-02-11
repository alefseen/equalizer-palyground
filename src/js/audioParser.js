function startParsing(audioUrl, requestAnimeFrame, fftSize, onEndAudioPlaying) {
  let audioContext
  let sourceNode
  let analyserNode
  let javascriptNode
  let audioData = null
  let audioPlaying = false
  const sampleSize = 1024
  let amplitudeArray

  window.AudioContext = (() =>
    window.webkitAudioContext ||
    window.AudioContext ||
    window.mozAudioContext)()

  function setupAudioNodes() {
    sourceNode = audioContext.createBufferSource()
    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = fftSize
    javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1)

    amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount)

    sourceNode.connect(audioContext.destination)
    sourceNode.connect(analyserNode)
    analyserNode.connect(javascriptNode)
    javascriptNode.connect(audioContext.destination)
  }

  function playSound(buffer) {
    sourceNode.buffer = buffer
    sourceNode.start(0)
    sourceNode.onended = () => {
      onEndAudioPlaying()
      audioPlaying = false
    }
    sourceNode.loop = false
    audioPlaying = true
  }

  function onError(e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  function loadSound(url) {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    request.onload = () => {
      audioContext.decodeAudioData(
        request.response,
        (buffer) => {
          audioData = buffer
          playSound(audioData)
        },
        onError
      )
    }
    request.send()
  }

  const play = () => {
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
    if (audioData == null) {
      loadSound(audioUrl)
    } else {
      playSound(audioData)
    }
  }

  const pause = () => {
    sourceNode.stop(0)
    audioPlaying = false
  }
  return {
    play,
    pause,
  }
}

export default startParsing
