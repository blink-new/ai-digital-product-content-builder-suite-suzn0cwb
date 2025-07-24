// Humanizer utility to make AI-generated content look more natural and human-written

export interface HumanizerOptions {
  addPersonalTouch?: boolean
  addTypos?: boolean
  addContractions?: boolean
  addFillerWords?: boolean
  addEmotions?: boolean
  addPersonalExperiences?: boolean
  addCasualLanguage?: boolean
}

// Personal touches and experiences
const personalTouches = [
  "In my experience,",
  "I've found that",
  "From what I've seen,",
  "Based on my observations,",
  "I've noticed that",
  "In my opinion,",
  "I believe",
  "I think",
  "It seems to me that",
  "I've learned that"
]

const personalExperiences = [
  "I remember when I first",
  "A few years ago, I",
  "I used to struggle with",
  "When I started out,",
  "I've been doing this for years, and",
  "Back in the day,",
  "I once had a client who",
  "I'll never forget when",
  "One time, I",
  "I've made this mistake before:"
]

// Contractions to make text more conversational
const contractions = {
  "do not": "don't",
  "does not": "doesn't",
  "did not": "didn't",
  "will not": "won't",
  "would not": "wouldn't",
  "could not": "couldn't",
  "should not": "shouldn't",
  "cannot": "can't",
  "is not": "isn't",
  "are not": "aren't",
  "was not": "wasn't",
  "were not": "weren't",
  "have not": "haven't",
  "has not": "hasn't",
  "had not": "hadn't",
  "I am": "I'm",
  "you are": "you're",
  "he is": "he's",
  "she is": "she's",
  "it is": "it's",
  "we are": "we're",
  "they are": "they're",
  "I have": "I've",
  "you have": "you've",
  "we have": "we've",
  "they have": "they've",
  "I will": "I'll",
  "you will": "you'll",
  "he will": "he'll",
  "she will": "she'll",
  "we will": "we'll",
  "they will": "they'll"
}

// Filler words and casual expressions
const fillerWords = [
  "actually",
  "basically",
  "honestly",
  "literally",
  "obviously",
  "seriously",
  "definitely",
  "probably",
  "maybe",
  "perhaps",
  "sort of",
  "kind of",
  "you know",
  "I mean",
  "like",
  "well",
  "so",
  "anyway",
  "by the way"
]

// Emotional expressions
const emotions = [
  "I'm excited about",
  "I love how",
  "I'm passionate about",
  "It's frustrating when",
  "I'm amazed by",
  "I'm curious about",
  "I'm worried that",
  "I'm confident that",
  "I'm surprised by",
  "I'm grateful for"
]

// Casual language replacements
const casualReplacements = {
  "utilize": "use",
  "commence": "start",
  "terminate": "end",
  "facilitate": "help",
  "demonstrate": "show",
  "implement": "do",
  "optimize": "improve",
  "prioritize": "focus on",
  "strategize": "plan",
  "conceptualize": "think about",
  "furthermore": "also",
  "therefore": "so",
  "however": "but",
  "nevertheless": "still",
  "consequently": "as a result",
  "subsequently": "then",
  "additionally": "plus",
  "alternatively": "or",
  "specifically": "exactly",
  "particularly": "especially"
}

// Common typos and informal spellings (use sparingly)
const informalSpellings = {
  "alright": "alright", // instead of "all right"
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "got to",
  "kinda": "kind of",
  "sorta": "sort of",
  "dunno": "don't know",
  "yeah": "yes",
  "nope": "no",
  "yep": "yes"
}

export const humanizeText = (text: string, options: HumanizerOptions = {}): string => {
  let humanizedText = text

  // Add contractions
  if (options.addContractions !== false) {
    Object.entries(contractions).forEach(([formal, casual]) => {
      const regex = new RegExp(`\\b${formal}\\b`, 'gi')
      humanizedText = humanizedText.replace(regex, casual)
    })
  }

  // Replace formal language with casual alternatives
  if (options.addCasualLanguage !== false) {
    Object.entries(casualReplacements).forEach(([formal, casual]) => {
      const regex = new RegExp(`\\b${formal}\\b`, 'gi')
      humanizedText = humanizedText.replace(regex, casual)
    })
  }

  // Add personal touches at the beginning of sentences
  if (options.addPersonalTouch) {
    const sentences = humanizedText.split('. ')
    const modifiedSentences = sentences.map((sentence, index) => {
      if (index < 3 && Math.random() < 0.3) { // 30% chance for first 3 sentences
        const personalTouch = personalTouches[Math.floor(Math.random() * personalTouches.length)]
        return `${personalTouch} ${sentence.toLowerCase()}`
      }
      return sentence
    })
    humanizedText = modifiedSentences.join('. ')
  }

  // Add personal experiences
  if (options.addPersonalExperiences) {
    const paragraphs = humanizedText.split('\n\n')
    const modifiedParagraphs = paragraphs.map((paragraph, index) => {
      if (index > 0 && Math.random() < 0.2) { // 20% chance for paragraphs after the first
        const experience = personalExperiences[Math.floor(Math.random() * personalExperiences.length)]
        return `${experience} ${paragraph.toLowerCase()}`
      }
      return paragraph
    })
    humanizedText = modifiedParagraphs.join('\n\n')
  }

  // Add filler words occasionally
  if (options.addFillerWords) {
    const sentences = humanizedText.split('. ')
    const modifiedSentences = sentences.map(sentence => {
      if (Math.random() < 0.15) { // 15% chance
        const filler = fillerWords[Math.floor(Math.random() * fillerWords.length)]
        const words = sentence.split(' ')
        const insertPosition = Math.floor(Math.random() * (words.length - 1)) + 1
        words.splice(insertPosition, 0, filler + ',')
        return words.join(' ')
      }
      return sentence
    })
    humanizedText = modifiedSentences.join('. ')
  }

  // Add emotional expressions
  if (options.addEmotions) {
    const sentences = humanizedText.split('. ')
    const modifiedSentences = sentences.map((sentence, index) => {
      if (index > 1 && Math.random() < 0.1) { // 10% chance after first 2 sentences
        const emotion = emotions[Math.floor(Math.random() * emotions.length)]
        return `${emotion} ${sentence.toLowerCase()}`
      }
      return sentence
    })
    humanizedText = modifiedSentences.join('. ')
  }

  // Add some informal spellings (very sparingly)
  if (options.addTypos) {
    Object.entries(informalSpellings).forEach(([informal, formal]) => {
      if (Math.random() < 0.05) { // 5% chance
        const regex = new RegExp(`\\b${formal}\\b`, 'gi')
        humanizedText = humanizedText.replace(regex, informal)
      }
    })
  }

  return humanizedText
}

// Preset humanization profiles
export const humanizationProfiles = {
  subtle: {
    addPersonalTouch: false,
    addTypos: false,
    addContractions: true,
    addFillerWords: false,
    addEmotions: false,
    addPersonalExperiences: false,
    addCasualLanguage: true
  },
  moderate: {
    addPersonalTouch: true,
    addTypos: false,
    addContractions: true,
    addFillerWords: true,
    addEmotions: false,
    addPersonalExperiences: false,
    addCasualLanguage: true
  },
  heavy: {
    addPersonalTouch: true,
    addTypos: true,
    addContractions: true,
    addFillerWords: true,
    addEmotions: true,
    addPersonalExperiences: true,
    addCasualLanguage: true
  },
  professional: {
    addPersonalTouch: true,
    addTypos: false,
    addContractions: false,
    addFillerWords: false,
    addEmotions: false,
    addPersonalExperiences: true,
    addCasualLanguage: false
  },
  casual: {
    addPersonalTouch: true,
    addTypos: true,
    addContractions: true,
    addFillerWords: true,
    addEmotions: true,
    addPersonalExperiences: true,
    addCasualLanguage: true
  }
}

// Quick humanize function with preset profiles
export const quickHumanize = (text: string, profile: keyof typeof humanizationProfiles = 'moderate'): string => {
  return humanizeText(text, humanizationProfiles[profile])
}