export interface AIRecommendation {
  stress_level: "High" | "Medium" | "Low";
  confidence_score: number;
  feature_importance: {
    feature: string;
    importance: number;
    color?: string;
  }[];
  recommendations: {
    id: string;
    category: string;
    categoryKey: string; // language-agnostic key for icon mapping
    title: string;
    description: string;
    priority: "Cao" | "Trung bình" | "Thấp" | "Cơ bản";
  }[];
  emergency_contact?: string;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

// Multilingual feature labels
const featureLabels: Record<string, Record<'vi' | 'en' | 'de' | 'zh', string>> = {
  anxiety_level:               { vi: 'Mức độ lo âu',      en: 'Anxiety Level',         de: 'Angstniveau',          zh: '焦虑程度' },
  depression:                  { vi: 'Trầm cảm',           en: 'Depression',             de: 'Depression',           zh: '抑郁程度' },
  self_esteem:                 { vi: 'Lòng tự trọng',      en: 'Self Esteem',            de: 'Selbstwertgefühl',     zh: '自我评价' },
  mental_health_history:       { vi: 'Tiền sử tâm lý',     en: 'Mental Health History',  de: 'Psych. Vorgeschichte', zh: '心理疾病史' },
  blood_pressure:              { vi: 'Huyết áp',           en: 'Blood Pressure',         de: 'Blutdruck',            zh: '血压' },
  sleep_quality:               { vi: 'Chất lượng ngủ',     en: 'Sleep Quality',          de: 'Schlafqualität',       zh: '睡眠质量' },
  headache:                    { vi: 'Đau đầu',            en: 'Headache',               de: 'Kopfschmerzen',        zh: '头痛' },
  breathing_problem:           { vi: 'Vấn đề hô hấp',      en: 'Breathing Problems',     de: 'Atemprobleme',         zh: '呼吸困难' },
  study_load:                  { vi: 'Khối lượng học',     en: 'Study Load',             de: 'Studienbelastung',     zh: '学业负担' },
  academic_performance:        { vi: 'Kết quả học',        en: 'Academic Performance',   de: 'Akadem. Leistung',     zh: '学业表现' },
  teacher_student_relationship:{ vi: 'Quan hệ thầy trò',   en: 'Teacher Relationship',   de: 'Lehrer-Verhältnis',    zh: '师生关系' },
  future_career_concerns:      { vi: 'Lo lắng tương lai',  en: 'Career Concerns',        de: 'Zukunftssorgen',       zh: '职业焦虑' },
  social_support:              { vi: 'Hỗ trợ xã hội',     en: 'Social Support',         de: 'Soziale Unterstützung',zh: '社会支持' },
  peer_pressure:               { vi: 'Áp lực bạn bè',     en: 'Peer Pressure',          de: 'Gruppenzwang',         zh: '同辈压力' },
  extracurricular_activities:  { vi: 'Ngoại khóa',         en: 'Extracurricular',        de: 'Außerschulisch',       zh: '课外活动' },
  bullying:                    { vi: 'Bắt nạt',            en: 'Bullying',               de: 'Mobbing',              zh: '霸凌' },
  noise_level:                 { vi: 'Tiếng ồn',           en: 'Noise Level',            de: 'Lärmbelastung',        zh: '噪音' },
  living_conditions:           { vi: 'Điều kiện sống',     en: 'Living Conditions',      de: 'Wohnbedingungen',      zh: '居住条件' },
  safety:                      { vi: 'An toàn',            en: 'Safety',                 de: 'Sicherheit',           zh: '安全感' },
  basic_needs:                 { vi: 'Nhu cầu cơ bản',    en: 'Basic Needs',            de: 'Grundbedürfnisse',     zh: '基本需求' },
};

const featureColors: Record<string, string> = {
  anxiety_level: '#fb7185', depression: '#f43f5e', self_esteem: '#8b5cf6',
  mental_health_history: '#e11d48', blood_pressure: '#ef4444', sleep_quality: '#3b82f6',
  headache: '#f59e0b', breathing_problem: '#06b6d4', study_load: '#8b5cf6',
  academic_performance: '#10b981', teacher_student_relationship: '#14b8a6',
  future_career_concerns: '#f59e0b', social_support: '#ec4899', peer_pressure: '#7c3aed',
  extracurricular_activities: '#2dd4bf', bullying: '#dc2626', noise_level: '#9ca3af',
  living_conditions: '#fcd34d', safety: '#34d399', basic_needs: '#6ee7b7',
};

// Category key mapping for icon selection (language-agnostic)
const categoryKeyMap: Record<string, Record<'vi' | 'en' | 'de' | 'zh', string[]>> = {
  sleep:    { vi: ['Giấc ngủ'], en: ['Sleep'], de: ['Schlaf'], zh: ['睡眠'] },
  study:    { vi: ['Học tập', 'Học thuật'], en: ['Study', 'Academic'], de: ['Studium', 'Lernen'], zh: ['学习', '学业'] },
  social:   { vi: ['Xã hội'], en: ['Social'], de: ['Soziales', 'Sozial'], zh: ['社交', '社会'] },
  exercise: { vi: ['Thể dục', 'Thể chất'], en: ['Exercise', 'Physical'], de: ['Sport', 'Bewegung'], zh: ['运动', '体育'] },
  finance:  { vi: ['Tài chính'], en: ['Finance'], de: ['Finanzen'], zh: ['财务', '经济'] },
  mental:   { vi: ['Tâm lý', 'Sức khỏe tâm thần'], en: ['Mental', 'Psychology'], de: ['Psyche', 'Mental'], zh: ['心理', '精神'] },
};

function getCategoryKey(category: string): string {
  for (const [key, langMap] of Object.entries(categoryKeyMap)) {
    for (const terms of Object.values(langMap)) {
      if (terms.some(t => category.toLowerCase().includes(t.toLowerCase()))) {
        return key;
      }
    }
  }
  return 'general';
}

export async function analyzeSurveyData(data: any, language: 'vi' | 'en' | 'de' | 'zh' = 'vi'): Promise<AIRecommendation> {
  // 1. Get Session ID
  let sessionId = localStorage.getItem('mindscan_session_id');
  if (!sessionId) {
    try {
      const sessRes = await fetch(`${API_BASE}/api/session`, { method: 'POST' });
      const sessJson = await sessRes.json();
      sessionId = sessJson.session_id;
      localStorage.setItem('mindscan_session_id', sessionId!);
    } catch (e) {
      console.error("Session failed, using fallback");
      sessionId = "fallback-session-123";
    }
  }

  // 2. Map frontend formData to backend schema
  let gender = 'other';
  if (data.gender === 'Nam') gender = 'male';
  if (data.gender === 'Nữ') gender = 'female';

  const payload = {
    age: parseInt(data.age) || 20,
    gender: gender,
    // Scale from 0–10 (UI) back to original model training ranges
    anxiety_level: Math.round((Number(data.anxiety_level) / 10) * 21), // 0–10 → 0–21 (GAD-7)
    depression:    Math.round((Number(data.depression)    / 10) * 27), // 0–10 → 0–27 (PHQ-9)
    self_esteem:   Math.round((Number(data.self_esteem)   / 10) * 30), // 0–10 → 0–30 (Rosenberg)
    mental_health_history: data.mental_health_history === 'Có' ? 1 : 0,
    blood_pressure: Number(data.blood_pressure) || 2,
    sleep_quality: Number(data.sleep_quality) || 3,
    headache: Number(data.headache) || 0,
    breathing_problem: Number(data.breathing_problem) || 0,
    study_load: Number(data.study_load) || 3,
    academic_performance: Number(data.academic_performance) || 3,
    teacher_student_relationship: Number(data.teacher_student_relationship) || 3,
    future_career_concerns: Number(data.future_career_concerns) || 3,
    social_support: Number(data.social_support) || 1,
    peer_pressure: Number(data.peer_pressure) || 0,
    extracurricular_activities: Number(data.extracurricular_activities) || 2,
    bullying: Number(data.bullying) || 0,
    noise_level: Number(data.noise_level) || 0,
    living_conditions: Number(data.living_conditions) || 3,
    safety: Number(data.safety) || 3,
    basic_needs: Number(data.basic_needs) || 3,
    language: language
  };

  // 3. Call prediction API
  try {
    let res = await fetch(`${API_BASE}/api/predict?session_id=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 404) {
      console.warn("Session 404. Refreshing session and retrying...");
      const sessRes = await fetch(`${API_BASE}/api/session`, { method: 'POST' });
      const sessJson = await sessRes.json();
      sessionId = sessJson.session_id;
      localStorage.setItem('mindscan_session_id', sessionId!);
      
      res = await fetch(`${API_BASE}/api/predict?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) {
       throw new Error("Backend API Error " + res.status);
    }

    const result = await res.json();
    const p = result.prediction;
    
    // Map numerical stress level to verbal
    const levelStr = p.stress_level === 2 ? "High" : p.stress_level === 1 ? "Medium" : "Low";

    // Convert feature dictionary to array with multilingual labels
    const features = Object.entries(p.feature_importance).map(([k, v]) => {
      const label = featureLabels[k]?.[language] || featureLabels[k]?.['en'] || k;
      const color = featureColors[k] || '#cbd5e1';
      return {
        feature: label,
        importance: Math.round((v as number) * 100),
        color
      };
    });

    // Wrap backend recommendations with language-agnostic categoryKey
    const recs = (p.recommendations || []).map((r: any) => ({
      id: "rec-" + r.reco_id,
      category: r.category || "General",
      categoryKey: getCategoryKey(r.category || ''),
      title: r.title || "Suggestion",
      description: r.description || "",
      priority: "Cơ bản" as const
    }));

    return {
      stress_level: levelStr,
      confidence_score: p.confidence_score,
      feature_importance: features,
      recommendations: recs
    };

  } catch (error) {
    console.error("Failed to call FastAPI Backend:", error);
    const errorLabel = language === 'vi' ? 'Lỗi kết nối' : language === 'de' ? 'Verbindungsfehler' : language === 'zh' ? '连接错误' : 'Connection Error';
    const errorDesc = language === 'vi' ? 'Vui lòng kiểm tra xem Backend server đã chạy chưa.' :
                      language === 'de' ? 'Bitte prüfen Sie, ob der Backend-Server läuft.' :
                      language === 'zh' ? '请检查后端服务器是否正在运行。' :
                      'Please check if the backend server is running.';
    return {
      stress_level: "Medium",
      confidence_score: 0.5,
      feature_importance: [{ feature: errorLabel, importance: 100, color: '#ef4444' }],
      recommendations: [{ id: "1", category: "System", categoryKey: "general", title: errorLabel, description: errorDesc, priority: "Cao" }]
    };
  }
}
