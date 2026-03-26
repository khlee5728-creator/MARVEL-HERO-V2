import { getAssetPath } from '@/utils/assetPath'

/**
 * MBTI 16유형별 마블 히어로 매핑
 * image: Gallery용 WebP (PNG fallback), video: Result용 MP4
 *
 * getAssetPath()를 사용하여 배포 경로에 관계없이 올바른 리소스 경로 생성
 */
const HEROES = [
  { mbti: 'INTJ', name: 'Doctor Strange', emoji: '🔮', traits: ['Thoughtful', 'Intelligent', 'Mystical'], description: 'Doctor Strange is thoughtful, intelligent, and mystical. He uses magical powers to protect the entire universe from dangerous threats.', image: getAssetPath('assets/characters/doctor-strange.webp'), video: getAssetPath('assets/characters/doctor-strange.mp4') },
  { mbti: 'INTP', name: 'Iron Man', emoji: '🦾', traits: ['Smart', 'Inventive', 'Brilliant'], description: 'Iron Man is smart, inventive, and brilliant. He builds incredible technology and uses his genius to save the world.', image: getAssetPath('assets/characters/iron-man.webp'), video: getAssetPath('assets/characters/iron-man.mp4') },
  { mbti: 'ENTJ', name: 'Black Panther', emoji: '🐾', traits: ['Wise', 'Confident', 'Noble'], description: 'Black Panther is wise, confident, and noble. He protects his people and leads the nation of Wakanda with great honor.', image: getAssetPath('assets/characters/black-panther.webp'), video: getAssetPath('assets/characters/black-panther.mp4') },
  { mbti: 'ENTP', name: 'Ant-Man', emoji: '🐜', traits: ['Clever', 'Creative', 'Helpful'], description: 'Ant-Man is clever, creative, and helpful. He finds smart solutions to difficult problems using his shrinking powers.', image: getAssetPath('assets/characters/ant-man.webp'), video: getAssetPath('assets/characters/ant-man.mp4') },
  { mbti: 'INFJ', name: 'Captain America', emoji: '🛡', traits: ['Honest', 'Hopeful', 'Protective'], description: 'Captain America is honest, hopeful, and protective. He always fights for justice and protects those who cannot protect themselves.', image: getAssetPath('assets/characters/captain-america.webp'), video: getAssetPath('assets/characters/captain-america.mp4') },
  { mbti: 'INFP', name: 'Spider-Man', emoji: '🕷', traits: ['Friendly', 'Responsible', 'Caring'], description: 'Spider-Man is friendly, responsible, and caring. He helps anyone in trouble and protects his neighborhood from danger.', image: getAssetPath('assets/characters/spider-man.webp'), video: getAssetPath('assets/characters/spider-man.mp4') },
  { mbti: 'ENFJ', name: 'Captain Marvel', emoji: '⚡', traits: ['Powerful', 'Protective', 'Determined'], description: 'Captain Marvel is powerful, protective, and determined. She fights across the galaxy to keep everyone safe from danger.', image: getAssetPath('assets/characters/captain-marvel.webp'), video: getAssetPath('assets/characters/captain-marvel.mp4') },
  { mbti: 'ENFP', name: 'Star-Lord', emoji: '🎵', traits: ['Fun', 'Adventurous', 'Loyal'], description: 'Star-Lord is fun, adventurous, and loyal. He travels through space with his team, the Guardians of the Galaxy.', image: getAssetPath('assets/characters/star-lord.webp'), video: getAssetPath('assets/characters/star-lord.mp4') },
  { mbti: 'ISTJ', name: 'Shuri', emoji: '🔬', traits: ['Reliable', 'Focused', 'Brilliant'], description: 'Shuri is reliable, focused, and brilliant. She creates incredible technology and helps protect Wakanda with her inventions.', image: getAssetPath('assets/characters/shuri.webp'), video: getAssetPath('assets/characters/shuri.mp4') },
  { mbti: 'ISFJ', name: 'Ms. Marvel', emoji: '✨', traits: ['Loyal', 'Brave', 'Caring'], description: 'Ms. Marvel is loyal, brave, and caring. She protects her neighborhood and always helps people in need.', image: getAssetPath('assets/characters/ms-marvel.webp'), video: getAssetPath('assets/characters/ms-marvel.mp4') },
  { mbti: 'ESTJ', name: 'Wanda', emoji: '🔴', traits: ['Strong-willed', 'Powerful', 'Determined'], description: 'Wanda is strong-willed, powerful, and determined. She uses her incredible magic to protect the people she loves most.', image: getAssetPath('assets/characters/wanda.webp'), video: getAssetPath('assets/characters/wanda.mp4') },
  { mbti: 'ESFJ', name: 'Hulk', emoji: '💪', traits: ['Protective', 'Strong', 'Loyal'], description: 'Hulk is protective, strong, and loyal. He uses his incredible strength to protect his friends when they are in danger.', image: getAssetPath('assets/characters/hulk.webp'), video: getAssetPath('assets/characters/hulk.mp4') },
  { mbti: 'ISTP', name: 'Black Widow', emoji: '🕷', traits: ['Skilled', 'Calm', 'Quick-thinking'], description: 'Black Widow is skilled, calm, and quick-thinking. She solves any problem with quick thinking and amazing combat skills.', image: getAssetPath('assets/characters/black-widow.webp'), video: getAssetPath('assets/characters/black-widow.mp4') },
  { mbti: 'ISFP', name: 'Groot', emoji: '🌳', traits: ['Gentle', 'Loyal', 'Kind'], description: 'Groot is gentle, loyal, and kind. He protects his friends with his powers, even though he only says "I am Groot."', image: getAssetPath('assets/characters/groot.webp'), video: getAssetPath('assets/characters/groot.mp4') },
  { mbti: 'ESTP', name: 'Rocket', emoji: '🦝', traits: ['Quick', 'Bold', 'Fearless'], description: 'Rocket is quick, bold, and fearless. He jumps into action without fear and loves building powerful weapons.', image: getAssetPath('assets/characters/rocket.webp'), video: getAssetPath('assets/characters/rocket.mp4') },
  { mbti: 'ESFP', name: 'Thor', emoji: '⚡', traits: ['Brave', 'Friendly', 'Powerful'], description: 'Thor is brave, friendly, and powerful. He brings thunder and lightning to battle and enjoys spending time with his friends.', image: getAssetPath('assets/characters/thor.webp'), video: getAssetPath('assets/characters/thor.mp4') },
]

export const HEROES_LIST = HEROES

export function getHeroByMbti(mbti) {
  if (!mbti || typeof mbti !== 'string') return HEROES[0]
  const normalized = mbti.toUpperCase().slice(0, 4)
  return HEROES.find((h) => h.mbti === normalized) || HEROES[0]
}

export default HEROES
export { HEROES }
