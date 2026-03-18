const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://devplayground.polarislabs.ai.kr/api'

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
- English level: CEFR B1 (intermediate). Use common vocabulary and simple grammar structures.
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

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{"questions":[{"question":"...","options":["...","..."],"dimension":["${dimExample.first}","${dimExample.second}"]},...]}`
}

/**
 * OpenAI Chat Completions API 호출
 */
async function chatCompletions(messages, options = {}) {
  const res = await fetch(`${BACKEND_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'gpt-4o-mini',
      messages,
      temperature: options.temperature ?? 0.8,
      ...(options.max_tokens && { max_tokens: options.max_tokens }),
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `API error ${res.status}`)
  }
  return res.json()
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

    const questionsA = JSON.parse(dataA.choices?.[0]?.message?.content || '').questions
    const questionsB = JSON.parse(dataB.choices?.[0]?.message?.content || '').questions
    const all = [...questionsA, ...questionsB]
    if (all.length === 16) return { questions: all }
    throw new Error('Invalid question count')
  } catch (err) {
    if (retries > 0) return generateQuestions(retries - 1)
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
