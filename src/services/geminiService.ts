export interface AIRecommendation {
  stress_level: "High" | "Medium" | "Low";
  confidence_score: number;
  feature_importance: {
    feature: string;
    importance: number;
  }[];
  recommendations: {
    id: string;
    category: string;
    title: string;
    description: string;
    priority: "Cao" | "Trung bình" | "Thấp" | "Cơ bản";
  }[];
  emergency_contact?: string;
}

export async function analyzeSurveyData(data: any): Promise<AIRecommendation> {
  // 1. Get Session ID
  let sessionId = localStorage.getItem('mindscan_session_id');
  if (!sessionId) {
    try {
      const sessRes = await fetch('http://localhost:8080/api/session', { method: 'POST' });
      const sessJson = await sessRes.json();
      sessionId = sessJson.session_id;
      localStorage.setItem('mindscan_session_id', sessionId);
    } catch (e) {
      console.error("Session failed, using fallback");
      sessionId = "fallback-session-123";
    }
  }

  // 2. Map frontend formData to Backend SurveyInput schema
  const cgpa = parseFloat(data.gpa) || 2.5;
  const sleepMap: any = { '<4h': 3, '4-5h': 4.5, '6-7h': 6.5, '7-8h': 7.5, '>8h': 9 };
  const sleep_hours = sleepMap[data.sleepHours] || 6;

  const studyMap: any = { '<2h': 1, '2-4h': 3, '4-6h': 5, '6-8h': 7, '>8h': 9 };
  const study_hours = studyMap[data.studyHours] || 4;
  
  const exerciseMap: any = { '0 ngày': 0, '1-2 ngày': 1.5, '3-4 ngày': 3.5, '5+ ngày': 5 };
  const physical_activity = exerciseMap[data.exercise] || 0;

  let gender = 'other';
  if (data.gender === 'Nam') gender = 'male';
  if (data.gender === 'Nữ') gender = 'female';

  const payload = {
    age: parseInt(data.age) || 20,
    gender: gender,
    cgpa: cgpa,
    sleep_hours: sleep_hours,
    study_hours: study_hours,
    social_activity: data.socialActivities || 3,
    physical_activity: physical_activity,
    academic_pressure: data.studyLoad || 3,
    financial_stress: data.financialPressure || 3,
    mental_health_history: data.mentalHistory === 'Có' ? 1 : 0,
    extra_features: {
      anxiety_level: data.worryLevel || 3,
      self_esteem: data.selfEsteem || 5,
      depression: data.depression || 1,
      headache: data.headache || 1,
      breathing_problem: data.breathingProblem || 1,
      noise_level: data.noiseLevel || 3,
      living_conditions: data.livingConditions || 3,
      bullying: data.bullying === 'Có' ? 1 : 0
    }
  };

  // 3. Call prediction API
  try {
    let res = await fetch(`http://localhost:8080/api/predict?session_id=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 404) {
      console.warn("Session 404. Refreshing session and retrying...");
      const sessRes = await fetch('http://localhost:8080/api/session', { method: 'POST' });
      const sessJson = await sessRes.json();
      sessionId = sessJson.session_id;
      localStorage.setItem('mindscan_session_id', sessionId);
      
      res = await fetch(`http://localhost:8080/api/predict?session_id=${sessionId}`, {
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
    
    // Convert feature dictionary to array
    const features = Object.entries(p.feature_importance).map(([k, v]) => ({
      feature: k,
      importance: Math.round((v as number) * 100)
    }));

    // Wrap backend recommendations
    const recs = (p.recommendations || []).map((r: any) => ({
      id: "rec-" + r.reco_id,
      category: r.category || "Thông tin chung",
      title: r.title || "Gợi ý",
      description: r.description || "",
      priority: "Cơ bản"
    }));

    return {
      stress_level: levelStr,
      confidence_score: p.confidence_score,
      feature_importance: features,
      recommendations: recs
    };

  } catch (error) {
    console.error("Failed to call FastAPI Backend:", error);
    // Fallback UI rendering if backend is offline
    return {
      stress_level: "Medium",
      confidence_score: 0.5,
      feature_importance: [{ feature: "Lỗi kết nối", importance: 100 }],
      recommendations: [{ id: "1", category: "System", title: "Lỗi kết nối", description: "Vui lòng kiểm tra xem Backend server đã chạy chưa.", priority: "Cao" }]
    };
  }
}
