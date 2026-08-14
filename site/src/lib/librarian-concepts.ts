export interface LibrarianConcept {
  terms: string[];
  suggestion: string;
  description: string;
  documents: string[];
}

export const LIBRARIAN_CONCEPTS: LibrarianConcept[] = [
  // ---------------------------------------------------------------------------
  // Remembering God's Faithfulness
  // ---------------------------------------------------------------------------

  {
    terms: [
      "remember gods faithfulness",
      "remember god's faithfulness",
      "remember faithfulness",
      "remember what god has done",
      "looking back",
      "remember",
    ],

    suggestion: "You may be looking for Stones of Remembrance.",

    description:
      "These pages explore recognizing what God has taught, remembering His faithfulness, and carrying those truths forward.",

    documents: [
      "stones-of-remembrance/purpose-of-stones-of-remembrance",
      "stones-of-remembrance/recognizing-a-stone",
      "stones-of-remembrance/stones-in-practice",
    ],
  },

  // ---------------------------------------------------------------------------
  // Taking the Next Step
  // ---------------------------------------------------------------------------

  {
    terms: [
      "next faithful step",
      "next step",
      "what should i do next",
      "how do i move forward",
      "walking with god",
    ],

    suggestion: "You may be looking for the Walking section.",

    description:
      "These pages explore responding to God's Word through faithful obedience, one step at a time.",

    documents: [
      "walking/next-faithful-step",
      "walking/walking-in-the-light",
      "walking/purpose-of-walking",
    ],
  },

  // ---------------------------------------------------------------------------
  // Learning to Read Scripture
  // ---------------------------------------------------------------------------

  {
    terms: [
      "how do i read the bible",
      "how do i study scripture",
      "understand the bible",
      "read scripture",
      "interpret scripture",
      "study the bible",
    ],

    suggestion: "You may be looking for Reading Scripture.",

    description:
      "These pages explore approaching God's Word carefully, understanding context, and responding faithfully.",

    documents: [
      "reading-scripture/how-to-approach-scripture",
      "reading-scripture/read-slowly",
      "reading-scripture/understand-author-intent",
      "reading-scripture/interpret-faithfully",
      "reading-scripture/apply-faithfully",
    ],
  },

  // ---------------------------------------------------------------------------
  // Prayer
  // ---------------------------------------------------------------------------

  {
    terms: [
      "prayer",
      "how do i pray",
      "learning to pray",
      "talking to god",
      "praying honestly",
    ],

    suggestion: "You may be looking for the Prayer section.",

    description:
      "These pages explore prayer as a response to God through dependence, honesty, gratitude, confession, and trust.",

    documents: [
      "prayer/purpose-of-prayer",
      "prayer/praying-honestly",
      "prayer/daily-prayer-rhythm",
      "prayer/prayer-set",
    ],
  },

  // ---------------------------------------------------------------------------
  // Reflection and Journaling
  // ---------------------------------------------------------------------------

  {
    terms: [
      "journal",
      "journaling",
      "reflect on scripture",
      "reflect on the bible",
      "bible study notes",
    ],

    suggestion: "You may be looking for Journaling.",

    description:
      "These pages explore reflecting on Scripture, Bible study, and sermons so that what God has communicated can be considered carefully and carried into faithful response.",

    documents: [
      "journaling/purpose-of-journaling",
      "journaling/journal-framework",
      "journaling/scripture-reflection-template",
      "journaling/bible-study-reflection-template",
    ],
  },

  // ---------------------------------------------------------------------------
  // The Formation Rhythm
  // ---------------------------------------------------------------------------

  {
    terms: [
      "spiritual growth",
      "spiritual formation",
      "grow with god",
      "formation",
      "becoming more like christ",
    ],

    suggestion: "You may be looking for the Formation section.",

    description:
      "These pages explore the connected rhythm of Scripture, prayer, reflection, remembrance, and walking.",

    documents: [
      "formation/map",
      "formation/prayer",
      "formation/reflection",
      "formation/remembrance",
      "formation/walking",
    ],
  },

  // ---------------------------------------------------------------------------
  // Beginning The Guide
  // ---------------------------------------------------------------------------

  {
    terms: [
      "where do i start",
      "start",
      "begin",
      "new here",
      "what is the guide",
    ],

    suggestion: "You may be looking for the Introduction.",

    description:
      "These pages introduce the purpose, philosophy, and posture behind The Guide.",

    documents: [
      "introduction/path-into-the-guide",
      "introduction/purpose-of-the-guide",
      "introduction/philosophy-of-the-guide",
    ],
  },
];
