import { useState } from 'react'
import Intro from '@/pages/Intro'
import Quiz from '@/pages/Quiz'
import Result from '@/pages/Result'
import HeroGallery from '@/pages/HeroGallery'

const FLOW = {
  INTRO: 'intro',
  QUIZ: 'quiz',
  RESULT: 'result',
  GALLERY: 'gallery',
}

function App() {
  const [flow, setFlow] = useState(FLOW.INTRO)
  const [mbtiResult, setMbtiResult] = useState(null)
  const [questions, setQuestions] = useState([])

  const handleStartMission = () => setFlow(FLOW.QUIZ)
  const handleQuizComplete = (mbti, generatedQuestions) => {
    setMbtiResult(mbti)
    setQuestions(generatedQuestions)
    setFlow(FLOW.RESULT)
  }
  const handleNewMission = () => {
    setMbtiResult(null)
    setQuestions([])
    setFlow(FLOW.QUIZ)
  }
  const handleOpenGallery = () => setFlow(FLOW.GALLERY)
  const handleGalleryBack = () => setFlow(FLOW.RESULT)

  if (flow === FLOW.INTRO) return <Intro onStart={handleStartMission} />
  if (flow === FLOW.QUIZ) return <Quiz onComplete={handleQuizComplete} />
  if (flow === FLOW.RESULT)
    return (
      <Result
        mbti={mbtiResult}
        onNewMission={handleNewMission}
        onOpenGallery={handleOpenGallery}
      />
    )
  if (flow === FLOW.GALLERY)
    return <HeroGallery onBack={handleGalleryBack} />

  return null
}

export default App
