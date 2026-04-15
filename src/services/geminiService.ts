import type { AIRecommendation, FormData } from '../types';

export const analyzeSurveyData = async (formData: FormData, language: string): Promise<AIRecommendation> => {
  // Mock AI response for demo (replace with real Gemini API)
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  const features = [
    { feature: 'sleep_quality', importance: Math.random() * 25 + 10 },
    { feature: 'study_load', importance: Math.random() * 25 + 10 },
    { feature: 'anxiety_level', importance: Math.random() * 25 + 10 },
    { feature: 'social_support', importance: Math.random() * 25 + 10 },
    { feature: 'academic_performance', importance: Math.random() * 15 + 5 },
  ].sort((a, b) => b.importance - a.importance);

  const totalScore = Number(formData.anxiety_level) + Number(formData.depression) + Number(formData.study_load) * 2;
  const stress_level = totalScore > 40 ? 'High' : totalScore > 20 ? 'Medium' : 'Low';
  const confidence_score = 0.85 + Math.random() * 0.15;

  return {
    stress_level,
    confidence_score,
    feature_importance: features.slice(0, 5),
    recommendations: [
      {
        i18n_key: stress_level === 'High' ? 'highStress' : 'sleep',
        category: 'mental'
      }
    ]
  };
};

