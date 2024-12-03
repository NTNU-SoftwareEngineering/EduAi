const wstoken_webservice = localStorage.getItem('token'); // 從 localStorage 獲取 token
const courseId = 2; // 替換成實際的課程 ID
const assignmentId = 1; // 替換成實際的作業 ID
const userId = 2; // 替換成實際的學生 ID (現在的是joe)
const contextId = 17; // 對應課程 "test" 的作業 "Upload music file" ID
let itemId = 0; // 暫時的 itemId，之後要改成實際的

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


async function uploadAudio(){
	// 先上傳音檔至 draft
    const audioBlob = await fetch(audio.src).then(res => res.blob())
    
	const uploadUrl = `http://localhost:8080/moodle/webservice/upload.php?token=${wstoken_webservice}`;
    
	const formData = new FormData();
	formData.append('filearea', 'draft');
	formData.append('file', audioBlob, 'audio.wav');

	const response = await fetch(uploadUrl, {
		method: 'POST',
		body: formData
	});

	const result = await response.json(); // result of uploading audio to draft
	if (result.error) {
		console.error('Upload failed:', result.error);
	} else {
		console.log('Draft item ID:', result[0].itemid);
	}

	// 再將 draft 中的音檔上傳至作業
	const saveSubmissionUrl = `http://localhost:8080/moodle/webservice/rest/server.php?wstoken=${wstoken_webservice}&wsfunction=mod_assign_save_submission&moodlewsrestformat=json`;
	const saveSubmissionData = new URLSearchParams();
	saveSubmissionData.append('assignmentid', assignmentId);
	saveSubmissionData.append('plugindata[files_filemanager]', result[0].itemid);

	const saveResponse = await fetch(saveSubmissionUrl, {
		method: 'POST',
		body: saveSubmissionData,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	const saveResult = await saveResponse.json();
	if (saveResult.error) {
		console.error('檔案儲存製作業區失敗: ', saveResult.error);
	} else {
		console.log('檔案儲存製作業區成功:', saveResult);
	}
}

async function triggerSTT(){
	
	const audioBlob = await fetch(audio.src).then(res => res.blob())

	// 使用 FormData 包裝音頻文件
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio-file.wav');

	const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error("語音辨識失敗");
    return await response.json(); // 返回轉換的逐字稿
}
