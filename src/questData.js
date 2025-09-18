// QuestData for the holistic learning quest
//
// This file defines the ten core activities for the Learning Quest on Indigenous
// Cultures.  Each entry includes an identifier, a descriptive title, a prompt
// for participants to reflect on, an optional list of resources to inspire
// further exploration, and a placeholder hint for note taking.  These
// definitions are imported into the main application to drive the activity
// pages.

export const ACTIVITIES = [
  {
    id: 'a1',
    title: 'Explore an Indigenous Artist',
    prompt:
      'Explore works by an Indigenous artist that speak to you. How do you relate to this artist? How do they inspire you?',
    resources: [
      'List of important Indigenous artists in Canada',
      'List of influential Indigenous musicians in Canada',
    ],
    notePlaceholder: 'Your reflections on the artist…',
  },
  {
    id: 'a2',
    title: 'Indigenous Medicinal Plants',
    prompt:
      'Discover Indigenous medicinal uses for plants in your area. Describe what you learned.',
    resources: [
      'List of traditional Métis uses for plants',
      'Book on traditional plant foods of Indigenous Peoples in Canada',
    ],
    notePlaceholder: 'Plants, uses, teachings you discovered…',
  },
  {
    id: 'a3',
    title: 'Make a Traditional Recipe',
    prompt:
      'Try making a traditional First Nations, Inuit or Métis recipe. Share your experience (potluck optional!).',
    resources: ['Native American recipes'],
    notePlaceholder: 'Recipe, process, who you shared it with…',
  },
  {
    id: 'a4',
    title: 'Indigenous Peoples Outside Canada',
    prompt:
      'Discover facts about an Indigenous population outside Canada. What stood out to you?',
    resources: [
      'Global map of Indigenous Peoples',
      "Mapped: The world's Indigenous Peoples",
    ],
    notePlaceholder: 'Which community? What you learned…',
  },
  {
    id: 'a5',
    title: 'Film, TV, or Podcast',
    prompt:
      'Watch an Indigenous film/TV show or listen to an Indigenous-focused podcast. What did you learn?',
    resources: [
      'National Film Board – Indigenous cinema',
      'CBC Gem – Indigenous stories',
    ],
    notePlaceholder: 'Title, creator(s), insights…',
  },
  {
    id: 'a6',
    title: 'Read a Book',
    prompt:
      'Read a book by a First Nations, Inuit or Métis author. What did you think?',
    resources: ['#IndigenousReads', 'Ask your local library for suggestions'],
    notePlaceholder: 'Author, title, key takeaways…',
  },
  {
    id: 'a7',
    title: 'Learn Three Words',
    prompt:
      'Learn to say three words in an Indigenous language. Share them with your team and use them often.',
    resources: [
      'FirstVoices',
      'Inuktut glossary (Inuktut Tusaalanga)',
      'Michif Language Revitalization Circle (digital resources)',
      'Métis languages resources (Louis Riel Institute)',
    ],
    notePlaceholder: 'Words/phrases and where they’re used…',
  },
  {
    id: 'a8',
    title: '2SLGBTQQIA+ / Two-Spirit & Indigiqueer Communities',
    prompt:
      'Enrich your understanding of Two-Spirit, Indigiqueer and Indigenous 2SLGBTQQIA+ communities and their histories.',
    resources: [
      'Indigenous knowledge & Two-Spirit leadership',
      'Two-Spirit Library',
      'Two spirits, one voice',
      'Advocates: Dr. James Makokis, Jaris Swidrovich, Raven Davis, TJ Cuthand, Alexa Keleutak, Chelsea Vowel',
    ],
    notePlaceholder: 'Voices you followed; what you learned…',
  },
  {
    id: 'a9',
    title: 'Indigenous-Focused News Story',
    prompt:
      'Uncover a news story with an Indigenous focus and reflect on its scope. What challenges/biases are visible?',
    resources: [
      'APTN',
      'The Turtle Island News',
      'Kukukwes.com',
      'IndigiNews',
      'Ha-Shilth-Sa',
      'Windspeaker.com',
    ],
    notePlaceholder: 'Story link, your reflections…',
  },
  {
    id: 'a10',
    title: 'Indigenous-Owned Business',
    prompt:
      'Explore a First Nations, Inuit or Métis-owned business (in person or online). What products/services spoke to you and why?',
    resources: [
      'Shop First Nations',
      '17 Canadian Indigenous-Owned Businesses (2025)',
      'Indigenous Business Directory',
    ],
    notePlaceholder: 'Business, offerings, how you’ll support…',
  },
];
