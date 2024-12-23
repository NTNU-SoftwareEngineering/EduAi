from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
from pydub.utils import make_chunks
import os
import speech_recognition as sr
from tempfile import NamedTemporaryFile
import requests
import mysql.connector
from mysql.connector import Error

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

    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    if 'token' not in request.form:
        return jsonify({'error': 'No token file provided'}), 400


    url = 'http://host.docker.internal:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json'

    params = {
        'wstoken': request.form['token'],
        'wsfunction': 'core_webservice_get_site_info',
    }

    try:

        response = requests.post(url, params=params)
        response.raise_for_status()
        
        try:
            data = response.json()
            if 'exception' in data:
                return jsonify({'error': 'Invalid token or insufficient permissions'}), 403

        except requests.exceptions.JSONDecodeError:
            
            return jsonify({'error': 'Invalid JSON response'}), 500

    except requests.exceptions.RequestException as e:
        
        return jsonify({'error': str(e)}), 500

    

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
    
def get_db_connection():
    return mysql.connector.connect(
        host="db",  # 使用在 docker-compose 中定義的 db 服務名稱
        user="moodleuser",  # 使用 moodleuser
        password="yourpassword",  # 使用你的密碼
        database="moodle_db"  # 使用 moodle_db 資料庫
    )

# API 路由
@app.route('/api/lesson_plan', methods=['POST'])
def save_lesson_plan():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO lesson_plans 
            (name, author, target, time, motivation, place, core_value, core_importance, source, facilities, goal) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data["name"], data["author"], data["target"], data["time"], data["motivation"],
            data["place"], data["coreValue"], data["coreImportance"], data["source"], 
            data["facilities"], data["goal"]
        )
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "教案已成功儲存！"}), 200
    except Error as e:
        return jsonify({"message": f"資料儲存失敗: {str(e)}"}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
