/**
 * aptitudeQuestions.js
 * 30 Original Aptitude Questions across Quantitative, Logical, and Verbal Ability
 */

const aptitudeQuestions = [
  // ── 10 Quantitative Aptitude Questions ──────────────────────────────────
  {
    id: 'quant_1',
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Time and Work',
    text: 'A can complete a project in 12 days and B can complete the same project in 24 days. Working together, in how many days can they complete the project?',
    options: [
      '6 days',
      '8 days',
      '10 days',
      '9 days'
    ],
    correctAnswer: '8 days',
    explanation: "A's 1 day work = 1/12, B's 1 day work = 1/24. Combined 1 day work = 1/12 + 1/24 = 3/24 = 1/8. Hence, together they take 8 days."
  },
  {
    id: 'quant_2',
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Profit and Loss',
    text: 'A merchant sells an article at a profit of 20%. If he had bought it at 10% less and sold it for ₹18 less, he would have gained 25%. What is the cost price of the article?',
    options: [
      '₹200',
      '₹240',
      '₹250',
      '₹300'
    ],
    correctAnswer: '₹240',
    explanation: 'Let CP = x. Original SP = 1.20x. New CP = 0.90x. New SP = 1.25 * 0.90x = 1.125x. Given: 1.20x - 1.125x = 18 => 0.075x = 18 => x = 18 / 0.075 = ₹240.'
  },
  {
    id: 'quant_3',
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Speed, Distance, and Time',
    text: 'A train 180 meters long travelling at 72 km/h crosses a platform in 20 seconds. What is the length of the platform?',
    options: [
      '200 meters',
      '220 meters',
      '240 meters',
      '260 meters'
    ],
    correctAnswer: '220 meters',
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance covered in 20 s = 20 * 20 = 400 m. Platform length = 400 - 180 = 220 meters.'
  },
  {
    id: 'quant_4',
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Percentages',
    text: 'If the price of sugar increases by 25%, by what percentage should a household reduce its consumption so that the overall expenditure remains unchanged?',
    options: [
      '15%',
      '20%',
      '25%',
      '30%'
    ],
    correctAnswer: '20%',
    explanation: 'Percentage reduction = [r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.'
  },
  {
    id: 'quant_5',
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Simple and Compound Interest',
    text: 'A sum of ₹8,000 is invested at 5% simple interest per annum. How much interest will it yield after 3 years?',
    options: [
      '₹1,000',
      '₹1,200',
      '₹1,400',
      '₹1,600'
    ],
    correctAnswer: '₹1,200',
    explanation: 'SI = (P * R * T) / 100 = (8000 * 5 * 3) / 100 = ₹1,200.'
  },
  {
    id: 'quant_6',
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Ratios and Proportions',
    text: 'Two numbers are in the ratio 3 : 5. If 9 is subtracted from both numbers, their ratio becomes 12 : 23. What is the smaller number?',
    options: [
      '27',
      '33',
      '36',
      '42'
    ],
    correctAnswer: '33',
    explanation: 'Let numbers be 3x and 5x. (3x - 9) / (5x - 9) = 12 / 23 => 23(3x - 9) = 12(5x - 9) => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number = 3 * 11 = 33.'
  },
  {
    id: 'quant_7',
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Averages',
    text: 'The average age of 24 students in a class is 15 years. If the teacher’s age is included, the average increases by 1 year. What is the teacher’s age?',
    options: [
      '38 years',
      '40 years',
      '42 years',
      '44 years'
    ],
    correctAnswer: '40 years',
    explanation: 'Total age of 24 students = 24 * 15 = 360. New average for 25 people = 16. Total age = 25 * 16 = 400. Teacher’s age = 400 - 360 = 40 years.'
  },
  {
    id: 'quant_8',
    category: 'Quantitative',
    difficulty: 'Hard',
    topic: 'Permutations and Combinations',
    text: 'In how many different ways can the letters of the word "ENGINEER" be arranged?',
    options: [
      '3,360',
      '6,720',
      '10,080',
      '20,160'
    ],
    correctAnswer: '3,360',
    explanation: 'Total letters = 8. E appears 3 times, N appears 2 times, G, I, R appear once each. Total permutations = 8! / (3! * 2!) = 40320 / (6 * 2) = 40320 / 12 = 3,360.'
  },
  {
    id: 'quant_9',
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Probability',
    text: 'Two unbiased dice are rolled simultaneously. What is the probability that the sum of the numbers appearing on top is greater than 9?',
    options: [
      '1/6',
      '5/36',
      '1/4',
      '7/36'
    ],
    correctAnswer: '1/6',
    explanation: 'Possible sums > 9 are 10, 11, 12. Pairs for sum 10: (4,6), (5,5), (6,4) [3]. Sum 11: (5,6), (6,5) [2]. Sum 12: (6,6) [1]. Total favorable = 6. Total outcomes = 36. Probability = 6/36 = 1/6.'
  },
  {
    id: 'quant_10',
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Pipes and Cisterns',
    text: 'Pipe A can fill a tank in 6 hours, while Pipe B can empty it in 8 hours. If both pipes are opened together, how long will it take to fill the empty tank?',
    options: [
      '18 hours',
      '20 hours',
      '24 hours',
      '28 hours'
    ],
    correctAnswer: '24 hours',
    explanation: 'Net rate per hour = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Thus, it takes 24 hours to fill the tank.'
  },

  // ── 10 Logical Reasoning Questions ──────────────────────────────────────
  {
    id: 'logic_1',
    category: 'Logical',
    difficulty: 'Easy',
    topic: 'Number Series',
    text: 'Find the next number in the sequence: 4, 9, 19, 39, 79, ?',
    options: [
      '149',
      '159',
      '169',
      '179'
    ],
    correctAnswer: '159',
    explanation: 'Each term is obtained by multiplying the previous term by 2 and adding 1: 4*2+1=9, 9*2+1=19, 19*2+1=39, 39*2+1=79, 79*2+1=159.'
  },
  {
    id: 'logic_2',
    category: 'Logical',
    difficulty: 'Medium',
    topic: 'Blood Relations',
    text: 'Pointing to a photograph, a woman says: "He is the son of the only daughter of my father." How is the man in the photograph related to the woman?',
    options: [
      'Brother',
      'Son',
      'Nephew',
      'Father'
    ],
    correctAnswer: 'Son',
    explanation: 'The only daughter of the woman\'s father is the woman herself. Therefore, the man is her son.'
  },
  {
    id: 'logic_3',
    category: 'Logical',
    difficulty: 'Easy',
    topic: 'Coding-Decoding',
    text: 'If in a certain code language, "SYSTEM" is written as "SYSMET" and "NEARER" is written as "AENRER", then how will "FRACTION" be written in that code?',
    options: [
      'CARFNOIT',
      'ARFCNOIT',
      'CARFTION',
      'CARFNOIT'
    ],
    correctAnswer: 'CARFNOIT',
    explanation: 'Divide the 8-letter word into two halves: FRAC and TION. Reverse the first half (CARF) and reverse the second half (NOIT) to get CARFNOIT.'
  },
  {
    id: 'logic_4',
    category: 'Logical',
    difficulty: 'Medium',
    topic: 'Direction Sense',
    text: 'Rohan walks 10 km towards North, turns right and walks 6 km, then turns right again and walks 10 km. How far and in which direction is he from his starting point?',
    options: [
      '6 km East',
      '6 km West',
      '10 km East',
      '10 km North'
    ],
    correctAnswer: '6 km East',
    explanation: 'North 10 km and South 10 km cancel out each other along the vertical axis. The net displacement is 6 km East.'
  },
  {
    id: 'logic_5',
    category: 'Logical',
    difficulty: 'Medium',
    topic: 'Syllogism',
    text: 'Statements: (1) All fruits are vegetables. (2) All vegetables are greens. Conclusions: I. All fruits are greens. II. Some greens are fruits. Which conclusion(s) logically follow?',
    options: [
      'Only conclusion I follows',
      'Only conclusion II follows',
      'Neither I nor II follows',
      'Both conclusion I and II follow'
    ],
    correctAnswer: 'Both conclusion I and II follow',
    explanation: 'Since Fruits ⊂ Vegetables ⊂ Greens, all fruits are greens (I is true) and some greens are fruits (II is true).'
  },
  {
    id: 'logic_6',
    category: 'Logical',
    difficulty: 'Hard',
    topic: 'Seating Arrangement',
    text: 'Five friends P, Q, R, S, and T are sitting in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the middle?',
    options: [
      'P',
      'T',
      'S',
      'Q'
    ],
    correctAnswer: 'S',
    explanation: 'From the given positions: P is left of T => P, T. S is between T and Q => P, T, S, Q. Q is immediate left of R => P, T, S, Q, R. The person in the middle is S.'
  },
  {
    id: 'logic_7',
    category: 'Logical',
    difficulty: 'Easy',
    topic: 'Analogy',
    text: 'Doctor : Hospital :: Teacher : ?',
    options: [
      'Student',
      'School',
      'Book',
      'Classroom'
    ],
    correctAnswer: 'School',
    explanation: 'A doctor operates in a hospital; similarly, a teacher operates primarily in a school (workplace relationship).'
  },
  {
    id: 'logic_8',
    category: 'Logical',
    difficulty: 'Medium',
    topic: 'Clock and Calendar',
    text: 'What was the day of the week on 15th August 1947?',
    options: [
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    correctAnswer: 'Friday',
    explanation: 'Calculating odd days up to 15 August 1947 yields 5 odd days, which corresponds to Friday.'
  },
  {
    id: 'logic_9',
    category: 'Logical',
    difficulty: 'Medium',
    topic: 'Statement and Assumption',
    text: 'Statement: "Please check your tickets before boarding the train." Assumption I: People with invalid tickets may attempt to board. Assumption II: The railway service wants to ensure smooth travel. Which assumption is implicit?',
    options: [
      'Only assumption I is implicit',
      'Only assumption II is implicit',
      'Neither is implicit',
      'Both I and II are implicit'
    ],
    correctAnswer: 'Both I and II are implicit',
    explanation: 'A cautionary notice assumes both that passengers may make mistakes or carry invalid tickets (I) and that checking avoids disruption (II).'
  },
  {
    id: 'logic_10',
    category: 'Logical',
    difficulty: 'Easy',
    topic: 'Odd One Out',
    text: 'Choose the word which is least like the other words in the group: Copper, Zinc, Brass, Aluminium, Iron.',
    options: [
      'Copper',
      'Zinc',
      'Brass',
      'Aluminium'
    ],
    correctAnswer: 'Brass',
    explanation: 'Brass is an alloy (copper + zinc), whereas Copper, Zinc, Aluminium, and Iron are pure chemical elements/metals.'
  },

  // ── 10 Verbal Ability Questions ─────────────────────────────────────────
  {
    id: 'verbal_1',
    category: 'Verbal',
    difficulty: 'Easy',
    topic: 'Sentence Correction',
    text: 'Identify the grammatically correct sentence:',
    options: [
      'Neither the principal nor the teachers was present at the meeting.',
      'Neither the principal nor the teachers were present at the meeting.',
      'Neither the principal nor the teachers is present at the meeting.',
      'Neither the principal or the teachers were present at the meeting.'
    ],
    correctAnswer: 'Neither the principal nor the teachers were present at the meeting.',
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("teachers", which is plural, requiring "were").'
  },
  {
    id: 'verbal_2',
    category: 'Verbal',
    difficulty: 'Medium',
    topic: 'Synonyms',
    text: 'Select the word that is most nearly similar in meaning to: CANDID',
    options: [
      'Deceptive',
      'Frank',
      'Secretive',
      'Arrogant'
    ],
    correctAnswer: 'Frank',
    explanation: '"Candid" means truthful, straightforward, and outspoken, which is synonymous with "Frank".'
  },
  {
    id: 'verbal_3',
    category: 'Verbal',
    difficulty: 'Medium',
    topic: 'Antonyms',
    text: 'Select the word that is most nearly opposite in meaning to: MITIGATE',
    options: [
      'Aggravate',
      'Alleviate',
      'Diminish',
      'Soothe'
    ],
    correctAnswer: 'Aggravate',
    explanation: '"Mitigate" means to make something less severe or painful. Its antonym is "Aggravate" (to make worse).'
  },
  {
    id: 'verbal_4',
    category: 'Verbal',
    difficulty: 'Easy',
    topic: 'Fill in the Blanks',
    text: 'The committee members could not agree ________ the new guidelines proposed by the chairperson.',
    options: [
      'on',
      'with',
      'at',
      'to'
    ],
    correctAnswer: 'on',
    explanation: 'One agrees "on" a topic/policy/guideline, agrees "with" a person, and agrees "to" a proposal.'
  },
  {
    id: 'verbal_5',
    category: 'Verbal',
    difficulty: 'Medium',
    topic: 'Idioms and Phrases',
    text: 'What does the idiom "burn the midnight oil" mean?',
    options: [
      'To waste valuable energy recklessly',
      'To work or study late into the night',
      'To cause intentional damage in anger',
      'To wake up very early in the morning'
    ],
    correctAnswer: 'To work or study late into the night',
    explanation: '"Burn the midnight oil" historically refers to working by oil lamp late into the night.'
  },
  {
    id: 'verbal_6',
    category: 'Verbal',
    difficulty: 'Hard',
    topic: 'Para Jumbles',
    text: 'Rearrange the sentences into a coherent paragraph:\nP: They also help developers detect logical flaws early.\nQ: Automated tests are crucial for software reliability.\nR: This reduces debugging time significantly before deployment.\nS: Consequently, production release cycles become much faster.',
    options: [
      'Q - P - R - S',
      'P - Q - R - S',
      'Q - R - P - S',
      'S - Q - P - R'
    ],
    correctAnswer: 'Q - P - R - S',
    explanation: 'Q introduces automated tests. P adds another benefit ("also help"). R states the direct effect of detecting flaws early. S concludes with the cumulative result ("Consequently").'
  },
  {
    id: 'verbal_7',
    category: 'Verbal',
    difficulty: 'Easy',
    topic: 'One Word Substitution',
    text: 'A person who is fluent in multiple languages is called a:',
    options: [
      'Philanthropist',
      'Polyglot',
      'Bibliophile',
      'Misogynist'
    ],
    correctAnswer: 'Polyglot',
    explanation: '"Polyglot" comes from Greek roots meaning "many tongues" or knowing and using several languages.'
  },
  {
    id: 'verbal_8',
    category: 'Verbal',
    difficulty: 'Medium',
    topic: 'Active and Passive Voice',
    text: 'Change into passive voice: "The team will announce the project results tomorrow."',
    options: [
      'The project results were announced by the team tomorrow.',
      'The project results will be announced by the team tomorrow.',
      'The project results are announced by the team tomorrow.',
      'The project results had been announced by the team tomorrow.'
    ],
    correctAnswer: 'The project results will be announced by the team tomorrow.',
    explanation: 'Simple future "will announce" becomes "will be announced" in passive voice.'
  },
  {
    id: 'verbal_9',
    category: 'Verbal',
    difficulty: 'Medium',
    topic: 'Spotting Errors',
    text: 'Find the part of the sentence containing an error: "Neither of the two candidates (A) / have submitted (B) / their original certificates (C) / on time (D)."',
    options: [
      'Part A',
      'Part B',
      'Part C',
      'Part D'
    ],
    correctAnswer: 'Part B',
    explanation: '"Neither" refers to singular individual entities ("Neither of the two candidates has submitted..."), so "have" in Part B is incorrect.'
  },
  {
    id: 'verbal_10',
    category: 'Verbal',
    difficulty: 'Hard',
    topic: 'Reading Comprehension',
    text: 'Read the short excerpt: "Scientific progress does not proceed solely by the steady accumulation of verified facts, but rather through paradigm shifts that fundamentally rewrite the questions researchers ask." What is the primary implication?',
    options: [
      'Facts are irrelevant to scientific discovery.',
      'Major breakthroughs often require changing the fundamental conceptual framework.',
      'Researchers should stop asking theoretical questions.',
      'Scientific knowledge is always unpredictable and disordered.'
    ],
    correctAnswer: 'Major breakthroughs often require changing the fundamental conceptual framework.',
    explanation: 'The excerpt highlights "paradigm shifts that fundamentally rewrite the questions", which directly describes transforming the underlying conceptual framework.'
  }
];

module.exports = aptitudeQuestions;
