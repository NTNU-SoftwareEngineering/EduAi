# Audio Processing Script

這是一個用於音頻處理的 Python 腳本，包含說話人分離和語音轉錄功能。

## 環境設置

1. 安裝 Python 3.10 或以上版本。
2. 創建並激活虛擬環境（可選，但推薦）。

```bash
python -m venv venv
source venv/bin/activate  # 對於 Windows 使用 venv\Scripts\activate
```

3. 安裝所需的 Python 套件。

```bash
pip install -r requirements.txt
```

`requirements.txt` 應包含以下內容：

```plaintext
faster-whisper
pyannote.audio
torch
opencc
numpy
librosa
```

4. 確保 CUDA 和 cuDNN 已正確安裝並配置環境變量。

## 使用方法

1. 將您的 Hugging Face 授權令牌替換腳本中的 `use_auth_token` 變量。(記得要去官網授權pyannote3.1相關model)

```python
use_auth_token = "your_hugging_face_token"
```

2. 將音頻文件放置在腳本所在目錄，並更新 `audio_files` 變量以包含音頻文件名稱。(目前預設input檔案叫1.wav)

```python
audio_files = ["your_audio_file.wav"]
```

3. 執行腳本。

```bash
python main.py
```

4. 結果將顯示在終端，包含每個說話者的轉錄文本和時間戳。

## CODE解析

1. **加載說話人分離模型**：
    - 使用 `pyannote.audio` 的 `Pipeline` 加載說話人分離模型。切割每個人的語音
    - 將模型移動到指定的設備（GPU 或 CPU）。

2. **加載 Faster Whisper 語音識別模型**：
    - 使用 `faster_whisper` 的 `WhisperModel` 加載語音識別模型，執行語音轉文字

3. **初始化 OpenCC**：初始化 OpenCC，用於將簡體中文轉換為繁體中文。

4. **設置采樣率**：設置音頻處理的采樣率為 16000 Hz。

5. **函數定義**：
    - `load_audio`：加載音頻文件並返回音頻數據。
    - `transcribe_audio`：將音頻片段轉錄為文本，並將簡體中文轉換為繁體中文。
    - `merge_segments_with_overlap`：合併相鄰的語音片段。
    - `diarize_and_label`：進行說話人分離並標記每個說話者的文本。

6. **主程序**：
    - 加載音頻文件。
    - 調用 `diarize_and_label` 函數進行說話人分離和轉錄。
    - 輸出結果，包括每個說話者的轉錄文本和時間戳。

## 注意事項

- 確保您的 CUDA 和 cuDNN 安裝正確，並且環境變量已正確配置。
- 如果遇到任何問題，請檢查日誌輸出以獲取詳細錯誤信息。

## 參考

- [Faster Whisper](https://github.com/openai/whisper)
- [pyannote.audio](https://github.com/pyannote/pyannote-audio)
```