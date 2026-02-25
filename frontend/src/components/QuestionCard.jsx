import React from 'react';

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect }) => {
    // Validate image URL
    const isValidImage = (url) => {
        return url && typeof url === 'string' && url.trim() !== '';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 min-h-[300px] flex flex-col justify-center">
            {/* Question Header (Marks/Numbering can stay in parent or be passed in, for now keeping styling consistent) */}

            {/* Question Content */}
            <div className="mb-8 text-center">
                {/* Question Text */}
                {question.questionText && (
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                        {question.questionText}
                    </h2>
                )}

                {/* Question Image */}
                {isValidImage(question.questionImage) && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={question.questionImage}
                            alt="Question"
                            className="max-h-[220px] max-w-full object-contain rounded-lg border border-gray-100"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}

                {/* Fallback if both missing */}
                {!question.questionText && !isValidImage(question.questionImage) && (
                    <p className="text-gray-400 italic">Content not available</p>
                )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const hasImage = isValidImage(option.image);

                    return (
                        <div
                            key={index}
                            onClick={() => onAnswerSelect(index)}
                            className={`
                relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                min-h-[140px] group
                ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'}
              `}
                        >
                            {/* Selection Indicator (Radio circle style) */}
                            <div className={`absolute top-4 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>

                            {/* Option Content */}
                            <div className="flex flex-col items-center text-center w-full mt-2">
                                {/* Text always on top if image exists, otherwise centered */}
                                {option.text && (
                                    <span className={`text-gray-900 font-medium ${hasImage ? 'mb-3' : ''}`}>
                                        {option.text}
                                    </span>
                                )}

                                {/* Option Image */}
                                {hasImage && (
                                    <img
                                        src={option.image}
                                        alt={`Option ${index + 1}`}
                                        className="h-[120px] w-full object-contain rounded-md"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionCard;
