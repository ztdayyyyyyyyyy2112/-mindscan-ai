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

export async function analyzeSurveyData(data: any, language: 'vi' | 'en' | 'de' | 'zh' = 'vi'): Promise<AIRecommendation> {
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

  // 2. Map frontend formData directly to new Backend SurveyInput schema (20 specific features)
  let gender = 'other';
  if (data.gender === 'Nam') gender = 'male';
  if (data.gender === 'Nữ') gender = 'female';

  const payload = {
    age: parseInt(data.age) || 20,
    gender: gender,
    anxiety_level: Number(data.anxiety_level) || 0,
    depression: Number(data.depression) || 0,
    self_esteem: Number(data.self_esteem) || 15,
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
    
    const featureMeta: Record<string, { label: string, color: string }> = {
      anxiety_level: { label: "Mức độ lo âu", color: "#fb7185" },
      depression: { label: "Trầm cảm", color: "#f43f5e" },
      self_esteem: { label: "Lòng tự trọng", color: "#8b5cf6" },
      mental_health_history: { label: "Tiền sử tâm lý", color: "#e11d48" },
      blood_pressure: { label: "Huyết áp", color: "#ef4444" },
      sleep_quality: { label: "Chất lượng ngủ", color: "#3b82f6" },
      headache: { label: "Đau đầu", color: "#f59e0b" },
      breathing_problem: { label: "Vấn đề hô hấp", color: "#06b6d4" },
      study_load: { label: "Khối lượng học", color: "#8b5cf6" },
      academic_performance: { label: "Kết quả học", color: "#10b981" },
      teacher_student_relationship: { label: "Quan hệ thầy trò", color: "#14b8a6" },
      future_career_concerns: { label: "Lo lắng tương lai", color: "#f59e0b" },
      social_support: { label: "Hỗ trợ xã hội", color: "#ec4899" },
      peer_pressure: { label: "Áp lực bạn bè", color: "#8b5cf6" },
      extracurricular_activities: { label: "Ngoại khóa", color: "#2dd4bf" },
      bullying: { label: "Bắt nạt", color: "#dc2626" },
      noise_level: { label: "Tiếng ồn", color: "#9ca3af" },
      living_conditions: { label: "Điều kiện sống", color: "#fcd34d" },
      safety: { label: "An toàn", color: "#34d399" },
      basic_needs: { label: "Nhu cầu cơ bản", color: "#6ee7b7" }
    };

    // Convert feature dictionary to array
    const features = Object.entries(p.feature_importance).map(([k, v]) => {
      const meta = featureMeta[k] || { label: k, color: "#cbd5e1" };
      return {
        feature: meta.label,
        importance: Math.round((v as number) * 100),
        color: meta.color
      };
    });

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
