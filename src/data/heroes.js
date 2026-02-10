/**
 * MBTI 16유형별 마블 히어로 매핑
 * image: Gallery용 PNG, video: Result용 MP4
 */
const HEROES = [
  { mbti: 'INTJ', name: 'Doctor Strange', emoji: '🔮', traits: ['Strategic', 'Intelligent', 'Mystical'], image: '/assets/characters/doctor-strange.png', video: '/assets/characters/doctor-strange.mp4' },
  { mbti: 'INTP', name: 'Iron Man', emoji: '🦾', traits: ['Analytical', 'Innovative', 'Genius'], image: '/assets/characters/iron-man.png', video: '/assets/characters/iron-man.mp4' },
  { mbti: 'ENTJ', name: 'Black Panther', emoji: '🐾', traits: ['Leader', 'Decisive', 'Noble'], image: '/assets/characters/black-panther.png', video: '/assets/characters/black-panther.mp4' },
  { mbti: 'ENTP', name: 'Ant-Man', emoji: '🐜', traits: ['Clever', 'Creative', 'Resourceful'], image: '/assets/characters/ant-man.png', video: '/assets/characters/ant-man.mp4' },
  { mbti: 'INFJ', name: 'Captain America', emoji: '🛡', traits: ['Honorable', 'Idealistic', 'Protective'], image: '/assets/characters/captain-america.png', video: '/assets/characters/captain-america.mp4' },
  { mbti: 'INFP', name: 'Spider-Man', emoji: '🕷', traits: ['Friendly', 'Responsible', 'Caring'], image: '/assets/characters/spider-man.png', video: '/assets/characters/spider-man.mp4' },
  { mbti: 'ENFJ', name: 'Captain Marvel', emoji: '⚡', traits: ['Powerful', 'Protective', 'Determined'], image: '/assets/characters/captain-marvel.png', video: '/assets/characters/captain-marvel.mp4' },
  { mbti: 'ENFP', name: 'Star-Lord', emoji: '🎵', traits: ['Fun', 'Adventurous', 'Loyal'], image: '/assets/characters/star-lord.png', video: '/assets/characters/star-lord.mp4' },
  { mbti: 'ISTJ', name: 'Shuri', emoji: '🔬', traits: ['Reliable', 'Focused', 'Brilliant'], image: '/assets/characters/shuri.png', video: '/assets/characters/shuri.mp4' },
  { mbti: 'ISFJ', name: 'Ms. Marvel', emoji: '✨', traits: ['Loyal', 'Brave', 'Caring'], image: '/assets/characters/ms-marvel.png', video: '/assets/characters/ms-marvel.mp4' },
  { mbti: 'ESTJ', name: 'Wanda', emoji: '🔴', traits: ['Strong-willed', 'Powerful', 'Determined'], image: '/assets/characters/wanda.png', video: '/assets/characters/wanda.mp4' },
  { mbti: 'ESFJ', name: 'Hulk', emoji: '💪', traits: ['Protective', 'Strong', 'Loyal'], image: '/assets/characters/hulk.png', video: '/assets/characters/hulk.mp4' },
  { mbti: 'ISTP', name: 'Black Widow', emoji: '🕷', traits: ['Skilled', 'Calm', 'Resourceful'], image: '/assets/characters/black-widow.png', video: '/assets/characters/black-widow.mp4' },
  { mbti: 'ISFP', name: 'Groot', emoji: '🌳', traits: ['Gentle', 'Loyal', 'Kind'], image: '/assets/characters/groot.png', video: '/assets/characters/groot.mp4' },
  { mbti: 'ESTP', name: 'Rocket', emoji: '🦝', traits: ['Quick', 'Bold', 'Fearless'], image: '/assets/characters/rocket.png', video: '/assets/characters/rocket.mp4' },
  { mbti: 'ESFP', name: 'Thor', emoji: '⚡', traits: ['Brave', 'Friendly', 'Powerful'], image: '/assets/characters/thor.png', video: '/assets/characters/thor.mp4' },
]

export const HEROES_LIST = HEROES

export function getHeroByMbti(mbti) {
  if (!mbti || typeof mbti !== 'string') return HEROES[0]
  const normalized = mbti.toUpperCase().slice(0, 4)
  return HEROES.find((h) => h.mbti === normalized) || HEROES[0]
}

export default HEROES
export { HEROES }
