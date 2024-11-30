class AudioRecorder extends AudioWorkletProcessor {
    static get parameterDescriptors () { // <1>
      return [
        {
          name: 'isRecording',
          defaultValue: 0,
          minValue: 0,
          maxValue: 1,
        },
      ]
    }
  
    process (inputs, outputs, parameters) {
      const buffer = []
      const channel = 0
  
      for (let t = 0; t < inputs[0][channel].length; t += 1) {
        if (parameters.isRecording[0] === 1) { // <2>
          buffer.push(inputs[0][channel][t])
        }
      }
  
      if (buffer.length >= 1) {
        this.port.postMessage({buffer}) // <3>
      }
  
      return true
    }
  }
  
  registerProcessor('audio-recorder', AudioRecorder) // <4>