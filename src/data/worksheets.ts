import { Worksheet, WorksheetSubject } from '@/types/worksheet';
import { topics } from './topics';

export const worksheets: Worksheet[] = [
  {
    id: 'ws-alphabet-letter-a',
    title: 'Letter A Tracing & Phonics: Andy the Ant Loves Apples',
    slug: 'letter-a-tracing-and-phonics',
    subject: 'alphabet',
    subjectName: 'Alphabet & Phonics',
    topics: ['food', 'insects'],
    activityTypes: ['tracing', 'coloring', 'counting'],
    ageBands: ['3-4', '4-5'],
    eslLevel: 'beginner',
    ages: 'Ages 3–5',
    gradeLevel: 'Pre-K & Kindergarten',
    skill: 'Letter recognition and stroke formation (uppercase A, lowercase a); initial phonics sound /a/; visual discrimination and early counting.',
    pages: 2,
    description:
      'A 2-page Letter of the Week printable featuring stroke-guided uppercase A and lowercase a tracing, initial /a/ sound phonics reinforcement with Andy the Ant, and an "Apple Hunt" visual letter recognition activity.',
    quickSummary:
      'Free printable 2-page Letter A worksheet designed for preschool and kindergarten learners. Features stroke-by-stroke uppercase and lowercase letter tracing with directional dots, initial sound phonics modeling with Andy the Ant, and an apple hunt counting activity.',
    teacherNote: {
      skillFocus: 'Letter recognition and formation (uppercase A, lowercase a); initial sound /a/.',
      learningGoal: 'Child traces A and a with correct stroke order and names words that start with /a/.',
      teachingTip:
        'Say the strokes aloud with the child: "slide down, slide down, across." Ask: what else starts with /a/? (alligator, astronaut, acorn).',
      extensionActivity:
        'For page 2 (Apple Hunt), have children color uppercase A apples in red and lowercase a apples in green to reinforce case discrimination while practicing counting to 7.',
      steps: [
        'Introduce Andy the Ant and practice the phonics chant: "/a/ /a/ apple".',
        'Have the child trace large uppercase A starting at the green dot with stroke 1, 2, and 3.',
        'Trace lowercase a with the continuous curve and downward pull.',
        'Turn to page 2 and complete the Apple Hunt, counting all hidden A apples.',
      ],
    },
    whatsInside: [
      'Page 1: Guided uppercase A and lowercase a tracing rows with directional start dots.',
      'Page 2: Apple Hunt letter discrimination search (count 7 hidden apples) plus independent writing lines.',
    ],
    pdfPath: '/worksheets/letter-a-tracing-and-phonics/andy-the-ant-letter-a.pdf',
    pdfFileSize: '131 KB',
    previewImages: [
      '/worksheets/letter-a-tracing-and-phonics/preview-page-1.png',
      '/worksheets/letter-a-tracing-and-phonics/preview-page-2.png',
    ],
    pinterestPinImage: '/worksheets/letter-a-tracing-and-phonics/pinterest-pin.jpg',
    vocabulary: ['ant', 'apple'],
    series: {
      id: 'letter-of-the-week',
      name: 'Letter of the Week',
      order: 1,
      total: 26,
      nextSlug: 'counting-1-to-5-ladybug-party',
    },
    months: [9],
    keywords: [
      'letter a tracing worksheet',
      'letter of the week pre-k',
      'kindergarten alphabet printable',
      'letter a phonics worksheet',
      'free alphabet pdf for teachers',
      'letter a handwriting practice',
      'esl phonics letter a',
    ],
    relatedSlugs: [
      'counting-1-to-5-ladybug-party',
      'winter-odd-one-out-visual-discrimination',
      'farm-animals-esl-vocabulary-and-tracing',
    ],
    faqs: [
      {
        question: 'What strokes are taught in this Letter A tracing printable?',
        answer:
          'Page 1 begins at the top dot with stroke 1 (diagonal left slide), stroke 2 (diagonal right slide), and stroke 3 (horizontal crossbar). Lowercase a teaches the circular stroke followed by a vertical downward pull.',
      },
      {
        question: 'How many target apples are hidden in the Page 2 Apple Hunt?',
        answer:
          'There are 7 total target apples: 4 uppercase A apples and 3 lowercase a apples, encouraging one-to-one counting alongside visual scanning.',
      },
      {
        question: 'Is this worksheet suitable for ESL learners who do not yet speak fluent English?',
        answer:
          'Yes. The picture-word association with an ant and apple provides concrete visual cues, while the phonics chant "/a/ /a/ apple" supports auditory acquisition.',
      },
    ],
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',

    // Turkish localization (Faz 5)
    i18n: {
      tr: {
        slug: 'ingilizce-a-harfi-yazma-etkinligi',
        title: 'Okul Öncesi İngilizce A Harfi Yazma ve Fonetik Etkinliği: Andy the Ant',
        description:
          'Okul öncesi ve anaokulu öğrencileri için ücretsiz indirilebilir İngilizce A harfi çizgi çalışması, büyük/küçük harf tanıma ve fonetik başlangıç sesi /a/ çalışma kağıdı.',
        quickSummary:
          'Okul öncesi ve anaokulu çocukları için 2 sayfalık ücretsiz İngilizce A harfi çalışma kağıdı. Yönlendirmeli başlangıç noktalarıyla büyük A ve küçük a çizgi çalışması, "Andy the Ant" ile fonetik ses tekrarı ve elma bulmaca sayma oyunu içerir.',
        teacherNote: {
          skillFocus: 'Büyük ve küçük A harfi yazımı; İngilizce /a/ fonetik başlangıç sesi.',
          learningGoal: 'Çocuk büyük A ve küçük a harflerini doğru çizgi yönüyle yazar, /a/ sesiyle başlayan İngilizce kelimeleri söyler.',
          teachingTip:
            'Çizgileri çizerken sesli yönerge verin: "aşağı kay, aşağı kay, ortadan birleştir." /a/ sesiyle başlayan diğer kelimeleri sorun (alligator, astronaut, apple).',
          extensionActivity:
            '2. sayfadaki elma avında büyük A harfli elmaları kırmızıya, küçük a harfli elmaları yeşile boyatarak harf ayrımını pekiştirin ve toplam 7 elmayı saydırın.',
          steps: [
            'Andy the Ant karakterini tanıtın ve fonetik tekerlemeyi tekrarlatın: "/a/ /a/ apple".',
            'Yeşil başlangıç noktasından başlayarak büyük A harfini 1, 2 ve 3 numaralı çizgilerle yazdırın.',
            'Küçük a harfinin dairesel çizgisini ve iniş çizgisini tamamlatın.',
            'İkinci sayfadaki Elma Avı etkinliğine geçerek saklanan 7 A harfini bulup saydırın.',
          ],
        },
        whatsInside: [
          'Sayfa 1: Yön okları ve başlangıç noktalarıyla büyük A ve küçük a harf çizgi alıştırmaları.',
          'Sayfa 2: Elma Avı görsel harf bulmacası (7 gizli elmayı bul ve say) ile serbest yazma satırları.',
        ],
        vocabularyWithTranslations: [
          { en: 'ant', tr: 'karınca' },
          { en: 'apple', tr: 'elma' },
        ],
        keywords: [
          'okul öncesi ingilizce etkinlik',
          'okul öncesi ingilizce etkinlik pdf',
          'ingilizce a harfi yazma etkinliği',
          'anaokulu ingilizce etkinlikleri',
          'ingilizce harf boyama',
          'ingilizce fonetik çalışma kağıdı',
        ],
        faqs: [
          {
            question: 'Çalışma kağıdındaki PDF hangi dildedir?',
            answer:
              'Çalışma sayfasındaki PDF uluslararası okul öncesi standartlarında İngilizce olarak hazırlanmıştır. Sayfadaki öğretmen ve veli yönergeleri ise Türkçedir.',
          },
          {
            question: 'İkinci sayfadaki Elma Avı bulmacasında kaç elma gizlidir?',
            answer:
              'Toplam 7 adet A harfli elma gizlidir (4 büyük A, 3 küçük a). Bu etkinlik görsel dikkat ve sayma becerisini destekler.',
          },
        ],
        reviewed: true,
      },
    },

    // Backwards compatibility
    category: 'alphabet',
    categoryName: 'Alphabet & Phonics',
    theme: 'alphabet',
    themeName: 'Alphabet',
  },
  {
    id: 'ws-math-counting-1-5',
    title: "Lily the Ladybug's Party: Count & Trace Numbers 1 to 5",
    slug: 'counting-1-to-5-ladybug-party',
    subject: 'numbers-counting',
    subjectName: 'Numbers & Counting',
    topics: ['insects'],
    activityTypes: ['counting', 'matching', 'tracing', 'coloring'],
    ageBands: ['3-4', '4-5'],
    eslLevel: 'beginner',
    ages: 'Ages 3–5',
    gradeLevel: 'Preschool & Pre-K',
    skill: 'Counting objects 1–5, one-to-one correspondence, numeral recognition, and numeral handwriting formation.',
    pages: 1,
    description:
      'Help Lily the Ladybug prepare for her party by counting party items (suns, balloons, fish, stars, ladybugs), circling the correct numeral from a set of 3 choices, and tracing the number with guide dots.',
    quickSummary:
      'Early math worksheet for preschool and kindergarten students targeting numbers 1 through 5. Combines concrete object counting, one-to-one correspondence, numeral discrimination from multiple choices, and handwriting stroke tracing.',
    teacherNote: {
      skillFocus: 'Counting objects 1–5, one-to-one correspondence, numeral recognition and formation.',
      learningGoal: 'Child counts a set up to 5, matches it to the correct numeral, and writes the numeral.',
      teachingTip:
        'Have children touch each picture as they count aloud to anchor one-to-one correspondence.',
      extensionActivity:
        'Ask children to draw 1 more item in each row and count again, introducing early concepts of addition (+1).',
      steps: [
        'Say the number names together: one, two, three, four, five.',
        'Have the child touch each party object with a finger while counting aloud.',
        'Identify and circle the matching numeral among the 3 choices.',
        'Trace the dotted numbers starting at the green guide dot.',
      ],
    },
    whatsInside: [
      '5 structured counting rows: 1 sun, 2 balloons, 3 fish, 4 stars, 5 ladybugs.',
      'Multiple-choice numeral recognition (3 numbers per row) followed by guided dotted tracing rows.',
    ],
    pdfPath: '/worksheets/counting-1-to-5-ladybug-party/lily-ladybug-counting-1-5.pdf',
    pdfFileSize: '166 KB',
    previewImages: ['/worksheets/counting-1-to-5-ladybug-party/preview-page-1.png'],
    pinterestPinImage: '/worksheets/counting-1-to-5-ladybug-party/pinterest-pin.jpg',
    vocabulary: ['sun', 'balloon', 'fish', 'star', 'ladybug'],
    months: [4, 5],
    keywords: [
      'counting 1 to 5 worksheet',
      'preschool number tracing pdf',
      'ladybug math printable',
      'kindergarten counting worksheet',
      'free math printable for pre-k',
      'one to one correspondence worksheet',
    ],
    relatedSlugs: [
      'letter-a-tracing-and-phonics',
      'winter-odd-one-out-visual-discrimination',
      'farm-animals-esl-vocabulary-and-tracing',
    ],
    faqs: [
      {
        question: 'Why does this counting worksheet include numeral choices before tracing?',
        answer:
          'Discriminating between three numbers before tracing requires active visual number recognition, anchoring memory before motor execution.',
      },
      {
        question: 'What age group is best suited for Lily the Ladybug math?',
        answer:
          'Children aged 3 to 5 who are beginning touch-counting or practicing proper pencil grip for numbers 1 through 5.',
      },
    ],
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',

    // Turkish localization (Faz 5)
    i18n: {
      tr: {
        slug: '1-5-sayma-etkinligi-ugurbocegi-lily',
        title: "Uğur Böceği Lily'nin Partisi: 1'den 5'e Sayma ve Sayı Çizgi Çalışması",
        description:
          "Okul öncesi ve anaokulu için 1'den 5'e kadar İngilizce sayma, birebir eşleme, doğru sayıyı bulma ve rakam yazma çalışma kağıdı.",
        quickSummary:
          "Erken çocukluk dönemi için 1-5 arası temel İngilizce matematik ve sayma etkinliği. Parti nesnelerini sayma, seçenekler arasından doğru rakamı işaretleme ve başlangıç noktalı rakam yazma satırları içerir.",
        teacherNote: {
          skillFocus: "1–5 arası nesne sayma, birebir eşleme, rakam tanıma ve yazma.",
          learningGoal: "Çocuk nesne kümesini 5'e kadar sayar, doğru rakamla eşleştirir ve rakamı çizer.",
          teachingTip:
            'Birebir eşlemeyi sağlamlaştırmak için çocuğun her nesneye parmağıyla dokunarak İngilizce saymasını (one, two, three...) sağlayın.',
          extensionActivity:
            'Her sıranın yanına 1 nesne daha çizdirerek tekrar saydırın; böylece toplama (+1) mantığına erken adım atın.',
          steps: [
            'Sayıları birlikte İngilizce sayın: one, two, three, four, five.',
            'Çocuğun her parti nesnesine parmağıyla dokunarak saymasını sağlayın.',
            'Üç seçenek arasından doğru rakamı daire içine aldırın.',
            'Kılavuz noktadan başlayarak kesik çizgili rakamların üzerinden geçtirin.',
          ],
        },
        whatsInside: [
          '5 farklı sayma sırası: 1 güneş, 2 balon, 3 balık, 4 yıldız, 5 uğur böceği.',
          'Çoktan seçmeli rakam eşleştirme ve başlangıç noktalı rakam yazma satırları.',
        ],
        vocabularyWithTranslations: [
          { en: 'sun', tr: 'güneş' },
          { en: 'balloon', tr: 'balon' },
          { en: 'fish', tr: 'balık' },
          { en: 'star', tr: 'yıldız' },
          { en: 'ladybug', tr: 'uğur böceği' },
        ],
        keywords: [
          'okul öncesi ingilizce etkinlik',
          'okul öncesi ingilizce sayılar',
          'anaokulu ingilizce etkinlikleri',
          '1-5 sayma etkinliği ingilizce',
          'ingilizce rakam yazma çalışma kağıdı',
        ],
        faqs: [
          {
            question: 'PDF dosyasında hangi dil kullanılmıştır?',
            answer:
              'PDF materyalimiz İngilizce sınıf kullanımına uygundur. Sayfadaki veli ve öğretmen kılavuz notları Türkçe olarak sunulmuştur.',
          },
        ],
        reviewed: true,
      },
    },

    // Backwards compatibility
    category: 'numbers-counting',
    categoryName: 'Numbers & Counting',
    theme: 'insects',
    themeName: 'Insects & Bugs',
  },
  {
    id: 'ws-thinking-winter-odd-one-out',
    title: 'Penny Packs for a Snowy Day: Winter Odd One Out',
    slug: 'winter-odd-one-out-visual-discrimination',
    subject: 'thinking-skills',
    subjectName: 'Thinking Skills',
    topics: ['winter', 'clothes'],
    activityTypes: ['odd-one-out', 'coloring', 'tracing'],
    ageBands: ['4-5', '5-6'],
    eslLevel: 'beginner',
    ages: 'Ages 4–6',
    gradeLevel: 'Pre-K to 1st Grade',
    skill: 'Visual discrimination, seasonal categorizing (winter vs. summer), attribute reasoning, and word tracing.',
    pages: 1,
    description:
      'Help Penny the Penguin pack her winter bag! In each row of 4 items, find and circle the outlier that does not belong in winter (watermelon, sunglasses, beach ball), then trace the winter vocabulary words "snow" and "cold".',
    quickSummary:
      'Visual discrimination and seasonal categorization printable for Pre-K and Kindergarten learners. Promotes logical reasoning by identifying non-winter outliers across 3 rows of seasonal gear, complemented by handwriting word tracing for "snow" and "cold".',
    teacherNote: {
      skillFocus: 'Visual discrimination, categorical sorting (winter vs. summer), seasonal vocabulary.',
      learningGoal: 'Child identifies the non-winter item in each row and verbally explains why it does not belong.',
      teachingTip:
        'Ask open-ended questions: "Why doesn’t a watermelon belong in a winter bag? What season do we eat watermelon in?"',
      extensionActivity:
        'Have children draw their own winter item (e.g. earmuffs, jacket) on the back of the page and label it.',
      steps: [
        'Meet Penny the Penguin and read her prompt: "One thing in each row is NOT for winter!"',
        'Look at Row 1 (snowman, mitten, watermelon, hot cocoa) and find the non-winter item.',
        'Repeat for Row 2 (sunglasses) and Row 3 (beach ball).',
        'Trace the winter sight words "snow" and "cold" on the handwriting guidelines below.',
      ],
    },
    whatsInside: [
      '3 rows of seasonal categorization featuring 12 hand-drawn items (snowman, mitten, hot cocoa, sled, ice skate, boot, snowflake, etc.).',
      'Word tracing practice for high-frequency winter words: "snow" and "cold".',
    ],
    pdfPath: '/worksheets/winter-odd-one-out-visual-discrimination/penny-snowy-day-winter-worksheet.pdf',
    pdfFileSize: '494 KB',
    previewImages: ['/worksheets/winter-odd-one-out-visual-discrimination/preview-page-1.png'],
    pinterestPinImage: '/worksheets/winter-odd-one-out-visual-discrimination/pinterest-pin.jpg',
    vocabulary: [
      'snowman',
      'mitten',
      'watermelon',
      'hot cocoa',
      'sunglasses',
      'hat',
      'sled',
      'ice skate',
      'scarf',
      'snowflake',
      'boot',
      'beach ball',
      'snow',
      'cold',
    ],
    months: [12, 1, 2],
    keywords: [
      'winter odd one out worksheet',
      'visual discrimination preschool',
      'penguin winter printable',
      'kindergarten seasonal categorization',
      'winter clothes tracing pdf',
      'esl winter vocabulary worksheet',
    ],
    relatedSlugs: [
      'letter-a-tracing-and-phonics',
      'counting-1-to-5-ladybug-party',
      'farm-animals-esl-vocabulary-and-tracing',
    ],
    faqs: [
      {
        question: 'What is the answer key for this odd-one-out worksheet?',
        answer:
          'Row 1: watermelon (summer fruit). Row 2: sunglasses (sunny/summer wear). Row 3: beach ball (summer pool/beach toy).',
      },
      {
        question: 'How does this activity support language development for ESL learners?',
        answer:
          'It gives students a meaningful communicative purpose to practice comparison words like "because," "summer," and "cold."',
      },
    ],
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',

    // Turkish localization (Faz 5)
    i18n: {
      tr: {
        slug: 'kis-mevsimi-farkli-olani-bul-etkinligi',
        title: 'Penguen Penny Kış Çantası: Kış Mevsimi Farklı Olanı Bul ve Kelime Yazma',
        description:
          'Okul öncesi ve anaokulu öğrencileri için kış mevsimi görsel ayırt etme, mevsime uymayanı bulma (odd-one-out) ve İngilizce kelime yazma etkinliği.',
        quickSummary:
          'Kış ve yaz kavramlarını karşılaştıran görsel mantık ve ayırt etme çalışma kağıdı. Her sıradaki 4 nesneden kışa ait olmayanı bulma, boyama ve "snow", "cold" kelimelerini yazma alıştırması sunar.',
        teacherNote: {
          skillFocus: 'Görsel ayırt etme, mevsimsel sınıflandırma (kış vs. yaz), mevsim kelimeleri.',
          learningGoal: 'Çocuk her sıradaki kışa ait olmayan nesneyi bulur ve neden ait olmadığını sözlü olarak ifade eder.',
          teachingTip:
            'Açık uçlu soru sorun: "Karpuz neden kış çantasına konmaz? Biz karpuzu hangi mevsimde yeriz?"',
          extensionActivity:
            'Çocuğa sayfanın arkasına kendi seçtiği bir kış giysisini (ör. mont veya kulaklık) çizdirin.',
          steps: [
            'Penguen Penny ile tanışın: "Her sırada bir eşya kışa ait değil!"',
            '1. sırayı inceleyin (kardan adam, eldiven, karpuz, sıcak kakao) ve kışa uymayanı bulun.',
            '2. sırada güneş gözlüğünü, 3. sırada plaj topunu işaretletin.',
            'Alt kısımdaki kılavuz satırlarda "snow" (kar) ve "cold" (soğuk) kelimelerini yazdırın.',
          ],
        },
        whatsInside: [
          '3 sıra görsel mantık: 12 farklı çizim (kardan adam, eldiven, kızak, paten, kar tanesi vb.).',
          '"snow" ve "cold" İngilizce kış kelimeleri için satır kılavuzlu yazma alanı.',
        ],
        vocabularyWithTranslations: [
          { en: 'snowman', tr: 'kardan adam' },
          { en: 'mitten', tr: 'eldiven' },
          { en: 'watermelon', tr: 'karpuz' },
          { en: 'hot cocoa', tr: 'sıcak kakao' },
          { en: 'sunglasses', tr: 'güneş gözlüğü' },
          { en: 'hat', tr: 'bere/şapka' },
          { en: 'sled', tr: 'kızak' },
          { en: 'ice skate', tr: 'buz pateni' },
          { en: 'scarf', tr: 'atkı' },
          { en: 'snowflake', tr: 'kar tanesi' },
          { en: 'boot', tr: 'bot/çizme' },
          { en: 'beach ball', tr: 'plaj topu' },
          { en: 'snow', tr: 'kar' },
          { en: 'cold', tr: 'soğuk' },
        ],
        keywords: [
          'okul öncesi ingilizce etkinlik',
          'okul öncesi ingilizce kış etkinlikleri',
          'farklı olanı bul ingilizce',
          'ingilizce boyama sayfası',
          'anaokulu görsel dikkat etkinlikleri',
        ],
        faqs: [
          {
            question: 'Bu çalışma sayfasının cevap anahtarı nedir?',
            answer:
              '1. Sıra: Karpuz (yaz meyvesi). 2. Sıra: Güneş gözlüğü (yaz aksesuarı). 3. Sıra: Plaj topu (yaz/deniz oyuncağı).',
          },
        ],
        reviewed: true,
      },
    },

    // Backwards compatibility
    category: 'thinking-skills',
    categoryName: 'Thinking Skills',
    theme: 'winter',
    themeName: 'Winter',
  },
  {
    id: 'ws-esl-farm-animals',
    title: 'Farm Animals Match & Cut-and-Paste: Good Morning, Farm!',
    slug: 'farm-animals-esl-vocabulary-and-tracing',
    subject: 'vocabulary',
    subjectName: 'ESL Vocabulary',
    topics: ['farm-animals'],
    activityTypes: ['matching', 'cut-and-paste'],
    ageBands: ['3-4', '4-5', '5-6'],
    eslLevel: 'beginner',
    ages: 'Ages 3–6',
    gradeLevel: 'Pre-K & Kindergarten',
    skill: 'Animal vocabulary, sound-word association, scissor fine-motor skills, and picture-to-sound matching.',
    pages: 2,
    description:
      'A 2-page farm animals ESL vocabulary activity: Page 1 ("Good Morning, Farm!") matches animals to sound words; Page 2 ("Who Says That?") features a cut-and-paste barnyard speech bubble puzzle.',
    quickSummary:
      'Engaging 2-page ESL farm animals worksheet for preschool and kindergarten learners. Features animal-to-sound line matching (cow, sheep, pig, chicken) and a scissor-skills cut-and-paste sound speech bubble activity.',
    teacherNote: {
      skillFocus: 'Farm animal names (cow, pig, sheep, chicken, horse, duck) and sound onomatopoeia (moo, oink, baa, cluck, neigh, quack).',
      learningGoal: 'Child identifies each farm animal, mimics its sound in English, and matches it correctly.',
      teachingTip:
        'Use Total Physical Response (TPR): flap wings like a chicken while saying "cluck", or trot like a horse while saying "neigh".',
      extensionActivity:
        'Have children sing "Old MacDonald Had a Farm" pointing to each matched animal in order.',
      steps: [
        'Review the animal pictures together: cow, sheep, pig, chicken, horse, duck.',
        'Imitate the animal sounds together in English (moo, oink, baa, cluck).',
        'Complete the Page 1 line matching activity.',
        'Supervise safety scissors on Page 2 to cut out the speech bubbles and glue them next to the correct farm friend.',
      ],
    },
    whatsInside: [
      'Page 1: "Good Morning, Farm!" – Connect each animal to its spoken greeting and trace animal names.',
      'Page 2: "Who Says That?" – Scissor cutting practice and paste-in-the-barn sound bubble matching.',
    ],
    pdfPath: '/worksheets/farm-animals-esl-vocabulary-and-tracing/farm-animals-match-and-cut-paste.pdf',
    pdfFileSize: '280 KB',
    previewImages: [
      '/worksheets/farm-animals-esl-vocabulary-and-tracing/preview-page-1.png',
      '/worksheets/farm-animals-esl-vocabulary-and-tracing/preview-page-2.png',
    ],
    pinterestPinImage: '/worksheets/farm-animals-esl-vocabulary-and-tracing/pinterest-pin.jpg',
    vocabulary: [
      'cow',
      'pig',
      'sheep',
      'chicken',
      'horse',
      'duck',
      'moo',
      'oink',
      'baa',
      'cluck',
      'neigh',
      'quack',
    ],
    months: [3, 4, 9],
    keywords: [
      'farm animals worksheet esl',
      'cut and paste farm animals preschool',
      'animal sounds matching printable',
      'kindergarten farm vocabulary pdf',
      'free farm animal printables for teachers',
      'preschool scissor skills worksheet',
    ],
    relatedSlugs: [
      'letter-a-tracing-and-phonics',
      'counting-1-to-5-ladybug-party',
      'winter-odd-one-out-visual-discrimination',
    ],
    faqs: [
      {
        question: 'What animals and sounds are covered across both pages?',
        answer:
          'Page 1 covers cow (moo), sheep (baa), pig (oink), and chicken (cluck). Page 2 extends to horse (neigh) and duck (quack).',
      },
      {
        question: 'Are scissors and glue required for this printable?',
        answer:
          'Page 1 is a draw-the-line matching sheet requiring only a crayon or pencil. Page 2 is a cut-and-paste activity designed for child-safe scissor practice.',
      },
    ],
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',

    // Turkish localization (Faz 5)
    i18n: {
      tr: {
        slug: 'ciftlik-hayvanlari-eslestirme-ve-kes-yapistir',
        title: 'Çiftlik Hayvanları Eşleştirme ve Kes-Yapıştır Etkinliği: Good Morning, Farm!',
        description:
          'Okul öncesi ve anaokulu için 2 sayfalık İngilizce çiftlik hayvanları ve sesleri eşleştirme, boyama ve makas becerisi kes-yapıştır çalışma kağıdı.',
        quickSummary:
          'Okul öncesi İngilizce çiftlik ünitesi için 2 sayfalık eğitici materyal. 1. Sayfa hayvan-ses eşleştirmesi, 2. Sayfa ise makasla konuşma balonlarını kesip çiftlik hayvanlarının yanına yapıştırma etkinliği sunar.',
        teacherNote: {
          skillFocus: 'Çiftlik hayvanları (cow, pig, sheep, chicken, horse, duck) ve hayvan sesleri (moo, oink, baa, cluck).',
          learningGoal: 'Çocuk çiftlik hayvanlarını İngilizce adlandırır, seslerini taklit eder ve doğru hayvanla eşleştirir.',
          teachingTip:
            'Tüm Vücut Tepkisi (TPR) yöntemini kullanın: "cluck" derken tavuk gibi kanat çırpın, "neigh" derken at gibi yürüyün.',
          extensionActivity:
            '"Old MacDonald Had a Farm" şarkısını söylerken çocuğun sayfadaki ilgili hayvana parmağıyla dokunmasını isteyin.',
          steps: [
            'Çiftlik hayvanlarını birlikte İngilizce tekrarlayın: cow, sheep, pig, chicken, horse, duck.',
            'Hayvanların İngilizce seslerini çıkarın (moo, baa, oink, cluck).',
            '1. Sayfadaki çizgiyle eşleştirme bölümünü tamamlatın.',
            '2. Sayfada güvenli makasla konuşma balonlarını kestirip doğru hayvanın yanına yapıştırın.',
          ],
        },
        whatsInside: [
          'Sayfa 1: "Good Morning, Farm!" – Hayvanları seslerine çizgiyle bağlama ve kelime tanıma.',
          'Sayfa 2: "Who Says That?" – Makasla kesip çiftliğe yapıştırma ses balonu etkinliği.',
        ],
        vocabularyWithTranslations: [
          { en: 'cow', tr: 'inek' },
          { en: 'pig', tr: 'domuz' },
          { en: 'sheep', tr: 'koyun' },
          { en: 'chicken', tr: 'tavuk' },
          { en: 'horse', tr: 'at' },
          { en: 'duck', tr: 'ördek' },
          { en: 'moo', tr: 'möö' },
          { en: 'oink', tr: 'vak/homurtu' },
          { en: 'baa', tr: 'meee' },
          { en: 'cluck', tr: 'gıdak' },
          { en: 'neigh', tr: 'kişneme' },
          { en: 'quack', tr: 'vak vak' },
        ],
        keywords: [
          'okul öncesi ingilizce etkinlik',
          'okul öncesi ingilizce hayvanlar boyama',
          'çiftlik hayvanları ingilizce etkinlik',
          'ingilizce kes yapıştır okul öncesi',
          'anaokulu ingilizce etkinlikleri',
        ],
        faqs: [
          {
            question: 'Bu çalışma kağıdı için makas ve yapıştırıcı gerekli midir?',
            answer:
              '1. sayfa sadece boya kalemi veya kurşun kalem gerektirir. 2. sayfa ise çocuk dostu küt uçlu makas ve yapıştırıcı ile ince motor becerilerini geliştirmek için tasarlanmıştır.',
          },
        ],
        reviewed: true,
      },
    },

    // Backwards compatibility
    category: 'vocabulary',
    categoryName: 'ESL Vocabulary',
    theme: 'farm-animals',
    themeName: 'Farm Animals',
  },
];

export function getAllWorksheets(): Worksheet[] {
  return worksheets;
}

export function getWorksheetBySlug(slug: string): Worksheet | undefined {
  return worksheets.find((w) => w.slug === slug);
}

export function getWorksheetByTurkishSlug(trSlug: string): Worksheet | undefined {
  return worksheets.find((w) => w.i18n?.tr?.slug === trSlug);
}

export function getWorksheetsBySubject(subject: WorksheetSubject): Worksheet[] {
  return worksheets.filter((w) => w.subject === subject);
}

export function getWorksheetsByTopic(topicSlug: string): Worksheet[] {
  return worksheets.filter((w) => w.topics.includes(topicSlug));
}

export function getWorksheetsByMonth(monthNumber: number): Worksheet[] {
  // Find topics relevant to this month
  const matchingTopics = topics
    .filter((t) => t.curriculumMonths.includes(monthNumber))
    .map((t) => t.slug);

  return worksheets.filter((w) => {
    if (w.months && w.months.includes(monthNumber)) return true;
    return w.topics.some((topic) => matchingTopics.includes(topic));
  });
}

export function getRelatedWorksheets(worksheet: Worksheet, limit = 4): Worksheet[] {
  const others = worksheets.filter((w) => w.id !== worksheet.id);

  // Score by shared topics, subject, and activity types
  const scored = others.map((w) => {
    let score = 0;
    if (w.subject === worksheet.subject) score += 3;
    const sharedTopics = w.topics.filter((t) => worksheet.topics.includes(t));
    score += sharedTopics.length * 2;
    const sharedActivities = w.activityTypes.filter((a) => worksheet.activityTypes.includes(a));
    score += sharedActivities.length;
    return { worksheet: w, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.worksheet);
}

// Backwards compatibility for existing components
export function getWorksheetsByCategory(cat: string): Worksheet[] {
  return worksheets.filter((w) => {
    if (w.subject === cat) return true;
    if (w.category === cat) return true;
    if (cat === 'literacy' && (w.subject === 'alphabet' || w.subject === 'phonics')) return true;
    if (cat === 'math' && w.subject === 'numbers-counting') return true;
    if (cat === 'esl-vocabulary' && w.subject === 'vocabulary') return true;
    return false;
  });
}

export function getWorksheetsByTheme(theme: string): Worksheet[] {
  return getWorksheetsByTopic(theme);
}
