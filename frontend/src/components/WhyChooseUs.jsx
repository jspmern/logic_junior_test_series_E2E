import React from 'react';
import { CheckCircle, Zap, Users, TrendingUp } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Expert-Crafted Content',
      description: 'Tests designed by industry professionals with years of experience in competitive exams.',
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get detailed explanations and performance analytics immediately after completing each test.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn from thousands of students, share insights, and compare your performance with peers.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Comprehensive analytics dashboard to monitor your improvement over time.',
    },
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Logic Junior
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved their goals with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
