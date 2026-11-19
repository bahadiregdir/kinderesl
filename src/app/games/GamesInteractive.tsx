'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Monitor,
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  FileDown,
  ArrowRight,
  Type,
  Hash,
  Tractor,
  Snowflake,
} from 'lucide-react';

type GameId = 'phonics' | 'counting' | 'farm' | 'winter';

interface PhonicsRound {
  letter: string;
  soundLabel: string;
  spokenPrompt: string;
  targetWord: string;
  emoji: string;
  options: Array<{ word: string; emoji: string }>;
}

interface CountingRound {
  count: number;
  itemWord: string;
  emoji: string;
  spokenPrompt: string;
}

interface FarmRound {
  animal: string;
  sound: string;
  emoji: string;
  spokenPrompt: string;
  options: Array<{ animal: string; emoji: string }>;
}

interface WinterRound {
  question: string;
  outlier: string;
  reason: string;
  items: Array<{ word: string; emoji: string }>;
}

const PHONICS_ROUNDS: PhonicsRound[] = [
  {
    letter: 'A',
    soundLabel: '/a/ /a/',
    spokenPrompt: 'A says ah. Which word begins with the letter A?',
    targetWord: 'Apple',
    emoji: '🍎',
    options: [
      { word: 'Apple', emoji: '🍎' },
      { word: 'Ball', emoji: '⚽' },
      { word: 'Cat', emoji: '🐱' },
    ],
  },
  {
    letter: 'B',
    soundLabel: '/b/ /b/',
    spokenPrompt: 'B says buh. Which word begins with the letter B?',
    targetWord: 'Balloon',
    emoji: '🎈',
    options: [
      { word: 'Sun', emoji: '☀️' },
      { word: 'Balloon', emoji: '🎈' },
      { word: 'Fish', emoji: '🐟' },
    ],
  },
  {
    letter: 'C',
    soundLabel: '/k/ /k/',
    spokenPrompt: 'C says kuh. Which word begins with the letter C?',
    targetWord: 'Cow',
    emoji: '🐮',
    options: [
      { word: 'Cow', emoji: '🐮' },
      { word: 'Duck', emoji: '🦆' },
      { word: 'Ant', emoji: '🐜' },
    ],
  },
  {
    letter: 'D',
    soundLabel: '/d/ /d/',
    spokenPrompt: 'D says duh. Which word begins with the letter D?',
    targetWord: 'Duck',
    emoji: '🦆',
    options: [
      { word: 'Pig', emoji: '🐷' },
      { word: 'Hat', emoji: '🧢' },
      { word: 'Duck', emoji: '🦆' },
    ],
  },
  {
    letter: 'E',
    soundLabel: '/e/ /e/',
    spokenPrompt: 'E says eh. Which word begins with the letter E?',
    targetWord: 'Elephant',
    emoji: '🐘',
    options: [
      { word: 'Elephant', emoji: '🐘' },
      { word: 'Star', emoji: '⭐' },
      { word: 'Mitten', emoji: '🧤' },
    ],
  },
  {
    letter: 'F',
    soundLabel: '/f/ /f/',
    spokenPrompt: 'F says fuh. Which word begins with the letter F?',
    targetWord: 'Fish',
    emoji: '🐟',
    options: [
      { word: 'Apple', emoji: '🍎' },
      { word: 'Fish', emoji: '🐟' },
      { word: 'Boot', emoji: '🥾' },
    ],
  },
  {
    letter: 'G',
    soundLabel: '/g/ /g/',
    spokenPrompt: 'G says guh. Which word begins with the letter G?',
    targetWord: 'Grapes',
    emoji: '🍇',
    options: [
      { word: 'Grapes', emoji: '🍇' },
      { word: 'Snowman', emoji: '⛄' },
      { word: 'Sheep', emoji: '🐑' },
    ],
  },
  {
    letter: 'H',
    soundLabel: '/h/ /h/',
    spokenPrompt: 'H says huh. Which word begins with the letter H?',
    targetWord: 'Horse',
    emoji: '🐴',
    options: [
      { word: 'Leaf', emoji: '🍃' },
      { word: 'Horse', emoji: '🐴' },
      { word: 'Moon', emoji: '🌙' },
    ],
  },
  {
    letter: 'I',
    soundLabel: '/i/ /i/',
    spokenPrompt: 'I says ih. Which word begins with the letter I?',
    targetWord: 'Igloo',
    emoji: '🧊',
    options: [
      { word: 'Igloo', emoji: '🧊' },
      { word: 'Duck', emoji: '🦆' },
      { word: 'Sled', emoji: '🛷' },
    ],
  },
  {
    letter: 'J',
    soundLabel: '/j/ /j/',
    spokenPrompt: 'J says juh. Which word begins with the letter J?',
    targetWord: 'Juice',
    emoji: '🧃',
    options: [
      { word: 'Bee', emoji: '🐝' },
      { word: 'Scarf', emoji: '🧣' },
      { word: 'Juice', emoji: '🧃' },
    ],
  },
];

const COUNTING_ROUNDS: CountingRound[] = [
  { count: 1, itemWord: 'sun', emoji: '☀️', spokenPrompt: 'Count the pictures. How many suns do you see?' },
  { count: 2, itemWord: 'balloons', emoji: '🎈', spokenPrompt: 'Count with Lily! How many balloons are there?' },
  { count: 3, itemWord: 'fish', emoji: '🐟', spokenPrompt: 'Touch and count carefully. How many fish?' },
  { count: 4, itemWord: 'stars', emoji: '⭐', spokenPrompt: 'Count aloud together. How many stars?' },
  { count: 5, itemWord: 'ladybugs', emoji: '🐞', spokenPrompt: 'Last one! How many ladybugs are at the party?' },
];

const FARM_ROUNDS: FarmRound[] = [
  {
    animal: 'Cow',
    sound: 'Moo!',
    emoji: '🐮',
    spokenPrompt: 'Which farm animal says Moo?',
    options: [
      { animal: 'Cow', emoji: '🐮' },
      { animal: 'Pig', emoji: '🐷' },
      { animal: 'Duck', emoji: '🦆' },
      { animal: 'Sheep', emoji: '🐑' },
    ],
  },
  {
    animal: 'Pig',
    sound: 'Oink!',
    emoji: '🐷',
    spokenPrompt: 'Which farm animal says Oink?',
    options: [
      { animal: 'Horse', emoji: '🐴' },
      { animal: 'Pig', emoji: '🐷' },
      { animal: 'Chicken', emoji: '🐔' },
      { animal: 'Cow', emoji: '🐮' },
    ],
  },
  {
    animal: 'Sheep',
    sound: 'Baa!',
    emoji: '🐑',
    spokenPrompt: 'Which farm animal says Baa?',
    options: [
      { animal: 'Duck', emoji: '🦆' },
      { animal: 'Cow', emoji: '🐮' },
      { animal: 'Sheep', emoji: '🐑' },
      { animal: 'Pig', emoji: '🐷' },
    ],
  },
  {
    animal: 'Duck',
    sound: 'Quack!',
    emoji: '🦆',
    spokenPrompt: 'Which farm animal says Quack?',
    options: [
      { animal: 'Chicken', emoji: '🐔' },
      { animal: 'Duck', emoji: '🦆' },
      { animal: 'Horse', emoji: '🐴' },
      { animal: 'Sheep', emoji: '🐑' },
    ],
  },
  {
    animal: 'Horse',
    sound: 'Neigh!',
    emoji: '🐴',
    spokenPrompt: 'Which farm animal says Neigh?',
    options: [
      { animal: 'Horse', emoji: '🐴' },
      { animal: 'Pig', emoji: '🐷' },
      { animal: 'Cow', emoji: '🐮' },
      { animal: 'Duck', emoji: '🦆' },
    ],
  },
  {
    animal: 'Chicken',
    sound: 'Cluck!',
    emoji: '🐔',
    spokenPrompt: 'Which farm animal says Cluck?',
    options: [
      { animal: 'Sheep', emoji: '🐑' },
      { animal: 'Horse', emoji: '🐴' },
      { animal: 'Chicken', emoji: '🐔' },
      { animal: 'Cow', emoji: '🐮' },
    ],
  },
];

const WINTER_ROUNDS: WinterRound[] = [
  {
    question: 'Tap the item that is NOT for winter!',
    outlier: 'Watermelon',
    reason: 'Watermelon is for summer!',
    items: [
      { word: 'Snowman', emoji: '⛄' },
      { word: 'Mitten', emoji: '🧤' },
      { word: 'Watermelon', emoji: '🍉' },
      { word: 'Hot Cocoa', emoji: '☕' },
    ],
  },
  {
    question: 'Which item does NOT belong in Penny’s winter bag?',
    outlier: 'Sunglasses',
    reason: 'Sunglasses are for sunny summer days!',
    items: [
      { word: 'Sunglasses', emoji: '🕶️' },
      { word: 'Winter Hat', emoji: '🧶' },
      { word: 'Sled', emoji: '🛷' },
      { word: 'Ice Skate', emoji: '⛸️' },
    ],
  },
  {
    question: 'Spot the summer item in the snowy row!',
    outlier: 'Beach Ball',
    reason: 'A beach ball is for the summer beach!',
    items: [
      { word: 'Scarf', emoji: '🧣' },
      { word: 'Snowflake', emoji: '❄️' },
      { word: 'Winter Boot', emoji: '🥾' },
      { word: 'Beach Ball', emoji: '🏖️' },
    ],
  },
  {
    question: 'Which one is NOT cold weather gear?',
    outlier: 'Flip-Flops',
    reason: 'Flip-flops keep toes cool in summer!',
    items: [
      { word: 'Coat', emoji: '🧥' },
      { word: 'Flip-Flops', emoji: '🩴' },
      { word: 'Snowflakes', emoji: '❄️' },
      { word: 'Earmuffs', emoji: '🎧' },
    ],
  },
  {
    question: 'Help Penny find the last odd one out!',
    outlier: 'Ice Cream Cone',
    reason: 'Ice cream cones are a summer treat!',
    items: [
      { word: 'Penguin', emoji: '🐧' },
      { word: 'Snowman', emoji: '⛄' },
      { word: 'Ice Cream Cone', emoji: '🍦' },
      { word: 'Mitten', emoji: '🧤' },
    ],
  },
];

const GAME_META: Record<
  GameId,
  {
    title: string;
    shortTitle: string;
    worksheetTitle: string;
    worksheetHref: string;
    totalRounds: number;
  }
> = {
  phonics: {
    title: 'Alphabet Phonics Match (A–J)',
    shortTitle: 'Phonics Match',
    worksheetTitle: "Letter A Tracing & Phonics: Andy the Ant Loves Apples",
    worksheetHref: '/worksheets/letter-a-tracing-and-phonics',
    totalRounds: PHONICS_ROUNDS.length,
  },
  counting: {
    title: "Lily's Counting Party (1–5)",
    shortTitle: 'Count 1–5',
    worksheetTitle: "Lily the Ladybug's Party: Count & Trace Numbers 1 to 5",
    worksheetHref: '/worksheets/counting-1-to-5-ladybug-party',
    totalRounds: COUNTING_ROUNDS.length,
  },
  farm: {
    title: 'Farm Animal Sounds Match',
    shortTitle: 'Farm Sounds',
    worksheetTitle: 'Farm Animals Match & Cut-and-Paste: Good Morning, Farm!',
    worksheetHref: '/worksheets/farm-animals-esl-vocabulary-and-tracing',
    totalRounds: FARM_ROUNDS.length,
  },
  winter: {
    title: 'Penny’s Winter Odd One Out',
    shortTitle: 'Winter Odd One',
    worksheetTitle: 'Penny Packs for a Snowy Day: Winter Odd One Out',
    worksheetHref: '/worksheets/winter-odd-one-out-visual-discrimination',
    totalRounds: WINTER_ROUNDS.length,
  },
};

export function GamesInteractive() {
  const [activeGame, setActiveGame] = useState<GameId>('phonics');
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [smartboardMode, setSmartboardMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const speak = useCallback(
    (text: string) => {
      if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const enUsVoice =
          voices.find((v) => v.lang === 'en-US') ||
          voices.find((v) => v.lang.startsWith('en'));
        if (enUsVoice) utter.voice = enUsVoice;
        utter.lang = 'en-US';
        utter.rate = 0.9;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      } catch {
        // Speech synthesis is progressive enhancement
      }
    },
    [soundEnabled]
  );

  const currentMeta = GAME_META[activeGame];

  const getCurrentPrompt = useCallback((): string => {
    if (activeGame === 'phonics') return PHONICS_ROUNDS[roundIdx].spokenPrompt;
    if (activeGame === 'counting') return COUNTING_ROUNDS[roundIdx].spokenPrompt;
    if (activeGame === 'farm') return FARM_ROUNDS[roundIdx].spokenPrompt;
    return WINTER_ROUNDS[roundIdx].question;
  }, [activeGame, roundIdx]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const switchGame = (nextGame: GameId) => {
    setActiveGame(nextGame);
    setRoundIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleReset = () => {
    setRoundIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
  };

  const handleNext = () => {
    const total = currentMeta.totalRounds;
    const nextIdx = (roundIdx + 1) % total;
    setRoundIdx(nextIdx);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleAnswer = (choice: string, correctAnswer: string, praiseText: string, retryText: string) => {
    setSelectedOption(choice);
    if (choice === correctAnswer) {
      if (isCorrect !== true) {
        setScore((s) => s + 10);
      }
      setIsCorrect(true);
      speak(praiseText);
    } else {
      setIsCorrect(false);
      speak(retryText);
    }
  };

  const progressPercent = Math.round(((roundIdx + 1) / currentMeta.totalRounds) * 100);

  return (
    <div
      className={
        smartboardMode
          ? 'fixed inset-0 z-50 bg-slate-900 text-white p-4 sm:p-8 overflow-y-auto'
          : ''
      }
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-6">
        {/* Top Controls Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded">
                <Monitor className="w-3.5 h-3.5" />
                <span>Smartboard &amp; Projector Ready</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Ad-Free Screen</span>
              </span>
            </div>
            <h1
              className={`font-extrabold tracking-tight font-heading ${
                smartboardMode ? 'text-2xl sm:text-3xl text-white' : 'text-3xl sm:text-4xl text-slate-900'
              }`}
            >
              Classroom Interactive Learning Games
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                soundEnabled
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
              aria-label={soundEnabled ? 'Mute voice prompts' : 'Enable voice prompts'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Voice On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSmartboardMode((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2E6B6B] hover:bg-[#225151] text-white text-xs font-bold shadow-sm transition-all"
            >
              <Maximize2 className="w-4 h-4" />
              <span>{smartboardMode ? 'Exit Fullscreen' : 'Smartboard Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* 4-Game Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { id: 'phonics', label: GAME_META.phonics.shortTitle, icon: Type },
              { id: 'counting', label: GAME_META.counting.shortTitle, icon: Hash },
              { id: 'farm', label: GAME_META.farm.shortTitle, icon: Tractor },
              { id: 'winter', label: GAME_META.winter.shortTitle, icon: Snowflake },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeGame === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchGame(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                  active
                    ? 'bg-[#2E6B6B] border-[#2E6B6B] text-white shadow-sm'
                    : smartboardMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-teal-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#2E6B6B] hover:bg-[#F0F7F7]/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Game Canvas (Strictly Ad-Free) */}
        <div
          className={`rounded-2xl border p-5 sm:p-8 space-y-6 ${
            smartboardMode
              ? 'bg-slate-800 border-slate-700 shadow-2xl text-white'
              : 'bg-white border-slate-200 shadow-md text-slate-900'
          }`}
        >
          {/* Status & Progress Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span className={smartboardMode ? 'text-slate-300' : 'text-slate-500'}>
                  {currentMeta.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F0F7F7] text-[#2E6B6B] font-bold text-xs">
                  {roundIdx + 1} / {currentMeta.totalRounds}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => speak(getCurrentPrompt())}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Hear Prompt</span>
                </button>
                <span className={smartboardMode ? 'text-slate-200' : 'text-slate-600'}>
                  Score: <strong className="text-emerald-500">{score} pts</strong>
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className={`inline-flex items-center gap-1 text-xs hover:underline ${
                    smartboardMode ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className="h-full bg-[#2E6B6B] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* GAME 1: PHONICS */}
          {activeGame === 'phonics' && (() => {
            const round = PHONICS_ROUNDS[roundIdx];
            return (
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <button
                  type="button"
                  onClick={() => speak(round.spokenPrompt)}
                  className="inline-block px-8 py-6 rounded-2xl bg-[#F0F7F7] border-2 border-[#2E6B6B]/30 hover:border-[#2E6B6B] transition-all shadow-inner"
                >
                  <span className="text-6xl sm:text-7xl font-extrabold text-[#2E6B6B] block leading-none">
                    {round.letter} {round.letter.toLowerCase()}
                  </span>
                  <span className="text-sm font-bold text-slate-700 mt-3 flex items-center justify-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#2E6B6B]" />
                    <span>Tap to hear sound {round.soundLabel}</span>
                  </span>
                </button>

                <p className="text-lg sm:text-xl font-bold">
                  Which word begins with the letter {round.letter}?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {round.options.map((opt) => {
                    const selected = selectedOption === opt.word;
                    const right = opt.word === round.targetWord;
                    let cls = smartboardMode
                      ? 'bg-slate-700 border-slate-600 text-white hover:border-teal-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-[#F0F7F7] hover:border-[#2E6B6B]';
                    if (selected) {
                      cls = right
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg scale-[1.02]'
                        : 'bg-rose-500 border-rose-600 text-white';
                    }
                    return (
                      <button
                        key={opt.word}
                        type="button"
                        onClick={() =>
                          handleAnswer(
                            opt.word,
                            round.targetWord,
                            `Awesome! ${round.targetWord} starts with ${round.letter}!`,
                            `Try again! ${opt.word} does not start with ${round.letter}.`
                          )
                        }
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${cls}`}
                      >
                        <span className="text-5xl">{opt.emoji}</span>
                        <span className="text-lg font-extrabold">{opt.word}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* GAME 2: COUNTING 1-5 */}
          {activeGame === 'counting' && (() => {
            const round = COUNTING_ROUNDS[roundIdx];
            return (
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <p className="text-lg sm:text-xl font-bold">
                  Touch and count! How many {round.itemWord} do you see?
                </p>

                <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F7F7] border-2 border-[#2E6B6B]/20 flex flex-wrap items-center justify-center gap-4 sm:gap-6 min-h-[140px]">
                  {Array.from({ length: round.count }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => speak(String(i + 1))}
                      className="text-5xl sm:text-6xl hover:scale-110 transition-transform"
                      aria-label={`${round.itemWord} ${i + 1}`}
                    >
                      {round.emoji}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const key = String(num);
                    const selected = selectedOption === key;
                    const right = num === round.count;
                    let cls = smartboardMode
                      ? 'bg-slate-700 border-slate-600 text-white hover:border-teal-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-[#F0F7F7] hover:border-[#2E6B6B]';
                    if (selected) {
                      cls = right
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg scale-105'
                        : 'bg-rose-500 border-rose-600 text-white';
                    }
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          handleAnswer(
                            key,
                            String(round.count),
                            `Great counting! There are ${round.count} ${round.itemWord}!`,
                            `Oops! Let's touch and count the ${round.itemWord} together again.`
                          )
                        }
                        className={`py-4 sm:py-5 rounded-2xl border-2 text-2xl sm:text-3xl font-extrabold transition-all ${cls}`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* GAME 3: FARM ANIMAL SOUNDS */}
          {activeGame === 'farm' && (() => {
            const round = FARM_ROUNDS[roundIdx];
            return (
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <button
                  type="button"
                  onClick={() => speak(round.spokenPrompt)}
                  className="inline-flex flex-col items-center gap-2 px-8 py-5 rounded-2xl bg-amber-50 border-2 border-amber-300 hover:border-amber-500 text-slate-900 transition-all"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Barnyard Sound Clue
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#2E6B6B]">
                    &ldquo;{round.sound}&rdquo;
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                    <Volume2 className="w-3.5 h-3.5" /> Tap to hear clue
                  </span>
                </button>

                <p className="text-lg sm:text-xl font-bold">
                  Which farm animal says &ldquo;{round.sound}&rdquo;?
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {round.options.map((opt) => {
                    const selected = selectedOption === opt.animal;
                    const right = opt.animal === round.animal;
                    let cls = smartboardMode
                      ? 'bg-slate-700 border-slate-600 text-white hover:border-teal-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-[#F0F7F7] hover:border-[#2E6B6B]';
                    if (selected) {
                      cls = right
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg scale-[1.02]'
                        : 'bg-rose-500 border-rose-600 text-white';
                    }
                    return (
                      <button
                        key={opt.animal}
                        type="button"
                        onClick={() =>
                          handleAnswer(
                            opt.animal,
                            round.animal,
                            `Yes! The ${round.animal} says ${round.sound}`,
                            `Not quite! That is the ${opt.animal}.`
                          )
                        }
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${cls}`}
                      >
                        <span className="text-5xl">{opt.emoji}</span>
                        <span className="text-base font-extrabold">{opt.animal}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* GAME 4: WINTER ODD ONE OUT */}
          {activeGame === 'winter' && (() => {
            const round = WINTER_ROUNDS[roundIdx];
            return (
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                    🐧 Penny&apos;s Winter Challenge
                  </span>
                  <p className="text-lg sm:text-xl font-bold pt-2">{round.question}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {round.items.map((item) => {
                    const selected = selectedOption === item.word;
                    const right = item.word === round.outlier;
                    let cls = smartboardMode
                      ? 'bg-slate-700 border-slate-600 text-white hover:border-teal-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-[#F0F7F7] hover:border-[#2E6B6B]';
                    if (selected) {
                      cls = right
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg scale-[1.02]'
                        : 'bg-rose-500 border-rose-600 text-white';
                    }
                    return (
                      <button
                        key={item.word}
                        type="button"
                        onClick={() =>
                          handleAnswer(
                            item.word,
                            round.outlier,
                            `Correct! ${round.reason}`,
                            `Good guess, but ${item.word} is great for snowy winter weather!`
                          )
                        }
                        className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${cls}`}
                      >
                        <span className="text-5xl">{item.emoji}</span>
                        <span className="text-sm sm:text-base font-extrabold">{item.word}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Shared Feedback Banner & Next Round Button */}
          {selectedOption && (
            <div className="pt-4 border-t border-slate-200/50 flex flex-col items-center justify-center gap-3 text-center">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    Great job class!{' '}
                    {activeGame === 'winter' ? WINTER_ROUNDS[roundIdx].reason : ''}
                  </span>
                </div>
              ) : (
                <p className="text-rose-400 font-bold text-sm">
                  Let&apos;s look closely and try another choice!
                </p>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Next Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Companion Printable Worksheet Strip */}
        <div
          className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            smartboardMode
              ? 'bg-slate-800/80 border-slate-700 text-slate-200'
              : 'bg-[#F0F7F7] border-[#d0e3e3] text-slate-800'
          }`}
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E6B6B]">
              Companion Printable PDF
            </span>
            <p className="text-sm font-bold">{currentMeta.worksheetTitle}</p>
          </div>
          <Link
            href={currentMeta.worksheetHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B6B] hover:bg-[#225151] text-white text-xs font-bold shrink-0 shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>Open Printable Worksheet</span>
          </Link>
        </div>

        {/* Teacher Usage Notes (Ad-Free Notice) */}
        {!smartboardMode && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-slate-600 space-y-2.5">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2E6B6B]" />
              <span>Smartboard Usage Guidelines for Educators</span>
            </h3>
            <p>
              1. <strong>Projector &amp; Touchscreen Compatibility:</strong> Oversized buttons and high-contrast cards are built for SMART Boards, Promethean panels, tablets, and classroom projectors.
            </p>
            <p>
              2. <strong>100% Ad-Free Classroom Screen:</strong> Advertisements are permanently disabled across all interactive games so students only focus on circle-time learning.
            </p>
            <p>
              3. <strong>Built-In English Voice Prompts:</strong> Tap <em>Hear Prompt</em> or any picture card to model US English phonics, animal sounds, and counting aloud with your class.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
