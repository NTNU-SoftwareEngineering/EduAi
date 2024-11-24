async function main () {
    try {
      const buttonStart = document.querySelector('#record-start')
      const buttonStop = document.querySelector('#record-stop')
      const audio = document.querySelector('#audio')

      //console.log("DEBUG_RECORDER_FUNCTION")
  
      const stream = await navigator.mediaDevices.getUserMedia({ // <1>
        video: false,
        audio: true,
      })
  
      const [track] = stream.getAudioTracks()
      const settings = track.getSettings() // <2>
  
      const audioContext = new AudioContext() 
      await audioContext.audioWorklet.addModule('audio-recorder.js') // <3>
  
      const mediaStreamSource = audioContext.createMediaStreamSource(stream) // <4>
      const audioRecorder = new AudioWorkletNode(audioContext, 'audio-recorder') // <5>
      const buffers = []
  
      audioRecorder.port.addEventListener('message', event => { // <6>
        buffers.push(event.data.buffer)
      })
      audioRecorder.port.start() // <7>
  
      mediaStreamSource.connect(audioRecorder) // <8>
      audioRecorder.connect(audioContext.destination)
  
      buttonStart.addEventListener('click', event => {
        //console.log("DEBUG_START_RECORDING")
        buttonStart.setAttribute('disabled', 'disabled')
        buttonStop.removeAttribute('disabled')
        buttonStop.style.display = 'flex'
        buttonStart.style.display = 'none'
  
        const parameter = audioRecorder.parameters.get('isRecording')
        parameter.setValueAtTime(1, audioContext.currentTime) // <9>
  
        buffers.splice(0, buffers.length)
      })
  
      buttonStop.addEventListener('click', event => {
        buttonStop.setAttribute('disabled', 'disabled')
        buttonStart.removeAttribute('disabled')
        buttonStop.style.display = 'none'
        buttonStart.style.display = 'flex'
  
        const parameter = audioRecorder.parameters.get('isRecording')
        parameter.setValueAtTime(0, audioContext.currentTime) // <10>
  
        const blob = encodeAudio(buffers, settings) // <11>
        const url = URL.createObjectURL(blob)
  
        audio.src = url
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function DEBUG_main(){
    
      const buttonStart = document.querySelector('#record-start')
      const buttonStop = document.querySelector('#record-stop')
      const audio = document.querySelector('#audio')

      console.log("DEBUG_RECORDER_FUNCTION")
  
      const stream = await navigator.mediaDevices.getUserMedia({ // <1>
        video: false,
        audio: true,
      })
  
      const [track] = stream.getAudioTracks()
      const settings = track.getSettings() // <2>
  
      const audioContext = new AudioContext() 
      await audioContext.audioWorklet.addModule('assets/js/audio-recorder.js') // <3>
  
      const mediaStreamSource = audioContext.createMediaStreamSource(stream) // <4>
      const audioRecorder = new AudioWorkletNode(audioContext, 'audio-recorder') // <5>
      const buffers = []
  
      audioRecorder.port.addEventListener('message', event => { // <6>
        buffers.push(event.data.buffer)
      })
      audioRecorder.port.start() // <7>
  
      mediaStreamSource.connect(audioRecorder) // <8>
      audioRecorder.connect(audioContext.destination)
  
      buttonStart.addEventListener('click', event => {
        console.log("DEBUG_START_RECORDING")
        buttonStart.setAttribute('disabled', 'disabled')
        buttonStop.removeAttribute('disabled')
        buttonStop.style.display = 'flex'
        buttonStart.style.display = 'none'
  
        const parameter = audioRecorder.parameters.get('isRecording')
        parameter.setValueAtTime(1, audioContext.currentTime) // <9>
  
        buffers.splice(0, buffers.length)
      })
  
      buttonStop.addEventListener('click', event => {
        buttonStop.setAttribute('disabled', 'disabled')
        buttonStart.removeAttribute('disabled')
        buttonStop.style.display = 'none'
        buttonStart.style.display = 'flex'
  
        const parameter = audioRecorder.parameters.get('isRecording')
        parameter.setValueAtTime(0, audioContext.currentTime) // <10>
  
        const blob = encodeAudio(buffers, settings) // <11>
        const url = URL.createObjectURL(blob)
  
        audio.src = url
      })
    
  }
  
  DEBUG_main()