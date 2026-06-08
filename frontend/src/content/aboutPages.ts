import {
  ABOUT_DEITIES_HERO_IMAGE,
  ABOUT_FOUNDER_HERO_IMAGE,
  ABOUT_ISKCON_HERO_IMAGE,
  ABOUT_SRISAILAM_HERO_IMAGE,
  ABOUT_STORY_IMAGES,
} from '@/content/spiritualMedia'
import { SRISAILAM_HISTORY, RADHA_KRISHNA_HISTORY } from '@/content/spiritualContent'
import type { SpiritualImageDef } from '@/content/spiritualMedia'

export type AboutSectionId = 'iskcon' | 'founder' | 'deities-timetable' | 'srisailam'

export type AboutStorySection = {
  title: string
  paragraphs: string[]
}

export type AboutPageContent = {
  id: AboutSectionId
  title: string
  subtitle: string
  heroImage: SpiritualImageDef
  /** Lighter hero overlay so the photo is easy to see */
  heroProminent?: boolean
  /** Fit the hero image inside the section bounds (no crop overflow) */
  heroContained?: boolean
  /** Optional flowing story (multi-paragraph, separated by blank lines) */
  story?: string
  /** Heading for the story block (default: "Our story") */
  storyHeading?: string
  /** Hide the Sacred glimpses gallery on this page */
  hideGallery?: boolean
  /** Additional story blocks with headings */
  storySections?: AboutStorySection[]
  sections: { heading: string; body: string }[]
  bullets?: string[]
  sloka?: { text: string; meaning: string }
}

export const ABOUT_NAV: { id: AboutSectionId; label: string; path: string }[] = [
  { id: 'iskcon', label: 'About ISKCON', path: '/about/iskcon' },
  { id: 'founder', label: 'ISKCON Founder', path: '/about/founder' },
  { id: 'deities-timetable', label: 'Deities Time Table', path: '/about/deities-timetable' },
  { id: 'srisailam', label: 'Srisailam Temple History', path: '/about/srisailam' },
]

export const ABOUT_PAGES: Record<AboutSectionId, AboutPageContent> = {
  iskcon: {
    id: 'iskcon',
    title: 'About ISKCON',
    subtitle: 'International Society for Krishna Consciousness — spreading the science of bhakti-yoga',
    heroImage: ABOUT_ISKCON_HERO_IMAGE,
    heroContained: true,
    hideGallery: true,
    storyHeading: 'Our story',
    story:
      'The International Society for Krishna Consciousness (ISKCON) was founded in 1966 by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada to spread Krishna consciousness worldwide. Rooted in the Gaudiya Vaishnava tradition of Sri Chaitanya Mahaprabhu, ISKCON presents the timeless wisdom of Bhagavad-gita and Srimad-Bhagavatam in a practical way suited for modern life — through harinam sankirtan, deity worship, prasadam distribution, and education in Vedic culture.\n\nAt ISKCON Srisailam (Hare Krishna Land on the sacred pilgrimage route to Mallikarjuna Swamy), devotees serve pilgrims and families with daily darshan of Sri Sri Jagannath, Baladev, and Subhadra, sanctified food (prasadam), children’s programs, and caring association. The temple is a place where ancient sanctity of Srisailam meets the living tradition of bhakti-yoga taught by Srila Prabhupada.\n\nAmong ISKCON’s founding purposes are to systematically propagate spiritual knowledge, to bring members together in Krishna consciousness, and to publish and distribute books on Vaishnava philosophy. Here you will find sankirtan, deity worship in the mood of service, prasadam for all, and programs that nurture faith, character, and joy in devotional life.',
    sections: [],
    bullets: [
      'Sankirtan — congregational chanting of the holy names',
      'Deity worship — serving the Lord in the mood of devotion',
      'Prasadam — sanctified food offered with love',
      'Education — Vedic culture and values for all ages',
    ],
  },
  founder: {
    id: 'founder',
    title: 'ISKCON Founder — Srila Prabhupada',
    subtitle: 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada (1896–1977)',
    heroImage: ABOUT_FOUNDER_HERO_IMAGE,
    storySections: [
      {
        title: 'The swami who started it all',
        paragraphs: [
          'Within the final twenty years of his life Srila Prabhupada translated over sixty volumes of classic Vedic scriptures (such as the Bhagavad Gita and the Srimad Bhagavatam) into the English language. For their authority, depth, and clarity, his books have won praise from professors at universities like Harvard and Oxford, and his Bhagavad-gita As It Is was published by Macmillan Publishers in 1968 and the unabridged edition in 1972, and is now available in over sixty languages around the world. Other books by Srila Prabhupada are available in over eighty different languages. Over 500 million books of his have been distributed to date.',
          'Srila Prabhupada established The Bhaktivedanta Book Trust (BBT) in 1972 to publish his works. The BBT has also published his multi-volume biography, Srila Prabhupada-Lilamrta, that, according to acclaimed scholar of religion Larry Shinn, will “certainly be one of the most complete records of the life and work of any modern religious figure”.',
          'Srila Prabhupada reminded his devotees before his passing that he would live forever in his books, and through them would remain present as a spiritual master or guru. He had instilled in his followers an understanding of the importance of writing and publishing not only with regard to his works, but also their own initiatives.',
        ],
      },
    ],
    sections: [],
    sloka: {
      text: 'kṛṣṇa-surya-sama-māyā haya andhakāra',
      meaning: 'May the sun of Krishna consciousness dispel the darkness of ignorance — as taught by Srila Prabhupada.',
    },
  },
  'deities-timetable': {
    id: 'deities-timetable',
    title: 'Deities — worship timetable',
    subtitle: 'Daily darshan and arati schedule for Sri Jagannath, Baladev & Subhadra',
    heroImage: ABOUT_DEITIES_HERO_IMAGE,
    heroContained: true,
    hideGallery: true,
    sections: [
      {
        heading: 'Daily worship',
        body: 'The Deities are dressed, offered bhoga, and worshipped throughout the day according to the pancharatrika-vidhi. Darshan is open during the windows below unless a special festival extends or adjusts timings.',
      },
    ],
    bullets: [
      'Suprabhatam & Darshan — 4:30 AM – 8:30 AM',
      'Sringar Darshan — 8:30 AM – 12:00 PM',
      'Raj Bhoga & Darshan — 12:30 PM – 1:00 PM',
      'Utthapana & Darshan — 4:15 PM – 8:30 PM',
      'Mangala Arati — 4:30 AM',
      'Dhoop Arati — 8:00 AM',
      'Sandhya Arati — 6:30 PM',
    ],
  },
  srisailam: {
    id: 'srisailam',
    title: SRISAILAM_HISTORY.title,
    subtitle: SRISAILAM_HISTORY.subtitle,
    heroImage: ABOUT_SRISAILAM_HERO_IMAGE,
    heroContained: true,
    storyHeading: 'Temple history',
    story: [
      SRISAILAM_HISTORY.intro,
      'A Jyotirlinga is a radiant sign of Shiva’s infinite form. Srisailam is celebrated in scriptures as Sri Parvata or Mallikarjuna Kshetra — where the Lord’s grace is said to burn away ignorance like a column of light (jyoti). The temple stands on the Krishna River gorge, surrounded by forested Nallamala hills; pilgrims believe worship here on Shivaratri and during Kartika masam brings special merit.',
      'Royal patronage from the Satavahanas, Chalukyas, Vijayanagara emperors, and later dynasties shaped the present complex. Tradition holds that Goddess Parvati came to Srisailam as Mallika and Lord Shiva as Arjuna — hence Mallikarjuna. The shrine is honoured as both a Jyotirlinga and a Shakti Peetha, appearing in the Mahabharata, Puranas, and hymns of the Nayanars.',
      SRISAILAM_HISTORY.architecture,
      SRISAILAM_HISTORY.spiritualNote,
    ].join('\n\n'),
    sections: [],
    bullets: [
      ...SRISAILAM_HISTORY.festivals.map((f) => `Festival: ${f}`),
      `Heritage: ${SRISAILAM_HISTORY.architecture}`,
    ],
    sloka: SRISAILAM_HISTORY.sloka,
  },
}

/** Gallery images for an About tab — only that tab's images, never mixed with another tab */
export function getAboutGalleryImages(sectionId: AboutSectionId): SpiritualImageDef[] {
  return ABOUT_STORY_IMAGES[sectionId] ?? []
}

/** Radha Krishna content used on main about hub */
export const RADHA_KRISHNA_ABOUT = RADHA_KRISHNA_HISTORY
