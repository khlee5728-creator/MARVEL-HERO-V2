const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://devplayground.polarislabs.ai.kr/api'

const QUESTION_PROMPT = `You are a Marvel universe MBTI quiz creator for elementary school students learning English.
Generate exactly 12 MBTI questions based on Marvel scenarios.
- 3 questions for E/I dimension
- 3 questions for N/S dimension
- 3 questions for F/T dimension
- 3 questions for P/J dimension

Each question must use simple English that elementary students can understand.
Each question has exactly 2 options. The first option corresponds to E, N, F, or P. The second option corresponds to I, S, T, or J.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{"questions":[{"question":"...","options":["...","..."],"dimension":["E","I"]},...]}`

/**
 * OpenAI Chat Completions API 호출
 */
async function chatCompletions(messages, options = {}) {
  const res = await fetch(`${BACKEND_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'gpt-4o',
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
 * MBTI 문항 12개 생성 (E/I, N/S, F/T, P/J 각 3문항)
 * Backend의 /chat/completions를 통해 OpenAI 호출
 */
export async function generateQuestions() {
  const data = await chatCompletions([
    { role: 'system', content: QUESTION_PROMPT },
    { role: 'user', content: 'Generate 12 Marvel MBTI questions for kids.' },
  ], { temperature: 0.9 })

  const content = data.choices?.[0]?.message?.content || ''
  try {
    const parsed = JSON.parse(content)
    if (parsed.questions?.length === 12) return parsed
    throw new Error('Invalid question count')
  } catch {
    throw new Error('Failed to parse AI response')
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
