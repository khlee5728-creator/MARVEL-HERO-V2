import { getAssetPath } from '@/utils/assetPath'

/**
 * MBTI 16유형별 마블 히어로 매핑
 * image: Gallery용 WebP (PNG fallback), video: Result용 MP4
 *
 * getAssetPath()를 사용하여 배포 경로에 관계없이 올바른 리소스 경로 생성
 */
const HEROES = [
  { mbti: 'INTJ', name: 'Doctor Strange', emoji: '🔮', traits: ['Strategic', 'Intelligent', 'Mystical'], image: getAssetPath('assets/characters/doctor-strange.webp'), video: getAssetPath('assets/characters/doctor-strange.mp4') },
  { mbti: 'INTP', name: 'Iron Man', emoji: '🦾', traits: ['Analytical', 'Innovative', 'Genius'], image: getAssetPath('assets/characters/iron-man.webp'), video: getAssetPath('assets/characters/iron-man.mp4') },
  { mbti: 'ENTJ', name: 'Black Panther', emoji: '🐾', traits: ['Leader', 'Decisive', 'Noble'], image: getAssetPath('assets/characters/black-panther.webp'), video: getAssetPath('assets/characters/black-panther.mp4') },
  { mbti: 'ENTP', name: 'Ant-Man', emoji: '🐜', traits: ['Clever', 'Creative', 'Resourceful'], image: getAssetPath('assets/characters/ant-man.webp'), video: getAssetPath('assets/characters/ant-man.mp4') },
  { mbti: 'INFJ', name: 'Captain America', emoji: '🛡', traits: ['Honorable', 'Idealistic', 'Protective'], image: getAssetPath('assets/characters/captain-america.webp'), video: getAssetPath('assets/characters/captain-america.mp4') },
  { mbti: 'INFP', name: 'Spider-Man', emoji: '🕷', traits: ['Friendly', 'Responsible', 'Caring'], image: getAssetPath('assets/characters/spider-man.webp'), video: getAssetPath('assets/characters/spider-man.mp4') },
  { mbti: 'ENFJ', name: 'Captain Marvel', emoji: '⚡', traits: ['Powerful', 'Protective', 'Determined'], image: getAssetPath('assets/characters/captain-marvel.webp'), video: getAssetPath('assets/characters/captain-marvel.mp4') },
  { mbti: 'ENFP', name: 'Star-Lord', emoji: '🎵', traits: ['Fun', 'Adventurous', 'Loyal'], image: getAssetPath('assets/characters/star-lord.webp'), video: getAssetPath('assets/characters/star-lord.mp4') },
  { mbti: 'ISTJ', name: 'Shuri', emoji: '🔬', traits: ['Reliable', 'Focused', 'Brilliant'], image: getAssetPath('assets/characters/shuri.webp'), video: getAssetPath('assets/characters/shuri.mp4') },
  { mbti: 'ISFJ', name: 'Ms. Marvel', emoji: '✨', traits: ['Loyal', 'Brave', 'Caring'], image: getAssetPath('assets/characters/ms-marvel.webp'), video: getAssetPath('assets/characters/ms-marvel.mp4') },
  { mbti: 'ESTJ', name: 'Wanda', emoji: '🔴', traits: ['Strong-willed', 'Powerful', 'Determined'], image: getAssetPath('assets/characters/wanda.webp'), video: getAssetPath('assets/characters/wanda.mp4') },
  { mbti: 'ESFJ', name: 'Hulk', emoji: '💪', traits: ['Protective', 'Strong', 'Loyal'], image: getAssetPath('assets/characters/hulk.webp'), video: getAssetPath('assets/characters/hulk.mp4') },
  { mbti: 'ISTP', name: 'Black Widow', emoji: '🕷', traits: ['Skilled', 'Calm', 'Resourceful'], image: getAssetPath('assets/characters/black-widow.webp'), video: getAssetPath('assets/characters/black-widow.mp4') },
  { mbti: 'ISFP', name: 'Groot', emoji: '🌳', traits: ['Gentle', 'Loyal', 'Kind'], image: getAssetPath('assets/characters/groot.webp'), video: getAssetPath('assets/characters/groot.mp4') },
  { mbti: 'ESTP', name: 'Rocket', emoji: '🦝', traits: ['Quick', 'Bold', 'Fearless'], image: getAssetPath('assets/characters/rocket.webp'), video: getAssetPath('assets/characters/rocket.mp4') },
  { mbti: 'ESFP', name: 'Thor', emoji: '⚡', traits: ['Brave', 'Friendly', 'Powerful'], image: getAssetPath('assets/characters/thor.webp'), video: getAssetPath('assets/characters/thor.mp4') },
]

export const HEROES_LIST = HEROES

export function getHeroByMbti(mbti) {
  if (!mbti || typeof mbti !== 'string') return HEROES[0]
  const normalized = mbti.toUpperCase().slice(0, 4)
  return HEROES.find((h) => h.mbti === normalized) || HEROES[0]
}

export default HEROES
export { HEROES }
