from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
from pydub.utils import make_chunks
import os
import speech_recognition as sr
from tempfile import NamedTemporaryFile

app = Flask(__name__)
CORS(app)

def split_and_transcribe(audio_path, chunk_length_ms=60000):
    recognizer = sr.Recognizer()
    audio = AudioSegment.from_file(audio_path)
    chunks = make_chunks(audio, chunk_length_ms)
    transcription = []

    for i, chunk in enumerate(chunks):
        with NamedTemporaryFile(delete=True, suffix=".wav") as temp_chunk_file:
            chunk.export(temp_chunk_file.name, format="wav")
            with sr.AudioFile(temp_chunk_file.name) as source:
                audio_data = recognizer.record(source)
                try:
                    text = recognizer.recognize_google(audio_data, language='zh-TW')
                    transcription.append(text)
                except sr.UnknownValueError:
                    transcription.append(f"片段 {i} 無法辨識")
                except sr.RequestError as e:
                    transcription.append(f"片段 {i} API 錯誤: {e}")

    return "\n".join(transcription)

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        file = request.files['audio']
        chunk_length_ms = int(request.form.get('chunk_length_ms', 60000))

        # 將音訊保存為暫存檔案
        with NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
            temp_audio_file.write(file.read())
            temp_audio_file_path = temp_audio_file.name

        # 處理音訊並獲取轉錄結果
        transcription_result = split_and_transcribe(temp_audio_file_path, chunk_length_ms)

        # 刪除暫存檔案
        os.unlink(temp_audio_file_path)

        return jsonify({
            "status": "success",
            "transcription": transcription_result
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"處理失敗: {str(e)}"
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
