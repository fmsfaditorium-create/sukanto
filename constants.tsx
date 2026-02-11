
import { Category, ContentItem } from './types';

export const APP_NAME = "শিক্ষক";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-grammar', name: 'Grammar', labelBn: 'ইংলিশ গ্রামার' },
  { id: 'cat-paragraph', name: 'Paragraph', labelBn: 'প্যারাগ্রাফ' },
  { id: 'cat-essay', name: 'Essay', labelBn: 'এসএ (Essay)' },
  { id: 'cat-poetry', name: 'Poetry', labelBn: 'বাংলা কবিতা' },
  { id: 'cat-stories', name: 'Stories', labelBn: 'বাংলা গল্প' },
];

export const CONTENT_DATA: ContentItem[] = [
  // --- GRAMMAR ---
  {
    id: 'tense-intro',
    title: 'Complete Guide to Tense',
    titleBn: 'টেন্স এর বিস্তারিত আলোচনা',
    category: 'Grammar',
    subCategory: 'Tense',
    excerpt: 'টেন্স বা ক্রিয়ার কাল সম্পর্কে সবকিছু এক জায়গায়। সংজ্ঞা, প্রকারভেদ এবং উদাহরণসহ আলোচনা।',
    content: `টেন্স (Tense) মানে হলো ক্রিয়ার কাল। কোনো কাজ কখন সম্পন্ন হয় বা হয়েছে বা হবে, তা বোঝানোর জন্য ভার্ব বা ক্রিয়ার যে রূপের পরিবর্তন হয়, তাকেই টেন্স বলে।

ইংরেজি গ্রামারে টেন্স প্রধানত তিন প্রকার:
১. Present Tense (বর্তমান কাল)
২. Past Tense (অতীত কাল)
৩. Future Tense (ভবিষ্যৎ কাল)

প্রতিটি টেন্সকে আবার চার ভাগে ভাগ করা হয়েছে। নিচে বিস্তারিত আলোচনা করা হলো:

--- ১. Present Tense (বর্তমান কাল) ---

ক) Present Indefinite Tense: বর্তমানে কোনো কাজ করা, চিরন্তন সত্য বা অভ্যাস বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + Verb-এর Present form + Object.
উদাহরণ: আমি স্কুলে যাই - I go to school. সে বই পড়ে - He reads a book.

খ) Present Continuous Tense: বর্তমানে কোনো কাজ চলছে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + am/is/are + Verb-এর সাথে ing + Object.
উদাহরণ: আমি ভাত খাচ্ছি - I am eating rice. তারা খেলছে - They are playing.

গ) Present Perfect Tense: কোনো কাজ এইমাত্র শেষ হয়েছে কিন্তু তার ফল এখনও আছে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + have/has + Verb-এর Past Participle form + Object.
উদাহরণ: আমি কাজটি করেছি - I have done the work. সে চলে গেছে - He has gone.

ঘ) Present Perfect Continuous Tense: কোনো কাজ পূর্বে শুরু হয়ে এখনও চলছে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + have been/has been + Verb-এর সাথে ing + since/for + Time.
উদাহরণ: আমি দুই ঘণ্টা ধরে পড়ছি - I have been reading for two hours.

--- ২. Past Tense (অতীত কাল) ---

ক) Past Indefinite Tense: অতীতে কোনো কাজ হয়েছিল বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + Verb-এর Past form + Object.
উদাহরণ: আমি ঢাকা গিয়েছিলাম - I went to Dhaka.

খ) Past Continuous Tense: অতীতে কোনো কাজ চলছিল বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + was/were + Verb-এর সাথে ing + Object.
উদাহরণ: সে তখন ঘুমাচ্ছিল - He was sleeping then.

গ) Past Perfect Tense: অতীতে দুটি কাজের মধ্যে একটি আগে এবং একটি পরে হলে আগের কাজটি Past Perfect হয়।
গঠন: Subject + had + Verb-এর Past Participle form + Object.
উদাহরণ: ডাক্তার আসার পূর্বে রোগী মারা গেল - The patient had died before the doctor came.

ঘ) Past Perfect Continuous Tense: অতীতে কোনো কাজ দীর্ঘসময় ধরে চলছিল বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + had been + Verb-এর সাথে ing + Time.
উদাহরণ: সে অনেকক্ষণ ধরে কাঁদছিল - He had been crying for a long time.

--- ৩. Future Tense (ভবিষ্যৎ কাল) ---

ক) Future Indefinite Tense: ভবিষ্যতে কোনো কাজ হবে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + shall/will + Verb-এর Present form + Object.
উদাহরণ: আমি কাজটি করব - I will do the work.

খ) Future Continuous Tense: ভবিষ্যতে কোনো কাজ চলতে থাকবে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + shall be/will be + Verb-এর সাথে ing + Object.
উদাহরণ: তারা মাঠে খেলতে থাকবে - They will be playing in the field.

গ) Future Perfect Tense: ভবিষ্যতে কোনো নির্দিষ্ট সময়ের মধ্যে কাজ শেষ হয়ে যাবে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + shall have/will have + Verb-এর Past Participle form.
উদাহরণ: আমি বিকেল ৫টার মধ্যে ফিরব - I will have returned by 5 PM.

ঘ) Future Perfect Continuous Tense: ভবিষ্যতে কোনো কাজ দীর্ঘ সময় ধরে চলতে থাকবে বোঝালে এটি ব্যবহৃত হয়।
গঠন: Subject + shall have been/will have been + Verb-এর সাথে ing.
উদাহরণ: আমি দুই ঘণ্টা ধরে পড়তে থাকব - I shall have been reading for two hours.

টিপস: টেন্স ভালোভাবে শেখার জন্য প্রচুর উদাহরণ অনুশীলন করা প্রয়োজন। শিক্ষক এআই-কে আপনি চাইলে যেকোনো বাংলা বাক্য ইংরেজিতে অনুবাদ করার অনুরোধ করতে পারেন।`
  },
  {
    id: 'parts-of-speech',
    title: 'Complete Guide to Parts of Speech',
    titleBn: 'পার্টস অফ স্পিচ এর বিস্তারিত আলোচনা',
    category: 'Grammar',
    subCategory: 'Basics',
    excerpt: 'ইংরেজি বাক্যের প্রাণ হলো পার্টস অফ স্পিচ। এখানে ৮ প্রকার পার্টস অফ স্পিচ সম্পর্কে বিস্তারিত জানুন।',
    content: `পার্টস অফ স্পিচ (Parts of Speech) মানে হলো বাক্যের অংশ। একটি সেন্টেন্সে ব্যবহৃত প্রত্যেকটি অর্থবোধক শব্দকে একেকটি Part of Speech বলে।

ইংরেজি গ্রামারে Parts of Speech মোট ৮ প্রকার। নিচে প্রতিটি প্রকারের বিস্তারিত আলোচনা করা হলো:

১. Noun (বিশেষ্য): 
যে শব্দ দ্বারা কোনো ব্যক্তি, বস্তু, স্থান, জাতি, গুণ বা অবস্থার নাম বোঝায়, তাকে Noun বলে।
উদাহরণ: Rahim, Dhaka, Water, Honesty, Team.

২. Pronoun (সর্বনাম): 
Noun-এর পরিবর্তে যে শব্দ ব্যবহৃত হয়, তাকে Pronoun বলে।
উদাহরণ: I, We, You, He, She, They, It.

৩. Adjective (বিশেষণ): 
যে শব্দ দ্বারা Noun বা Pronoun-এর দোষ, গুণ, অবস্থা, সংখ্যা বা পরিমাণ বোঝায়, তাকে Adjective বলে।
উদাহরণ: Good, Bad, Red, Brave, Five, Much.

৪. Verb (ক্রিয়া): 
যে শব্দ দ্বারা কোনো কাজ করা, হওয়া বা থাকা বোঝায়, তাকে Verb বলে। Verb ছাড়া কোনো বাক্য গঠন করা সম্ভব নয়।
উদাহরণ: Eat, Run, Go, Is, Have, Write.

৫. Adverb (ক্রিয়া বিশেষণ): 
যে শব্দ Verb, Adjective অথবা অন্য কোনো Adverb-কে বিশেষভাবে বর্ণনা করে (কিভাবে, কখন, কোথায় কাজ হয়), তাকে Adverb বলে।
উদাহরণ: Slowly, Fast, Very, Now, Daily.

৬. Preposition (পদান্বয়ী অব্যয়): 
যে শব্দ কোনো Noun বা Pronoun-এর আগে বসে বাক্যের অন্য শব্দের সাথে সম্পর্ক স্থাপন করে, তাকে Preposition বলে।
উদাহরণ: In, On, At, To, With, Under, From.

৭. Conjunction (সংযোজক অব্যয়): 
যে শব্দ দুই বা ততোধিক শব্দ (Word) বা বাক্যকে (Sentence) যুক্ত করে, তাকে Conjunction বলে।
উদাহরণ: And, But, Or, Because, Since.

৮. Interjection (আবেগসূচক অব্যয়): 
যে শব্দ দ্বারা মনের আকস্মিক আবেগ, দুঃখ করা, আনন্দ বা বিস্ময় প্রকাশ করা হয়, তাকে Interjection বলে।
উদাহরণ: Alas!, Hurrah!, Oh!, Wow!, Bravo!

মনে রাখার কৌশল: একটি পূর্ণাঙ্গ বাক্য তৈরি করতে এই পার্টস অফ স্পিচগুলো সঠিক নিয়মে সাজাতে হয়।`
  },

  // --- POETRY ---
  {
    id: 'poetry-chharpatra',
    title: 'Chharpatra by Sukanta Bhattacharya',
    titleBn: 'ছাড়পত্র - সুকান্ত ভট্টাচার্য',
    category: 'Poetry',
    excerpt: 'কবি সুকান্ত ভট্টাচার্যের এক কালজয়ী বিপ্লবাত্মক কবিতা। নবজাতকের আগমনে কবির অঙ্গীকার।',
    content: `যে শিশু ভূমিষ্ঠ হল আজ রাতে
তার মুখে খবর পেলুম:
সে পেয়েছে ছাড়পত্র এক,
নতুন বিশ্বের দ্বারে তাই পাঠাল সে জয়ধ্বনি
তার এই ক্ষুদ্র মুষ্টিবদ্ধ হাত উত্তোলিত উদ্ভাসিত
কী এক অকুণ্ঠিত প্রতিবাদে।

জানি না কী এক অলঙ্ঘ্য বিধানে
আসে সে পৃথিবীতে,
সে এক বিষণ্ণ সন্ধ্যায়,
তবু তার আর্তনাদ এক পরম আকাঙ্ক্ষায়
ছড়িয়ে পড়ে চারিদিকে।

এ বিশ্বকে এ শিশুর বাসযোগ্য করে যাব আমি—
নবজাতকের কাছে এ আমার দৃঢ় অঙ্গীকার।
অবশেষে সব কাজ সেরে আমার দেহের রক্তে
নতুন শিশুকে করে যাব আশীর্বাদ,
তারপর হব ইতিহাস।`
  },

  // --- STORIES ---
  {
    id: 'story-ekush-galpo',
    title: 'A Story of 21st February',
    titleBn: 'একুশের গল্প',
    category: 'Stories',
    excerpt: 'ভাষা আন্দোলনের প্রেক্ষাপটে একটি ছোটগল্প। তপু ও তার বর্ণমালার লড়াই।',
    content: `তপুর বয়স তখন মাত্র সাত বছর। সে সময় ঢাকা শহরের রাজপথ উত্তাল ছিল মাতৃভাষার দাবিতে। তপু দেখত তার বড় ভাই রাত জেগে পোস্টার লিখতেন— 'রাষ্ট্রভাষা বাংলা চাই'। তপু বুঝত না রাষ্ট্রভাষা কী, কিন্তু সে তার মায়ের মুখে শোনা রূপকথার গল্পগুলো খুব ভালোবাসত।

১৯৫২ সালের ২১শে ফেব্রুয়ারি। তপুর ভাই মিছিলে গেলেন। তপু জানালার পাশে বসে ছিল। হঠাৎ গুলির শব্দ। চারদিকে হাহাকার। পরদিন তপু শুনল তার ভাই আর ফিরবে না। তারা নাকি বর্ণমালাকে বাঁচাতে গিয়ে প্রাণ দিয়েছে।

তপু সেদিন থেকেই ঠিক করল সে বড় হয়ে অনেক বই পড়বে, তার ভাইয়ের স্বপ্ন পূরণ করবে। আজ তপু একজন শিক্ষক। সে যখন ক্লাসে বাচ্চাদের 'অ' 'আ' শেখায়, তার মনে পড়ে সেই ফাল্গুনের কথা। তপু জানে, একুশ মানে মাথা নত না করা।`
  },

  // --- PARAGRAPHS ---
  {
    id: 'p-environment-pollution',
    title: 'Environment Pollution',
    titleBn: 'পরিবেশ দূষণ',
    category: 'Paragraph',
    excerpt: 'A common paragraph on how our environment gets polluted and how to prevent it.',
    content: `Environment pollution refers to the contamination of the natural surroundings. It is one of the greatest problems of the modern world. Air, water, and soil are the main elements of the environment, and they are polluted in various ways. Smoke from factories and vehicles pollutes the air. Waste materials from industries and chemicals from agriculture pollute the water. Deforestation and excessive use of plastic pollute the soil. We must raise awareness, plant more trees, and reduce waste to protect our environment for future generations.`
  },

  // --- ESSAYS ---
  {
    id: 'e-digital-bangladesh',
    title: 'Digital Bangladesh',
    titleBn: 'ডিজিটাল বাংলাদেশ',
    category: 'Essay',
    excerpt: 'The vision and reality of a technology-driven nation.',
    content: `Digital Bangladesh means an ICT-based modern country where all kinds of services will be available at the doorsteps of the people. It aims at reducing poverty, ensuring education, and providing health care through the use of technology. 
    
    The main components of Digital Bangladesh are human resource development, connecting citizens, and digital government. The government has already established Union Digital Centers, launched the Bangabandhu Satellite-1, and significantly reduced the cost of internet connectivity. 
    
    While there are challenges like cybercrime and digital divide, the progress is undeniable. By utilizing technology in every sector, we can build a prosperous and corruption-free nation.`
  }
];
