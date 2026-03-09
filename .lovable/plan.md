

# Plan: Add Microphone Button + OpenAI Whisper Transcription

## Changes

### 1. Update `src/components/ui/ai-input.tsx`
- Add `Mic` icon button that slides left when there's text (matching the original component design)
- Add recording state: when tapped, start `MediaRecorder` to capture audio via `navigator.mediaDevices.getUserMedia`
- On stop, send the audio blob to a new edge function for transcription
- Show visual recording indicator (pulsing red dot / red mic icon)
- Transcribed text gets inserted into the textarea
- Add `onTranscription` callback and `isRecording` visual state

### 2. Create edge function `supabase/functions/whisper-transcribe/index.ts`
- Accepts audio as `multipart/form-data` (the raw audio blob)
- Calls OpenAI Whisper API (`https://api.openai.com/v1/audio/transcriptions`) with `key_openai` secret
- Model: `whisper-1`
- Returns `{ text: string }` with the transcription
- CORS headers included

### 3. Update `supabase/config.toml`
- Add `[functions.whisper-transcribe]` with `verify_jwt = false`

### 4. Update `src/pages/Chat.tsx`
- No changes needed — `AIInput` handles everything internally via `onSubmit`

## Component Design (matching original)

```text
┌─────────────────────────────────────────────┐
│  [textarea input]              [🎤] [↗]     │
│                                              │
│  - Mic visible when input is empty           │
│  - Mic slides left when typing               │
│  - Send button fades in when typing          │
│  - Mic turns red + pulses when recording     │
└─────────────────────────────────────────────┘
```

## Secret
`key_openai` is already configured in Supabase secrets — will be used for Whisper API calls.

