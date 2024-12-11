const wstoken_webservice = localStorage.getItem('token'); // 從 localStorage 獲取 token
const courseId = 2; // 替換成實際的課程 ID
const assignmentId = 1; // 替換成實際的作業 ID
const userId = 2; // 替換成實際的學生 ID (現在的是joe)
const contextId = 17; // 對應課程 "test" 的作業 "Upload music file" ID
let itemId = 0; // 暫時的 itemId，之後要改成實際的

async function main () {
    try {
		const buttonStart = document.querySelector("body > div > div > div > div.send-message > button.mic-button")
		const buttonStop = document.querySelector("body > div > div > div > div.send-message > button.mic-stop-button")
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
		document.querySelector("#message").style.display = "none"
		audio.style.display = "block"

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

	const buttonStart = document.querySelector("body > div > div > div > div.send-message > button.mic-button")
	const buttonStop = document.querySelector("body > div > div > div > div.send-message > button.mic-stop-button")
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
	buttonStop.style.display = 'none'
	buttonStart.style.display = 'flex'
	document.querySelector("#message").style.display = "none"
	audio.style.display = "block"
	document.querySelector("body > div > div > div > div.botton-tip").style.display = "none"
	document.querySelector("body > div > div > div > div.record_send_label").style.display = "flex"
	const parameter = audioRecorder.parameters.get('isRecording')
	parameter.setValueAtTime(0, audioContext.currentTime) // <10>
	document.querySelector("body > div > div > div > div.send-message > button").style.backgroundImage = "url('./assets/images/student_discussion/student_discussion_mic-icon.svg')";

	const blob = encodeAudio(buffers, settings) // <11>
	const url = URL.createObjectURL(blob)

	audio.src = url
	})
    
}
  
DEBUG_main()

function deleteTempAudio(){
	const buttonStart = document.querySelector("body > div > div > div > div.send-message > button.mic-button")
	const buttonStop = document.querySelector("body > div > div > div > div.send-message > button.mic-stop-button")
	const audio = document.querySelector('#audio')

	audio.style.display = "none"
	buttonStart.removeAttribute("disabled")
	buttonStop.setAttribute('disabled', 'disabled')	

	buttonStop.style.display = "none"
	buttonStart.style.display = "block"

	document.querySelector("body > div > div > div > div.record_send_label").style.display = "none"

	document.querySelector("body > div > div > div > div.send-message > button").style.backgroundImage = "url('./assets/images/student_discussion/student_discussion_mic-icon2.svg')";
}

// 實際上為一套流程: 錄完音後，將音檔上傳至 Moodle 作業區，並呼叫 STT API 轉換成文字，並同時再次上傳至 Moodle 作業區，最後傳遞逐字稿給LLM service
async function uploadAudio(){
	try{
		// Step 1: 上傳錄音檔至 Moodle
		const uploadResult = await uploadAudioToMoodle();
		console.log("上傳音檔至 Moodle 的結果：", uploadResult);

		// Step 2: 觸發語音處理
		const sttResult = await triggerSTT();
		console.log("語音轉換成文字的結果: ", sttResult);

		// Step 3: 上傳語音文字至 Moodle
		
		// Step 4: 傳遞逐字稿給 LLM service
	}
	catch(err){
		console.error("處理上傳過程中出現錯誤：", error)
	}
}

// 上傳音檔至 Moodle  //step 1
async function uploadAudioToMoodle(){
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
		// console.error('檔案儲存製作業區失敗: ', saveResult.error);
		return saveResult.error;
	} else {
		// console.log('檔案儲存製作業區成功:', saveResult);
		return saveResult;
	}
}

// 將音訊編碼為 WAV 格式，並呼叫transcribe API轉換成文字回傳 //step 2
async function triggerSTT(){
	try {
		const audioBlob = await fetch(audio.src).then(res => res.blob())

		// 使用 FormData 包裝音頻文件
		const formData = new FormData();
		formData.append('audio', audioBlob, 'audio-file.wav');

		const response = await fetch('http://localhost:5001/transcribe', {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`語音辨識失敗，伺服器回應：${errorMessage}`);
        }
		return await response.json(); // 返回轉換的逐字稿
	}
	catch(err){
		console.error("語音辨識請求失敗：", error);
        throw new Error("無法完成語音辨識，請稍後再試。");
	}
}
