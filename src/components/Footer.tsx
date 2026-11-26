import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  const featuredWorksheets = [
    { title: 'Letter A Tracing & Phonics', href: '/worksheets/letter-a-tracing-and-phonics' },
    { title: 'Numbers 1 to 5 Counting', href: '/worksheets/counting-1-to-5-ladybug-party' },
    { title: 'Winter Discrimination', href: '/worksheets/winter-odd-one-out-visual-discrimination' },
    { title: 'Farm Animals Match & Cut', href: '/worksheets/farm-animals-esl-vocabulary-and-tracing' },
  ];

  const subjects = [
    { title: 'Alphabet', href: '/worksheets/alphabet' },
    { title: 'Phonics', href: '/worksheets/phonics' },
    { title: 'Numbers & Counting', href: '/worksheets/numbers-counting' },
    { title: 'Shapes & Colors', href: '/worksheets/shapes-colors' },
    { title: 'Vocabulary', href: '/worksheets/vocabulary' },
    { title: 'Thinking Skills', href: '/worksheets/thinking-skills' },
  ];

  const popularTopics = [
    { title: 'Farm Animals', href: '/topics/farm-animals' },
    { title: 'Winter & Snow', href: '/topics/winter' },
    { title: 'Insects & Bugs', href: '/topics/insects' },
    { title: 'Food & Nutrition', href: '/topics/food' },
    { title: 'Monthly Themes', href: '/preschool-themes' },
    { title: 'Teaching Guides', href: '/guides' },
    { title: 'Name Tracing Generator', href: '/tools/name-tracing' },
    { title: 'ESL Bingo Generator', href: '/tools/bingo-maker' },
  ];

  const legalLinks = [
    { title: 'About KinderESL', href: '/about' },
    { title: 'Contact & Requests', href: '/contact' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Cookie Policy', href: '/cookie-policy' },
    { title: 'Terms of Use', href: '/terms' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand & mission */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#2E6B6B] flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Kinder<span className="text-teal-400">ESL</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Free printable PDF educational resources for preschool, kindergarten, and ESL teachers worldwide.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                <Sparkles className="w-3 h-3 text-[#F2B544]" />
                <span>100% Free Resources</span>
              </span>
            </div>
          </div>

          {/* Featured Worksheets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Featured Worksheets
            </h3>
            <ul className="space-y-2 text-xs">
              {featuredWorksheets.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Learning Subjects
            </h3>
            <ul className="space-y-2 text-xs">
              {subjects.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Themes &amp; Topics
            </h3>
            <ul className="space-y-2 text-xs">
              {popularTopics.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              About &amp; Policies
            </h3>
            <ul className="space-y-2 text-xs">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-teal-300 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Audience Notice (COPPA / Teacher Resource) */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-200">Audience Notice:</strong>{' '}
            KinderESL.com is an educational publishing resource designed exclusively for adult educators, school teachers, curriculum coordinators, and parents. This website does not target or knowingly collect data from children under the age of 13 in compliance with COPPA, GDPR, and Google publisher policies.
          </p>
          <p>
            All PDF learning printables are copyrighted by KinderESL.com and provided free of charge for personal homeschooling and classroom instructional use. Commercial resale or redistribution is prohibited.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 KinderESL.com. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for early childhood educators worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
