'use client';

import React, { useState } from 'react';
import { Monitor, Maximize2, Sparkles, Volume2, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GameItem {
  id: string;
  letter: string;
  word: string;
  sound: string;
  hint: string;
}

const phonicsGameData: GameItem[] = [
  { id: '1', letter: 'A', word: 'Apple', sound: '/a/ /a/', hint: 'Andy the Ant loves this fruit!' },
  { id: '2', letter: 'B', word: 'Balloon', sound: '/b/ /b/', hint: 'Lily floats this at her party!' },
  { id: '3', letter: 'C', word: 'Cow', sound: '/k/ /k/', hint: 'A friendly farm animal saying Moo!' },
  { id: '4', letter: 'D', word: 'Duck', sound: '/d/ /d/', hint: 'Swims in the pond and says Quack!' },
];

export function GamesInteractive() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [smartboardMode, setSmartboardMode] = useState(false);

  const currentGame = phonicsGameData[currentIndex];

  const handleSelect = (word: string) => {
    setSelectedWord(word);
    if (word === currentGame.word) {
      setIsCorrect(true);
      setScore((s) => s + 10);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    setSelectedWord(null);
    setIsCorrect(null);
    setCurrentIndex((prev) => (prev + 1) % phonicsGameData.length);
  };

  const handleReset = () => {
    setSelectedWord(null);
    setIsCorrect(null);
    setCurrentIndex(0);
    setScore(0);
  };

  return (
    <div className={smartboardMode ? 'fixed inset-0 z-50 bg-slate-900 text-white p-6 overflow-y-auto' : ''}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2E6B6B] bg-[#F0F7F7] px-2.5 py-1 rounded">
                <Monitor className="w-3.5 h-3.5" />
                <span>Smartboard &amp; Projector Ready</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Ad-Free Classroom Screen</span>
              </span>
            </div>
            <h1 className={`font-extrabold tracking-tight ${smartboardMode ? 'text-3xl text-white' : 'text-3xl sm:text-4xl text-slate-900'}`}>
              Classroom Interactive Learning Games
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setSmartboardMode(!smartboardMode)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2E6B6B] hover:bg-[#225151] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Maximize2 className="w-4 h-4" />
            <span>{smartboardMode ? 'Exit Smartboard Mode' : 'Smartboard Fullscreen'}</span>
          </button>
        </div>

        {/* Live HTML5 Smartboard Game Box (STRICTLY NO ADS ON GAME VIEW) */}
        <div className={`rounded-2xl border ${smartboardMode ? 'bg-slate-800 border-slate-700 shadow-2xl' : 'bg-white border-slate-200 shadow-md'} p-6 sm:p-10 mb-8`}>
          {/* Game Top Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Card:</span>
              <span className="text-[#2E6B6B] font-bold">{currentIndex + 1} of {phonicsGameData.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-500">Classroom Score: <strong className="text-emerald-600">{score} pts</strong></span>
              <button
                type="button"
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-xs"
                title="Restart game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Game Body */}
          <div className="text-center max-w-xl mx-auto space-y-6">
            <div className="inline-block p-6 rounded-2xl bg-[#F0F7F7] border-2 border-[#2E6B6B]/30 shadow-inner">
              <span className="text-6xl sm:text-7xl font-extrabold text-[#2E6B6B] block">
                {currentGame.letter}
              </span>
              <span className="text-sm font-bold text-slate-600 mt-2 block flex items-center justify-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#2E6B6B]" />
                <span>Sound: {currentGame.sound}</span>
              </span>
            </div>

            <div>
              <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                Which word begins with the letter {currentGame.letter}?
              </p>
              <p className="text-xs text-slate-500">
                Hint: {currentGame.hint}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              {['Apple', 'Balloon', 'Cow', 'Duck'].map((option) => {
                const isThisSelected = selectedWord === option;
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-[#F0F7F7] hover:border-[#2E6B6B]';

                if (isThisSelected) {
                  if (option === currentGame.word) {
                    btnStyle = 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-102';
                  } else {
                    btnStyle = 'bg-rose-500 border-rose-600 text-white';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`py-4 px-6 rounded-xl border-2 text-base sm:text-lg font-bold transition-all ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {selectedWord && (
              <div className="pt-4 flex flex-col items-center justify-center gap-3 animate-fade-in">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Great job class! {currentGame.word} starts with {currentGame.letter}!</span>
                  </div>
                ) : (
                  <div className="text-rose-500 font-bold text-sm">
                    Try again! Remember: {currentGame.sound}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-[#2E6B6B] hover:bg-[#225151] text-white font-bold text-sm shadow-sm transition-all"
                >
                  Next Sound →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Instructions Section (Ad-free zone notice) */}
        {!smartboardMode && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-slate-600 space-y-3">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2E6B6B]" />
              <span>Smartboard Usage Guidelines for Educators</span>
            </h3>
            <p>
              1. <strong>Projector &amp; Touchscreen Compatibility:</strong> All KinderESL interactive games are designed with oversized touch targets so students can tap directly on Promethean boards, SMART Boards, or iPads during circle time.
            </p>
            <p>
              2. <strong>Zero Advertisements on Game Screen:</strong> In accordance with classroom safety and educator requirements, the interactive game screen is completely ad-free to avoid unwanted distractions or accidental clicks.
            </p>
            <p>
              3. <strong>Expanding Catalog:</strong> HTML5 games for numbers 1–10, winter discrimination, and sight words are in development.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
