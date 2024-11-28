import whisper
from pyannote.audio import Pipeline
import re
import logging
import torch

# Set up logging
logging.basicConfig(level=logging.INFO)

# Check for available GPU
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Initialize Hugging Face access token
use_auth_token = "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"  # Replace with your actual token

# Initialize speaker diarization pipeline and move it to GPU
try:
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=use_auth_token
    )
    pipeline.to(device)  # Move pipeline to GPU
except Exception as e:
    logging.error(f"Error loading models: {e}")
    raise e

# Initialize Whisper speech recognition model
speech_to_text_model = whisper.load_model("small", device=device)

# Function: Transcribe audio segment to text
def transcribe_audio(audio_file, start, end):
    try:
        audio = whisper.load_audio(audio_file)
        # Extract audio segment
        start_samples = int(start * whisper.audio.SAMPLE_RATE)
        end_samples = int(end * whisper.audio.SAMPLE_RATE)
        audio_segment = audio[start_samples:end_samples]

        # Pad or trim the audio segment
        audio_segment = whisper.pad_or_trim(audio_segment)

        # Convert audio to model input format
        mel = whisper.log_mel_spectrogram(audio_segment).to(device)

        # Decode with the model
        options = whisper.DecodingOptions(
            language='zh',
            task='transcribe',
            fp16=torch.cuda.is_available()
        )
        result = whisper.decode(speech_to_text_model, mel, options)

        return result.text
    except Exception as e:
        logging.error(f"Error transcribing audio segment from {start} to {end}: {e}")
        return ""

# Function: Extract name from transcribed text
def extract_name(text):
    match = re.search(r"(我叫|我是)\s*(\S+)", text)
    if match:
        return match.group(2)
    return None

# Function: Perform speaker diarization and label speakers
def diarize_and_label(audio_file):
    global pipeline  # Ensure we're using the global pipeline instance

    # Adjust clustering threshold or specify number of speakers
    pipeline.num_speakers = 1  # Since there's only one speaker

    diarization = pipeline(audio_file)
    known_speakers = {}
    results = []
    min_duration = 0.5

    for segment, _, speaker in diarization.itertracks(yield_label=True):
        start = segment.start
        end = segment.end
        duration = end - start

        if duration >= min_duration:
            try:
                # Transcribe segment
                text = transcribe_audio(audio_file, start, end)
                name = extract_name(text)

                if name and name not in known_speakers:
                    known_speakers[name] = speaker

                identified_speaker = name if name else f"Speaker {speaker}"

                results.append({
                    "start": start,
                    "end": end,
                    "speaker": identified_speaker,
                    "text": text
                })
            except Exception as e:
                logging.error(f"Error processing segment from {start} to {end}: {e}")
        else:
            logging.warning(f"Segment from {start:.2f}s to {end:.2f}s is too short ({duration:.2f}s) and will be skipped.")

    return results

# Main program
if __name__ == "__main__":
    audio_file = "1.wav"  # Ensure the audio file path is correct
    results = diarize_and_label(audio_file)

    # Output results
    for segment in results:
        print(f"From {segment['start']:.1f}s to {segment['end']:.1f}s: {segment['speaker']}")
        print(f"  Text: {segment['text']}")
