import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, CheckCircle, Crown, Star, ArrowRight } from 'lucide-react';

/* ── Difficulty colour map ── */
const DIFFICULTY_STYLES = {
  Beginner: 'bg-blue-100 text-blue-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

const TestCard = ({ test, onSelect, user }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/test/${test.id}`);

  const difficultyStyle = DIFFICULTY_STYLES[test.difficulty] || 'bg-purple-100 text-purple-700';

  /* ── Progress from user data (hide when unavailable) ── */
  const progress = user?.progress?.[test.id];
  const progressPct = progress
    ? Math.round((progress.answered / test.totalQuestions) * 100)
    : null;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={test.image}
          alt={test.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Free / Premium badge */}
        <div className="absolute top-3 left-3">
          {test.type === 'free' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow">
              <CheckCircle className="w-3 h-3" /> Free
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow">
              <Crown className="w-3 h-3" /> Premium
            </span>
          )}
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${difficultyStyle}`}>
            <Star className="w-3 h-3" />
            {test.difficulty}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">{test.category}</p>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
          {test.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {test.description}
        </p>

        {/* ── Stat chips ── */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {test.time} mins
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium">
            <FileText className="w-3.5 h-3.5" />
            {test.totalQuestions} Questions
          </span>
        </div>

        {/* ── Topic pills ── */}
        {(test.topics || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(test.topics || []).slice(0, 2).map((topic, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                {topic}
              </span>
            ))}
            {(test.topics || []).length > 2 && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded-full font-medium">
                +{(test.topics || []).length - 2} more
              </span>
            )}
          </div>
        )}

        {/* ── Progress bar (logged-in users who've started) ── */}
        {progressPct !== null && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* ── CTA button with shine sweep ── */}
        <button className="relative w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden group/btn mt-auto">
          {/* Shine sweep */}
          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out" />
          <span className="relative z-10">View Details</span>
          <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TestCard;