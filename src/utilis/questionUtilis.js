  
const prepareQuestionData = (question = {}) => {
  // Normalize incoming payload to match Question schema
  const {
    courseId,
    questionText,
    questionImage,
    options: rawOptions,
    correctOption,
    explanation: rawExplanation,
    difficulty,
    marks,
    negativeMarks,
    tags,
    active,
    userId
  } = question;

  const normalizedQuestionText = (questionText || '').toString().trim();

  // Options: accept array of strings or objects
  let options = Array.isArray(rawOptions) ? rawOptions.slice() : [];
  options = options
    .map((opt) => {
      if (opt == null) return null;
      if (typeof opt === 'string') return { text: opt.trim(), image: undefined, isCorrect: false };
      const { text: otext, image: oimage, isCorrect: oIsCorrect } = opt;
      return { text: (otext || '').toString().trim(), image: oimage, isCorrect: !!oIsCorrect };
    })
    .filter(Boolean);

  // Mark correct option(s)
  if (correctOption !== undefined && options.length) {
    options = options.map((o) => ({ ...o, isCorrect: false }));
    const mark = (v) => {
      if (v == null) return;
      if (typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v))) {
        const i = Number(v);
        if (i >= 0 && i < options.length) options[i].isCorrect = true;
        return;
      }
      if (typeof v === 'string') {
        const found = options.find((o) => (o.text || '').toLowerCase() === v.toLowerCase());
        if (found) found.isCorrect = true;
      }
    };
    if (Array.isArray(correctOption)) correctOption.forEach(mark);
    else mark(correctOption);
  }

  // Explanation
  let explanation = { text: '', image: undefined };
  if (rawExplanation) {
    if (typeof rawExplanation === 'string') explanation.text = rawExplanation.trim();
    else if (typeof rawExplanation === 'object') {
      explanation.text = (rawExplanation.text || '').toString().trim();
      explanation.image = rawExplanation.image;
    }
  }

  // Tags
  let normalizedTags = [];
  if (Array.isArray(tags)) normalizedTags = tags.map((t) => (t || '').toString().trim()).filter(Boolean);
  else if (typeof tags === 'string') normalizedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);

  const prepared = {
    courseId,
    questionText: normalizedQuestionText,
    questionImage,
    options,
    explanation,
    difficulty,
    marks: marks !== undefined ? Number(marks) : undefined,
    negativeMarks: negativeMarks !== undefined ? Number(negativeMarks) : undefined,
    tags: normalizedTags,
    active: active === undefined ? undefined : !!active,
    userId
  };

  Object.keys(prepared).forEach((k) => prepared[k] === undefined && delete prepared[k]);
  return prepared;
};
const validateQuestionData = (questionData) => {
  const errors = [];
  const { questionText, options, marks, negativeMarks, difficulty } = questionData;
  if (!questionText || questionText.length < 5) {
    errors.push({ field: 'questionText', message: 'Question text must be at least 5 characters long.' });
  }
  if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
    errors.push({ field: 'options', message: 'There must be between 2 and 6 options.' });
  }
  return errors.length > 0 ? errors : null;
}
const prepareUpdateQuestionData = (question = {}) => {
      const allowedFields = [
      "questionText",
      "courseId",
      "questionImage",
      "options",
      "explanation",
      "difficulty",
      "marks",
     "negativeMarks",
     "tags",
     "active",
];
    
    const updateData = {};
    for (const field of allowedFields) {
      if (question[field] !== undefined) {
        let value = question[field];
        if (typeof value === "string") {
          value = value.trim();
        } else if (Array.isArray(value) && field === "options") {
          value = value.map((opt) => ({
            text: opt.text?.trim() || "",
            image: opt.image?.trim() || "",
            isCorrect: !!opt.isCorrect,
          }));
        }

        updateData[field] = value;
      }
    }
    return updateData;
}
module.exports = { prepareQuestionData,validateQuestionData,prepareUpdateQuestionData };
