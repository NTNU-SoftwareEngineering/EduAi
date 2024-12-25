const wstoken_webservice = localStorage.getItem('token'); // 從 localStorage 獲取 token
let userId = localStorage.getItem('userId'); // 從 localStorage 獲取 userId
// assignmentId 已經在student_discussion.js中處理好了
// const contextId = 17;
// let itemId = -1; 

// 這個部分是原本的程式碼，處理錄音相關的部分(至下方分隔線都是)
// 其他的是處理整個上傳流程的部分跟這個網頁的其他功能(我不知道放哪就全寫在這裡了)
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
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 以下是其餘功能的實作

// 實際上為一套流程: 1. 先創建一個 DraftArea，獲得其itemId // 2. 錄完音後，將音檔上傳至創建好的 Moodle DraftArea // 
//                  3. 觸發語音處理，將音檔轉換成文字 // 4. 將文字上傳至創建好的 Moodle DraftArea // 5. 傳遞逐字稿給 LLM service (尚未完成)
//                  6. 將所有 itemId 上傳至 Moodle 作業區
async function uploadAudio(){
	try{
		// Step 1: 創建草稿區域
		const itemId = await createDraftArea();
		// console.log("創建草稿區域的 item ID: ", itemId);
		
		// Step 2: 上傳錄音檔至 Moodle
		const audioBlob = await fetch(audio.src).then(res => res.blob())
		uploadFileToDraftArea(audioBlob, 'audio.wav', itemId);

		// Step 3: 觸發語音處理
		const sttResult = await triggerSTT();
		console.log("語音轉換成文字的結果: ", sttResult);

		// Step 4: 上傳語音文字至 Moodle
		const transcriptBlob = new Blob([sttResult], { type: 'text/plain' });
		uploadFileToDraftArea(transcriptBlob, 'transcript.txt', itemId);
		
		// Step 5: 傳遞逐字稿給 LLM service
		const llmResult = await fetch("llm", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: sttResult,
			}),
		});
		const llmResultJson = await llmResult.json();
		console.log("LLM服務回應: ", llmResultJson);
		const llmMessage = llmResultJson.choices[0]?.message?.content || 'No response';
		uploadFileToDraftArea(new Blob([llmMessage], { type: 'text/plain' }), 'llm.txt', itemId);

		// Step 6: 上傳所有itemId至Moodle作業區
		uploadFilesToMoodleAssignment(itemId);
	}
	catch(err){
		console.error("處理上傳過程中出現錯誤：", err);
	}
}

// 將音訊編碼為 WAV 格式，並呼叫transcribe API轉換成文字回傳
async function triggerSTT(){
	try {
		const audioBlob = await fetch(audio.src).then(res => res.blob())

		// 使用 FormData 包裝音頻文件
		const formData = new FormData();
		formData.append('audio', audioBlob, 'audio-file.wav');
		formData.append('token' , wstoken_webservice);

		const response = await fetch('https://eduai-transcribe.andy-lu.dev/transcribe', {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`語音辨識失敗，伺服器回應：${errorMessage}`);
        } else {
			const result = await response.json();
			console.log("語音辨識結果：", result);
			return result.transcription;
		}
	}
	catch(err){
		console.error("語音辨識請求失敗：", err);
        throw new Error("無法完成語音辨識，請稍後再試。");
	}
}

// 創建草稿區域，並回傳 item ID
async function createDraftArea() {
    const response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?wstoken=${wstoken_webservice}&wsfunction=core_files_get_unused_draft_itemid&moodlewsrestformat=json`, {
        method: 'POST'
    });
    const result = await response.json();
    if (result.error) {
        throw new Error(`創建草稿區域失敗: ${result.error}`);
    } else {
		// console.log('創建草稿區域成功:', result);
		return result.itemid;
	}
}

// 上傳檔案至草稿區域，並回傳 file ID
async function uploadFileToDraftArea(fileBlob, filename, itemid) {
    const formData = new FormData();
    formData.append('filearea', 'draft');
    formData.append('itemid', itemid);
    formData.append('file', fileBlob, filename);

    const response = await fetch(`${HOSTNAME}/moodle/webservice/upload.php?token=${wstoken_webservice}`, {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (result.error) {
        throw new Error(`上傳文件失敗: ${result.error}`);
    } else {
		// console.log('上傳文件成功:', result);
		return result;
	}
}

// 將itemId陣列中所有檔案上傳至Moodle作業區
async function uploadFilesToMoodleAssignment(itemId){
	const saveSubmissionUrl = `${HOSTNAME}/moodle/webservice/rest/server.php?wstoken=${wstoken_webservice}&wsfunction=mod_assign_save_submission&moodlewsrestformat=json`;
    const saveSubmissionData = new URLSearchParams();

    saveSubmissionData.append('assignmentid', assignmentId);
	saveSubmissionData.append('plugindata[files_filemanager]', itemId);

    const saveResponse = await fetch(saveSubmissionUrl, {
        method: 'POST',
        body: saveSubmissionData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const saveResult = await saveResponse.json();
    if (saveResult.error) {
        throw new Error(`無法更新繳交檔案: ${saveResult.error}`);
    } else {
		// console.log('檔案繳交成功:', saveResult);
		return saveResult;
	}
}
