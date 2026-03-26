// ─────────────────────────────────────────────
// JWT 인증 설정 및 헬퍼 함수
// ─────────────────────────────────────────────

// 백엔드 URL 설정 (window.CONFIG 우선, fallback: 환경변수)
const backendUrl = (window.CONFIG && window.CONFIG.apiUrl)
  ? window.CONFIG.apiUrl
  : (import.meta.env.VITE_BACKEND_URL || 'https://devplayground.polarislabs.ai.kr/api-v1');

// 쿠키 읽기 헬퍼
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

// JWT 토큰 가져오기 (쿠키 Primary, localStorage Backup + 동기화)
function getJwtToken() {
  // 1. 쿠키에서 access_token 우선 확인
  let token = getCookie('access_token');

  // 2. 쿠키에 없으면 localStorage.authToken 확인
  if (!token) {
    token = localStorage.getItem('authToken') || '';

    // 3. localStorage에 있었으면 쿠키에 동기화 (15분 만료)
    if (token) {
      document.cookie = `access_token=${token}; path=/; max-age=900; SameSite=Lax`;
    }
  }

  return token;
}

// 401 처리: 토큰 만료 시 Poly AI Playground 로그인 페이지로 이동
function handleUnauthorized() {
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
  window.location.href = 'https://playground.polarislabs.ai.kr/';
}

// ─────────────────────────────────────────────
// 공통 OpenAI API 호출 함수 (JWT 인증 포함)
// ─────────────────────────────────────────────

async function callOpenAIAPI(endpoint, payload) {
  const jwtToken = getJwtToken();
  const url = `${backendUrl}${endpoint}`;

  // 최대 3회 재시도
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        handleUnauthorized();
        return null;
      }

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        // 백엔드 래핑 형식: { code: "200", data: { ... } }
        if ((data.code === '200' || data.code === 200) && data.data) {
          return data.data;
        }
        // 직접 형식: { choices: [...] }
        return data;
      } else {
        // 바이너리 응답 (오디오 TTS 등) → Blob 반환
        return response.blob();
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === 2) throw error;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Backend API call failed after multiple retries.');
}

// ─────────────────────────────────────────────
// MBTI 문항 생성 관련 설정
// ─────────────────────────────────────────────

const DIMENSION_INFO = {
  'E/I': { name: 'Extraversion / Introversion', first: 'E', second: 'I' },
  'N/S': { name: 'Intuition / Sensing', first: 'N', second: 'S' },
  'F/T': { name: 'Feeling / Thinking', first: 'F', second: 'T' },
  'P/J': { name: 'Perceiving / Judging', first: 'P', second: 'J' },
}

function getQuestionPrompt(dimensions) {
  const dimDesc = dimensions.map(d => `- 4 questions for ${d} (${DIMENSION_INFO[d].name})`).join('\n')
  const dimExample = DIMENSION_INFO[dimensions[0]]

  return `You are a Marvel universe MBTI quiz creator for elementary school students (ages 10-13) learning English.

Generate exactly 8 MBTI personality questions set in Marvel scenarios.
${dimDesc}

## Language Requirements
- English level: CEFR A2-B1 (elementary to intermediate). Target 10-13 year old students learning English as a foreign language.
- Use common, everyday vocabulary and simple grammar structures.
- Avoid difficult idioms, phrasal verbs, or advanced vocabulary.
- Both questions and options must be COMPLETE, NATURAL FULL SENTENCES.
- Questions should be situational: "Imagine you are..." or "You are a superhero and..." format.
- Each option must be a COMPLETE FULL SENTENCE (not a word or short phrase).
- Use VARIED and NATURAL sentence starters. Mix different patterns such as:
  "I want to...", "I like to...", "I prefer...", "I feel...", "It is important to...", "I enjoy...", "I usually...", "I believe...", "My first thought is to...", "That sounds exciting!", "Can you explain...?"
- Do NOT repeat the same sentence pattern for every option. Each pair of options should feel like a natural conversation.

## Example Format
Example 1:
- Question: "You are on a mission with the Avengers. How do you prepare for the battle?"
- Option A: "I like to talk with my teammates and make a plan together." (${dimExample.first})
- Option B: "I prefer to find a quiet place and think about the best strategy by myself." (${dimExample.second})

Example 2:
- Question: "Iron Man asks you to try his new invention. What do you say?"
- Option A: "That sounds exciting! Let me try it right now!" (${dimExample.first})
- Option B: "Can you explain how it works first? I want to understand it before I try." (${dimExample.second})

## Diversity Requirements
- Every time you generate questions, create COMPLETELY NEW and UNIQUE scenarios. Never reuse the same situations.
- Use a WIDE VARIETY of Marvel characters: not just Iron Man and Spider-Man, but also Black Panther, Thor, Captain Marvel, Scarlet Witch, Ant-Man, Hulk, Hawkeye, Doctor Strange, Groot, Shuri, Loki, Nick Fury, etc.
- Use DIVERSE scenario types: team missions, training sessions, discovering new powers, helping civilians, choosing equipment, exploring new planets, attending a hero school, designing a secret base, etc.
- Do NOT start every question with the same pattern. Mix "You are...", "Imagine...", "During...", "After...", "Your friend [hero]...", "[Hero] invites you to...", etc.

## Rules
- Each question has exactly 2 options. The first option corresponds to ${dimensions.map(d => DIMENSION_INFO[d].first).join(', ')}. The second option corresponds to ${dimensions.map(d => DIMENSION_INFO[d].second).join(', ')}.
- Make sure questions and answers feel natural and conversational.
- Use fun Marvel characters and scenarios (Avengers missions, saving the city, discovering superpowers, etc.)

## CRITICAL JSON FORMAT RULES
- You MUST return ONLY valid JSON. No extra text, no markdown code blocks, no explanations.
- Use double quotes (") for all strings. Never use single quotes (').
- Ensure every array element has a comma (,) except the last one.
- Do NOT include trailing commas after the last array element.
- Escape special characters in strings: use \\" for quotes, \\n for newlines, \\\\ for backslashes.
- If a question or option contains apostrophes (like "I'm" or "don't"), use them freely - they don't need escaping.
- Test mentally: {"questions":[...]} must be parseable JSON.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{"questions":[{"question":"...","options":["...","..."],"dimension":["${dimExample.first}","${dimExample.second}"]},...]}`
}

/**
 * OpenAI Chat Completions API 호출 (JWT 인증 적용)
 */
async function chatCompletions(messages, options = {}) {
  const payload = {
    model: options.model || 'gpt-4o-mini',
    messages,
    temperature: options.temperature ?? 0.8,
    ...(options.max_tokens && { max_tokens: options.max_tokens }),
  };

  return callOpenAIAPI('/chat/completions', payload);
}

/**
 * MBTI 문항 16개 생성 (E/I, N/S, F/T, P/J 각 4문항)
 * Backend의 /chat/completions를 통해 OpenAI 호출
 * 병렬 처리: 2번의 API 호출을 동시에 실행하여 속도 향상
 */
export async function generateQuestions(retries = 1) {
  try {
    const promptA = getQuestionPrompt(['E/I', 'N/S'])
    const promptB = getQuestionPrompt(['F/T', 'P/J'])

    const [dataA, dataB] = await Promise.all([
      chatCompletions([
        { role: 'system', content: promptA },
        { role: 'user', content: 'Generate 8 Marvel MBTI questions for kids.' },
      ], { temperature: 0.9 }),
      chatCompletions([
        { role: 'system', content: promptB },
        { role: 'user', content: 'Generate 8 Marvel MBTI questions for kids.' },
      ], { temperature: 0.9 }),
    ])

    // 안전한 JSON 파싱 with 상세 에러 로깅
    let questionsA, questionsB

    try {
      const contentA = dataA.choices?.[0]?.message?.content || ''
      if (import.meta.env.DEV) {
        console.log('[AI-A] Response preview:', contentA.substring(0, 200))
      }
      questionsA = JSON.parse(contentA).questions
      if (import.meta.env.DEV) {
        console.log(`[AI-A] ✅ Parsed ${questionsA.length} questions`)
      }
    } catch (parseError) {
      console.error('[AI-A] ❌ JSON Parse Error:', parseError.message)
      console.error('[AI-A] Full response:', dataA.choices?.[0]?.message?.content)
      throw new Error(`Failed to parse AI response A: ${parseError.message}`)
    }

    try {
      const contentB = dataB.choices?.[0]?.message?.content || ''
      if (import.meta.env.DEV) {
        console.log('[AI-B] Response preview:', contentB.substring(0, 200))
      }
      questionsB = JSON.parse(contentB).questions
      if (import.meta.env.DEV) {
        console.log(`[AI-B] ✅ Parsed ${questionsB.length} questions`)
      }
    } catch (parseError) {
      console.error('[AI-B] ❌ JSON Parse Error:', parseError.message)
      console.error('[AI-B] Full response:', dataB.choices?.[0]?.message?.content)
      throw new Error(`Failed to parse AI response B: ${parseError.message}`)
    }

    const all = [...questionsA, ...questionsB]
    if (import.meta.env.DEV) {
      console.log(`[generateQuestions] Total questions: ${all.length}/16`)
    }

    if (all.length === 16) return { questions: all }
    throw new Error(`Invalid question count: got ${all.length}, expected 16`)
  } catch (err) {
    console.error(`[generateQuestions] ❌ Attempt failed. Retries left: ${retries}`)
    console.error(`[generateQuestions] Error:`, err.message)
    if (retries > 0) {
      if (import.meta.env.DEV) {
        console.log('[generateQuestions] 🔄 Retrying question generation...')
      }
      return generateQuestions(retries - 1)
    }
    console.error('[generateQuestions] ❌ All retries exhausted')
    throw new Error(err.message || 'Failed to generate questions')
  }
}

/**
 * 채팅용 OpenAI 호출 (Backend 경유)
 */
export async function sendChatMessage(messages) {
  const data = await chatCompletions(messages)
  return {
    message: data.choices?.[0]?.message?.content || '',
  }
}
