import React from 'react';
import { UserPlus, BookOpen, CheckSquare, Award } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: '1',
      title: 'Sign Up',
      description: 'Create your free account in seconds and get instant access to practice tests.',
    },
    {
      icon: BookOpen,
      step: '2',
      title: 'Choose a Test',
      description: 'Browse our extensive collection of tests across various categories and difficulty levels.',
    },
    {
      icon: CheckSquare,
      step: '3',
      title: 'Take the Test',
      description: 'Solve carefully curated questions within the time limit and challenge yourself.',
    },
    {
      icon: Award,
      step: '4',
      title: 'Get Results & Certificate',
      description: 'View detailed performance analysis, earn certificates, and track your progress.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, streamlined process to help you achieve your goals
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative mb-8 last:mb-0">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0">
                      {item.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-1 h-20 bg-blue-300 mt-2"></div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 flex-1 pt-2">
                    <div className="flex items-start gap-4 mb-3">
                      <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed ml-10">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
