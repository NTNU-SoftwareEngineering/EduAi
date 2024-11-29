import whisper
from pyannote.audio import Pipeline
import logging
import torch
import opencc  # 將簡體轉換為繁體
import os

# 設置日誌
logging.basicConfig(level=logging.INFO)

# 檢查設備
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"使用設備: {device}")

# 初始化 Hugging Face 授權令牌
use_auth_token = "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"  # 替換為您的令牌

# 加載說話人分離模型
try:
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=use_auth_token
    )
    pipeline.to(device)  # 移動模型到設備
except Exception as e:
    logging.error(f"加載模型時出錯: {e}")
    raise e

# 加載 Whisper 語音識別模型
speech_to_text_model = whisper.load_model("tiny", device=device)

# 初始化 OpenCC（簡體轉繁體）
converter = opencc.OpenCC('s2t.json')

# 函數：將音頻轉錄為文本
def transcribe_audio(audio_data, start, end):
    try:
        start_samples = int(start * whisper.audio.SAMPLE_RATE)
        end_samples = int(end * whisper.audio.SAMPLE_RATE)
        audio_segment = audio_data[start_samples:end_samples]

        audio_segment = whisper.pad_or_trim(audio_segment)
        audio_segment = torch.from_numpy(audio_segment).to(device)
        mel = whisper.log_mel_spectrogram(audio_segment)

        options = whisper.DecodingOptions(
            language='en',
            task='transcribe',
            fp16=torch.cuda.is_available()
        )
        result = whisper.decode(speech_to_text_model, mel, options)
        traditional_text = converter.convert(result.text)

        return traditional_text
    except Exception as e:
        logging.error(f"從 {start} 到 {end} 的音頻片段轉錄時出錯: {e}")
        return ""

# 函數：合併相鄰語音片段
def merge_segments(segments, time_threshold=1.0):
    if not segments:
        return segments

    merged = []
    current = segments[0].copy()

    for next_segment in segments[1:]:
        if (next_segment['speaker'] == current['speaker'] and
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

    # 合併相近片段
    results = merge_segments(results, time_threshold=0.01)
    return results

# 主程式
if __name__ == "__main__":
    audio_files = ["1.wav"]  # 替換為實際音頻文件路徑
    merged_audio_file = audio_files[0]

    audio_data = whisper.load_audio(merged_audio_file)
    results = diarize_and_label(merged_audio_file, audio_data)

    # 輸出結果
    current_speaker = None
    for segment in results:
        if current_speaker != segment['speaker']:
            print(f"\n=== {segment['speaker']} ===")
            current_speaker = segment['speaker']
        print(f"從 {segment['start']:.1f} 秒到 {segment['end']:.1f} 秒:")
        print(f"  內容: {segment['text']}")
