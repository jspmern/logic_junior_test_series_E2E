import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is Logic Junior aligned to the national curriculum?',
      answer: 'Yes, Logic Junior tests are meticulously aligned with national curriculum standards and follow the latest examination patterns to ensure comprehensive coverage of all required topics.',
    },
    {
      question: 'Is Logic Junior suitable for 11+ preparation?',
      answer: 'Absolutely! Logic Junior offers specialized test series designed specifically for 11+ entrance exams, with difficulty levels ranging from beginner to advanced.',
    },
    {
      question: 'What tests are available on Logic Junior?',
      answer: 'We offer a comprehensive range of tests including Mathematics, English, Reasoning, Science, and General Knowledge. Each category has multiple tests at different difficulty levels.',
    },
    {
      question: 'How accurate are Logic Junior\'s practice tests?',
      answer: 'Our tests are created by subject matter experts and regularly updated based on actual exam patterns. They provide highly accurate simulations of real exams.',
    },
    {
      question: 'How do I know which practice tests my child should take?',
      answer: 'We recommend starting with beginner-level tests and progressively moving to higher difficulties. Our platform also provides personalized recommendations based on performance.',
    },
    {
      question: 'Can I track my progress over time?',
      answer: 'Yes! Our dashboard provides comprehensive analytics showing your performance trends, weak areas, and improvement over time across all tests.',
    },
  ];

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about Logic Junior
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-left font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <p className="text-gray-700 mb-4">
            Can't find your answer?
          </p>
          <a
            href="mailto:support@logicjunior.com"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
