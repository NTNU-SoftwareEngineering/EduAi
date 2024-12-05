import os
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify
from flask_cors import CORS
from faster_whisper import WhisperModel
from pyannote.audio import Pipeline
import logging
import torch
import opencc
import numpy as np
import librosa

# 設置日誌
logging.basicConfig(level=logging.INFO)

# 檢查設備
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"使用設備: {device}")

# 初始化 Hugging Face 授權令牌
use_auth_token = ""  # 替換為您的令牌

# 加載說話人分離模型
try:
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=use_auth_token
    )
    if pipeline is None:
        raise ValueError("模型加載失敗，請檢查您的授權令牌和模型名稱。")
    pipeline.to(torch.device(device))  # 將模型移動到指定設備
except Exception as e:
    logging.error(f"加載模型時出錯: {e}")
    raise e

# 加載 Faster Whisper 語音識別模型
model_size = "medium"
try:
    speech_to_text_model = WhisperModel(model_size, device=device, compute_type="float16")
except Exception as e:
    logging.error(f"加載 Faster Whisper 模型時出錯: {e}")
    raise e

# 初始化 OpenCC（簡體轉繁體）
converter = opencc.OpenCC('s2t')

# 采樣率
SAMPLE_RATE = 16000

# 函數：加載音頻文件
def load_audio(file, sample_rate=SAMPLE_RATE):
    data, sr = librosa.load(file, sr=sample_rate, mono=True)
    return data

# 函數：將音頻轉錄為文本
def transcribe_audio(audio_data, start, end):
    try:
        start_samples = int(start * SAMPLE_RATE)
        end_samples = int(end * SAMPLE_RATE)
        audio_segment = audio_data[start_samples:end_samples]

        # 確保音頻段是 float32 類型
        audio_segment = audio_segment.astype(np.float32)

        # 使用 Faster Whisper 轉錄音頻段
        segments, info = speech_to_text_model.transcribe(
            audio_segment,
            beam_size=5,
            language='zh',
            task='transcribe',
        )

        # 收集轉錄的文本
        text = ''.join([segment.text for segment in segments])

        traditional_text = converter.convert(text)

        return traditional_text
    except Exception as e:
        logging.error(f"從 {start} 到 {end} 的音頻片段轉錄時出錯: {e}")
        return ""

# 函數：合併相鄰的語音片段
def merge_segments_with_overlap(segments, time_threshold=0.5):
    if not segments:
        return segments

    merged = []
    current = segments[0].copy()

    for next_segment in segments[1:]:
        # 檢查是否為同一說話者且沒有時間重疊
        if (next_segment['speaker'] == current['speaker'] and
            current['end'] <= next_segment['start'] and
            next_segment['start'] - current['end'] <= time_threshold):
            current['text'] = current['text'] + ' ' + next_segment['text']
            current['end'] = next_segment['end']
        else:
            merged.append(current)
            current = next_segment.copy()

    merged.append(current)
    return merged

# 函數：說話人分離與標記
def diarize_and_label(audio_file, audio_data):
    global pipeline

    diarization = pipeline(audio_file, num_speakers=None)
    results = []
    speaker_map = {}
    speaker_id = 1
    min_duration = 0.1

    for segment, _, speaker in diarization.itertracks(yield_label=True):
        start = segment.start
        end = segment.end
        duration = end - start

        if duration >= min_duration:
            try:
                text = transcribe_audio(audio_data, start, end)

                # 為說話者分配唯一標籤
                if speaker not in speaker_map:
                    speaker_map[speaker] = f"說話者 {speaker_id}"
                    speaker_id += 1

                results.append({
                    "start": start,
                    "end": end,
                    "speaker": speaker_map[speaker],
                    "text": text.strip()
                })
            except Exception as e:
                logging.error(f"處理片段 {start:.2f}-{end:.2f} 時出錯: {e}")
        else:
            logging.warning(f"片段 {start:.2f}-{end:.2f} 太短（{duration:.2f}秒），已跳過。")

    # 合併重疊的片段
    results = merge_segments_with_overlap(results, time_threshold=0.5)
    return results

app = Flask(__name__)
CORS(app)

@app.route('/api/whisper-transcribe', methods=['POST'])
def whisper_transcribe():
    try:
        # 確認請求中是否包含音頻文件
        if 'audio' not in request.files:
            return jsonify({"error": "未找到音檔"}), 400

        # 獲取上傳的音檔
        audio_file = request.files['audio']

        # 生成安全的文件名並保存到臨時目錄
        temp_dir = "./temp_audio/"
        os.makedirs(temp_dir, exist_ok=True)  # 確保臨時目錄存在
        temp_file_path = os.path.join(temp_dir, secure_filename(audio_file.filename))
        audio_file.save(temp_file_path)
        
        # 移除文件名中的 "./" 前綴
        if temp_file_path.startswith("./"):
            temp_file_path = temp_file_path[2:]
        print(f"音檔已保存到: {temp_file_path}")

        # 加載音檔數據
        audio_data = load_audio(temp_file_path, sample_rate=SAMPLE_RATE)

        # 執行說話人分離與轉錄
        results = diarize_and_label(temp_file_path, audio_data)

        # 移除臨時文件
        os.remove(temp_file_path)

        # 返回處理結果
        return jsonify({"results": results}), 200

    except Exception as e:
        logging.error(f"處理音檔時出錯: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

# 主程序
# if __name__ == "__main__":
#     # audio_files = ["temp_audio/test.wav"]  # 替換為實際音頻文件路徑
#     merged_audio_file = str("temp_audio/test.wav")

#     audio_data = load_audio(merged_audio_file, sample_rate=SAMPLE_RATE)
#     results = diarize_and_label(merged_audio_file, audio_data)

#     # 輸出結果
#     current_speaker = None
#     for segment in results:
#         if current_speaker != segment['speaker']:
#             print(f"\n=== {segment['speaker']} ===")
#             current_speaker = segment['speaker']
#         print(f"從 {segment['start']:.1f} 秒到 {segment['end']:.1f} 秒:")
#         print(f"  內容: {segment['text']}")
