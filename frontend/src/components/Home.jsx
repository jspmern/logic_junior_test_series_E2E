import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Users, Award, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TestCard from './TestCard';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import Footer from './Footer';

const CARDS_PER_PAGE = 3;
const PAGE_TRANSITION_MS = 350;

/* ── Shimmer keyframe (inline so no external CSS needed) ── */
const shimmerStyle = (
  <style>{`
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    .skeleton-shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite linear;
    }
  `}</style>
);

/* ── SkeletonCard — mirrors the real TestCard layout ── */
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    {/* Image area */}
    <div className="h-48 skeleton-shimmer" />
    <div className="p-6 space-y-3">
      {/* Category label */}
      <div className="h-3 w-1/4 rounded skeleton-shimmer" />
      {/* Title */}
      <div className="h-5 w-3/4 rounded skeleton-shimmer" />
      {/* Description lines */}
      <div className="h-3 w-full rounded skeleton-shimmer" />
      <div className="h-3 w-5/6 rounded skeleton-shimmer" />
      {/* Meta row */}
      <div className="flex gap-4 pt-1">
        <div className="h-3 w-20 rounded skeleton-shimmer" />
        <div className="h-3 w-24 rounded skeleton-shimmer" />
      </div>
      {/* Topic pills */}
      <div className="flex gap-2 pt-1">
        {[1, 2, 3].map(i => <div key={i} className="h-5 w-14 rounded-full skeleton-shimmer" />)}
      </div>
      {/* Button */}
      <div className="h-9 w-full rounded-lg skeleton-shimmer mt-2" />
    </div>
  </div>
);

const Home = ({ testSeries, onSelectTest, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourseFamily, setSelectedCourseFamily] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const navigate = useNavigate();

  // Smooth page change with skeleton flash
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setIsPageChanging(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsPageChanging(false);
    }, PAGE_TRANSITION_MS);
  };

  // Strip trailing " - I", " - II", " - 3" etc. to get the course family name
  const getCourseFamilyName = (title) => {
    // Matches " - " followed by Roman numerals (I/V/X combinations) or digits at end of string
    return title.replace(/\s*-\s*([IVXLCDM]+|\d+)$/i, '').trim();
  };

  const categories = ['All Categories', ...new Set(testSeries.map(test => test.category))];

  // Get unique family names for courses in the selected category
  const courseFamilies = (() => {
    const isAllCategories = selectedCategory === 'All' || selectedCategory === 'All Categories';
    const scopedCourses = isAllCategories
      ? testSeries
      : testSeries.filter(t => t.category === selectedCategory);
    const families = [...new Set(scopedCourses.map(t => getCourseFamilyName(t.title)))];
    return families.sort((a, b) => a.localeCompare(b));
  })();

  const types = ['Free', 'Paid'];

  const filteredTests = testSeries.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || selectedCategory === 'All Categories' || test.category === selectedCategory;
    const matchesCourseFamily = selectedCourseFamily === 'All'
      || getCourseFamilyName(test.title) === selectedCourseFamily;
    const matchesType = selectedType === 'All' || (selectedType === 'Free' && test.type === 'free');

    return matchesSearch && matchesCategory && matchesCourseFamily && matchesType;
  }).sort((a, b) => a.title.localeCompare(b.title));

  const handleViewDetails = (test) => {
    navigate(`/test/${test.testId}`);
  };

  // Reset to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCourseFamily, selectedType]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredTests.length / CARDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTests = filteredTests.slice(
    (safePage - 1) * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE
  );
  const rangeStart = filteredTests.length === 0 ? 0 : (safePage - 1) * CARDS_PER_PAGE + 1;
  const rangeEnd = Math.min(safePage * CARDS_PER_PAGE, filteredTests.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl text-white p-8 mb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master Programming with Expert Test Series
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Challenge yourself with carefully crafted tests designed by industry experts.
            Track your progress and earn certificates.
          </p>
          {!user && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
              <p className="text-white/90 text-sm">
                <span className="font-semibold">Sign in to unlock:</span> Track your progress, earn certificates, and access premium content
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 mr-3" />
              <div>
                <div className="font-semibold text-lg">{testSeries.length}+</div>
                <div className="text-sm opacity-80">Test Series</div>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-3" />
              <div>
                <div className="font-semibold text-lg">10,000+</div>
                <div className="text-sm opacity-80">Active Users</div>
              </div>
            </div>
            <div className="flex items-center">
              <Award className="w-8 h-8 mr-3" />
              <div>
                <div className="font-semibold text-lg">5,000+</div>
                <div className="text-sm opacity-80">Tests Taken</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedCourseFamily('All'); // reset 2nd filter on category change
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedCourseFamily}
                onChange={(e) => setSelectedCourseFamily(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Courses</option>
                {courseFamilies.map(family => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>

              {/* Free Only Toggle Button */}
              <button
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${selectedType === 'Free' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setSelectedType(selectedType === 'Free' ? 'All' : 'Free')}
              >
                <Filter className="w-4 h-4" /> Free Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory === 'All' || selectedCategory === 'All Categories'
              ? 'All Test Series'
              : `${selectedCategory} Tests`}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredTests.length === 0
              ? 'No tests available'
              : `Showing ${rangeStart}–${rangeEnd} of ${filteredTests.length} test${filteredTests.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="w-4 h-4 mr-1" />
          Sorted by name
        </div>
      </div>

      {/* Test Cards Grid */}
      {filteredTests.length > 0 ? (
        <>
          {shimmerStyle}

          {/* Cards grid — real or skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isPageChanging
              ? Array.from({ length: CARDS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
              : paginatedTests.map(test => (
                <TestCard
                  key={test.testId}
                  test={test}
                  onSelect={handleViewDetails}
                  user={user}
                />
              ))
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (() => {
            // Build smart page sequence with ellipsis
            const getPageSequence = () => {
              if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
              const pages = new Set([1, totalPages, safePage]);
              if (safePage > 1) pages.add(safePage - 1);
              if (safePage < totalPages) pages.add(safePage + 1);
              const sorted = [...pages].sort((a, b) => a - b);
              const result = [];
              let prev = null;
              for (const p of sorted) {
                if (prev !== null && p - prev > 1) result.push('…');
                result.push(p);
                prev = p;
              }
              return result;
            };

            return (
              <nav
                aria-label="Course pagination"
                className="flex justify-center mt-8 pt-6 border-t border-gray-100"
              >
                <div className="inline-flex items-center gap-1 bg-white rounded-2xl shadow-md px-4 py-3">

                  {/* Prev chevron */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                    disabled={safePage === 1 || isPageChanging}
                    aria-label="Previous page"
                    className="w-9 h-9 flex items-center justify-center rounded-lg
                      text-gray-400 hover:text-gray-600 hover:bg-gray-100
                      disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers / ellipsis */}
                  {getPageSequence().map((item, idx) =>
                    item === '…' ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
                        aria-hidden="true"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        disabled={isPageChanging}
                        aria-label={`Go to page ${item}`}
                        aria-current={item === safePage ? 'page' : undefined}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
                          ${item === safePage
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  {/* Next chevron */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages || isPageChanging}
                    aria-label="Next page"
                    className="w-9 h-9 flex items-center justify-center rounded-lg
                      text-gray-400 bg-gray-100
                      hover:text-gray-600 hover:bg-gray-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              </nav>
            );
          })()}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find more tests.
          </p>
        </div>
      )}

      {/* Additional Sections */}
      <div className="mt-16">
        <WhyChooseUs />
        <HowItWorks />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
};

export default Home;