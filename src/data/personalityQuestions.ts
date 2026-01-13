// 100 personality questions covering various professional traits
export interface PersonalityQuestion {
  id: number;
  question: string;
  trait: string; // The trait this question measures
}

export const questionPool: PersonalityQuestion[] = [
  // Leadership & Communication (Questions 1-20)
  { id: 1, question: "I enjoy taking charge in group situations", trait: "Leadership" },
  { id: 2, question: "I find it easy to motivate and inspire others", trait: "Leadership" },
  { id: 3, question: "I prefer making decisions rather than following others", trait: "Leadership" },
  { id: 4, question: "I am comfortable speaking in front of large groups", trait: "Communication" },
  { id: 5, question: "I express my ideas clearly and confidently", trait: "Communication" },
  { id: 6, question: "I enjoy debating and discussing different viewpoints", trait: "Communication" },
  { id: 7, question: "I am good at resolving conflicts between people", trait: "Leadership" },
  { id: 8, question: "I naturally take initiative in new situations", trait: "Leadership" },
  { id: 9, question: "People often come to me for advice", trait: "Leadership" },
  { id: 10, question: "I enjoy organizing events and activities", trait: "Leadership" },
  { id: 11, question: "I am comfortable delegating tasks to others", trait: "Leadership" },
  { id: 12, question: "I listen carefully to understand others' perspectives", trait: "Communication" },
  { id: 13, question: "I adapt my communication style for different audiences", trait: "Communication" },
  { id: 14, question: "I am good at persuading others to see my point of view", trait: "Communication" },
  { id: 15, question: "I stay calm under pressure and guide others through challenges", trait: "Leadership" },
  { id: 16, question: "I enjoy mentoring and teaching others", trait: "Leadership" },
  { id: 17, question: "I am comfortable giving constructive feedback", trait: "Communication" },
  { id: 18, question: "I build strong relationships with people quickly", trait: "Communication" },
  { id: 19, question: "I am diplomatic when dealing with sensitive situations", trait: "Communication" },
  { id: 20, question: "I enjoy networking and meeting new people", trait: "Communication" },

  // Analytical & Problem-Solving (Questions 21-40)
  { id: 21, question: "I enjoy solving complex puzzles and problems", trait: "Analytical" },
  { id: 22, question: "I prefer to analyze data before making decisions", trait: "Analytical" },
  { id: 23, question: "I am detail-oriented and notice small inconsistencies", trait: "Analytical" },
  { id: 24, question: "I enjoy working with numbers and statistics", trait: "Analytical" },
  { id: 25, question: "I break down complex problems into smaller parts", trait: "Problem-Solving" },
  { id: 26, question: "I enjoy finding patterns in data and information", trait: "Analytical" },
  { id: 27, question: "I think logically and systematically", trait: "Analytical" },
  { id: 28, question: "I enjoy conducting research and gathering information", trait: "Analytical" },
  { id: 29, question: "I am good at identifying the root cause of problems", trait: "Problem-Solving" },
  { id: 30, question: "I enjoy strategic planning and forecasting", trait: "Analytical" },
  { id: 31, question: "I am comfortable working with complex systems", trait: "Technical" },
  { id: 32, question: "I enjoy optimizing processes for better efficiency", trait: "Problem-Solving" },
  { id: 33, question: "I question assumptions and seek evidence", trait: "Analytical" },
  { id: 34, question: "I am patient when working through difficult challenges", trait: "Problem-Solving" },
  { id: 35, question: "I enjoy debugging and troubleshooting issues", trait: "Technical" },
  { id: 36, question: "I create structured approaches to solve problems", trait: "Problem-Solving" },
  { id: 37, question: "I am good at evaluating risks and trade-offs", trait: "Analytical" },
  { id: 38, question: "I enjoy learning about scientific concepts", trait: "Analytical" },
  { id: 39, question: "I think critically and question information", trait: "Analytical" },
  { id: 40, question: "I am thorough in my work and check for errors", trait: "Problem-Solving" },

  // Creativity & Innovation (Questions 41-60)
  { id: 41, question: "I enjoy coming up with new and original ideas", trait: "Creativity" },
  { id: 42, question: "I think outside the box to find unique solutions", trait: "Creativity" },
  { id: 43, question: "I am drawn to artistic and creative activities", trait: "Creativity" },
  { id: 44, question: "I enjoy expressing myself through art, music, or writing", trait: "Creativity" },
  { id: 45, question: "I often daydream and imagine new possibilities", trait: "Creativity" },
  { id: 46, question: "I appreciate beauty and aesthetics in design", trait: "Creativity" },
  { id: 47, question: "I am good at visualizing concepts and ideas", trait: "Creativity" },
  { id: 48, question: "I enjoy brainstorming and generating multiple ideas", trait: "Creativity" },
  { id: 49, question: "I am open to trying unconventional approaches", trait: "Creativity" },
  { id: 50, question: "I find inspiration in everyday experiences", trait: "Creativity" },
  { id: 51, question: "I enjoy improvising and adapting on the fly", trait: "Creativity" },
  { id: 52, question: "I am comfortable with ambiguity and uncertainty", trait: "Creativity" },
  { id: 53, question: "I enjoy creating stories or narratives", trait: "Creativity" },
  { id: 54, question: "I appreciate different forms of creative expression", trait: "Creativity" },
  { id: 55, question: "I enjoy designing and creating visual content", trait: "Creativity" },
  { id: 56, question: "I am curious and love exploring new ideas", trait: "Creativity" },
  { id: 57, question: "I enjoy innovating and improving existing things", trait: "Creativity" },
  { id: 58, question: "I see problems as opportunities for creative solutions", trait: "Creativity" },
  { id: 59, question: "I am passionate about learning new creative skills", trait: "Creativity" },
  { id: 60, question: "I enjoy combining different ideas to create something new", trait: "Creativity" },

  // Technical & Practical (Questions 61-80)
  { id: 61, question: "I enjoy working with technology and gadgets", trait: "Technical" },
  { id: 62, question: "I am comfortable learning new software and tools", trait: "Technical" },
  { id: 63, question: "I enjoy building and constructing things", trait: "Technical" },
  { id: 64, question: "I am good at understanding how things work mechanically", trait: "Technical" },
  { id: 65, question: "I enjoy programming and coding", trait: "Technical" },
  { id: 66, question: "I prefer hands-on work over theoretical discussions", trait: "Technical" },
  { id: 67, question: "I am good at fixing and repairing things", trait: "Technical" },
  { id: 68, question: "I enjoy working with precision and accuracy", trait: "Technical" },
  { id: 69, question: "I am comfortable with technical documentation", trait: "Technical" },
  { id: 70, question: "I enjoy experimenting with new technologies", trait: "Technical" },
  { id: 71, question: "I am good at following technical instructions", trait: "Technical" },
  { id: 72, question: "I enjoy working in structured environments", trait: "Technical" },
  { id: 73, question: "I am patient when learning complex technical skills", trait: "Technical" },
  { id: 74, question: "I enjoy automating repetitive tasks", trait: "Technical" },
  { id: 75, question: "I am good at maintaining and organizing systems", trait: "Technical" },
  { id: 76, question: "I enjoy working with data and databases", trait: "Technical" },
  { id: 77, question: "I am comfortable troubleshooting technical issues", trait: "Technical" },
  { id: 78, question: "I enjoy learning about engineering concepts", trait: "Technical" },
  { id: 79, question: "I am detail-oriented in technical work", trait: "Technical" },
  { id: 80, question: "I prefer systematic approaches over intuition", trait: "Technical" },

  // Social & Helping (Questions 81-100)
  { id: 81, question: "I enjoy helping others solve their problems", trait: "Helping" },
  { id: 82, question: "I am empathetic and understand others' feelings", trait: "Helping" },
  { id: 83, question: "I find fulfillment in making a positive difference", trait: "Helping" },
  { id: 84, question: "I enjoy working with people from diverse backgrounds", trait: "Social" },
  { id: 85, question: "I am patient and supportive with others", trait: "Helping" },
  { id: 86, question: "I enjoy volunteering and community service", trait: "Helping" },
  { id: 87, question: "I am a good listener and give emotional support", trait: "Helping" },
  { id: 88, question: "I enjoy working in healthcare or caregiving roles", trait: "Helping" },
  { id: 89, question: "I am comfortable in emotionally challenging situations", trait: "Helping" },
  { id: 90, question: "I enjoy counseling and guiding others", trait: "Helping" },
  { id: 91, question: "I am passionate about social causes and justice", trait: "Social" },
  { id: 92, question: "I enjoy collaborating and working in teams", trait: "Social" },
  { id: 93, question: "I value building strong relationships over tasks", trait: "Social" },
  { id: 94, question: "I am good at reading social cues and body language", trait: "Social" },
  { id: 95, question: "I enjoy mediating and bringing people together", trait: "Social" },
  { id: 96, question: "I am comfortable in service-oriented roles", trait: "Helping" },
  { id: 97, question: "I prioritize others' wellbeing over personal gain", trait: "Helping" },
  { id: 98, question: "I enjoy teaching and sharing knowledge", trait: "Social" },
  { id: 99, question: "I am passionate about education and learning", trait: "Social" },
  { id: 100, question: "I find meaning in contributing to society", trait: "Social" },
];

// Function to randomly select 20 questions
export const getRandomQuestions = (): PersonalityQuestion[] => {
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 20);
};

// Trait descriptions and career mappings
export const traitProfiles: Record<string, {
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}> = {
  Leadership: {
    description: "You are a natural leader with exceptional organizational and motivational abilities.",
    strengths: ["Decision making", "Team management", "Strategic thinking", "Inspiring others"],
    weaknesses: ["Delegation anxiety", "Impatience with slow progress", "Overcommitment"],
    careers: ["IAS Officer", "Business Manager", "Entrepreneur", "HR Director", "School Principal"],
  },
  Communication: {
    description: "You excel at expressing ideas and connecting with people through effective communication.",
    strengths: ["Public speaking", "Negotiation", "Building relationships", "Persuasion"],
    weaknesses: ["Over-explaining", "Difficulty with technical tasks", "Sensitivity to criticism"],
    careers: ["Journalist", "Public Relations Manager", "Lawyer", "Marketing Executive", "News Anchor"],
  },
  Analytical: {
    description: "You have a sharp analytical mind with excellent problem-solving capabilities.",
    strengths: ["Critical thinking", "Data analysis", "Attention to detail", "Logical reasoning"],
    weaknesses: ["Analysis paralysis", "Difficulty with ambiguity", "Overthinking"],
    careers: ["Data Scientist", "Research Scientist", "Financial Analyst", "Doctor", "Chartered Accountant"],
  },
  "Problem-Solving": {
    description: "You thrive on challenges and excel at finding innovative solutions to complex problems.",
    strengths: ["Root cause analysis", "Creative problem-solving", "Persistence", "Adaptability"],
    weaknesses: ["Perfectionism", "Impatience with simple tasks", "Risk-taking"],
    careers: ["Consultant", "Systems Analyst", "Detective", "Surgeon", "Engineer"],
  },
  Creativity: {
    description: "You possess exceptional creativity and imagination with a unique perspective on the world.",
    strengths: ["Innovation", "Visual thinking", "Original ideas", "Artistic expression"],
    weaknesses: ["Difficulty with routine", "Sensitivity to criticism", "Procrastination"],
    careers: ["Graphic Designer", "Film Director", "Architect", "Fashion Designer", "Content Creator"],
  },
  Technical: {
    description: "You have strong technical aptitude and enjoy working with systems and technology.",
    strengths: ["Technical expertise", "Precision", "Systematic approach", "Continuous learning"],
    weaknesses: ["Difficulty with social tasks", "Resistance to non-technical work", "Perfectionism"],
    careers: ["Software Engineer", "Mechanical Engineer", "Robotics Engineer", "Pilot", "Electrician"],
  },
  Helping: {
    description: "You are compassionate and find fulfillment in supporting and helping others.",
    strengths: ["Empathy", "Patience", "Active listening", "Emotional intelligence"],
    weaknesses: ["Emotional burnout", "Difficulty saying no", "Over-involvement"],
    careers: ["Doctor", "Nurse", "Counselor", "Social Worker", "Teacher"],
  },
  Social: {
    description: "You thrive in social environments and excel at building relationships and teamwork.",
    strengths: ["Teamwork", "Networking", "Cultural awareness", "Collaboration"],
    weaknesses: ["Dependency on others", "Conflict avoidance", "Difficulty working alone"],
    careers: ["Event Manager", "HR Professional", "Diplomat", "Sales Manager", "Community Organizer"],
  },
};

// Motivational quotes by career/aim
export const motivationalQuotes: Record<string, string[]> = {
  default: [
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Your limitation—it's only your imagination.",
    "Dream big and dare to fail. - Norman Vaughan",
  ],
  pilot: [
    "Once you have tasted flight, you will forever walk the earth with your eyes turned skyward. - Leonardo da Vinci",
    "The engine is the heart of an airplane, but the pilot is its soul. - Walter Raleigh",
    "Aviation is proof that given the will, we have the capacity to achieve the impossible. - Eddie Rickenbacker",
  ],
  doctor: [
    "The good physician treats the disease; the great physician treats the patient who has the disease. - William Osler",
    "Wherever the art of medicine is loved, there is also a love of humanity. - Hippocrates",
    "Medicine is a science of uncertainty and an art of probability. - William Osler",
  ],
  engineer: [
    "Scientists study the world as it is; engineers create the world that has never been. - Theodore von Kármán",
    "Engineering is not only study of 45 subjects but it is moral studies of intellectual life. - Prakhar Srivastav",
    "The engineer has been, and is, a maker of history. - James Kip Finch",
  ],
  teacher: [
    "A teacher affects eternity; he can never tell where his influence stops. - Henry Adams",
    "The art of teaching is the art of assisting discovery. - Mark Van Doren",
    "Education is not the filling of a pail, but the lighting of a fire. - William Butler Yeats",
  ],
  lawyer: [
    "The good lawyer is not the man who has an eye to every side and angle of contingency. - Edmund Burke",
    "Justice delayed is justice denied. - William E. Gladstone",
    "A lawyer's time and advice are his stock in trade. - Abraham Lincoln",
  ],
  scientist: [
    "Research is what I'm doing when I don't know what I'm doing. - Wernher von Braun",
    "The important thing is not to stop questioning. Curiosity has its own reason for existing. - Albert Einstein",
    "Science is a way of thinking much more than it is a body of knowledge. - Carl Sagan",
  ],
};

export const getMotivationalQuote = (aim: string): string => {
  const normalizedAim = aim.toLowerCase();
  
  // Check for matching career quotes
  for (const [key, quotes] of Object.entries(motivationalQuotes)) {
    if (normalizedAim.includes(key)) {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
  }
  
  // Return default quote if no match
  const defaultQuotes = motivationalQuotes.default;
  return defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
};
