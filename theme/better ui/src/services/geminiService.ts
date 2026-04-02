import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AIRecommendation {
  stress_level: "High" | "Medium" | "Low";
  confidence_score: number;
  feature_importance: {
    feature: "Giấc ngủ" | "Học tập" | "Xã hội" | "Thể chất" | "Tài chính" | "Khác";
    importance: number;
  }[];
  recommendations: {
    id: string;
    category: "Giấc ngủ" | "Học tập" | "Xã hội" | "Thể dục" | "Tài chính" | "Khác";
    title: string;
    description: string;
    priority: "Cao" | "Trung bình" | "Thấp";
  }[];
  emergency_contact?: string;
}

export async function analyzeSurveyData(data: any): Promise<AIRecommendation> {
  const prompt = `
Nhiệm vụ của bạn là tiếp nhận chỉ số hành vi của sinh viên, kết hợp với kết quả dự đoán từ mô hình Random Forest (bạn sẽ đóng vai trò mô phỏng mô hình này) để đưa ra các phân tích chuyên sâu và gợi ý cải thiện sức khỏe tâm thần cá nhân hóa.

Dữ liệu đầu vào từ khảo sát:
${JSON.stringify(data, null, 2)}

Quy trình Xử lý:
1. Phân loại: Dựa trên dữ liệu, xác định mức độ Stress là Low, Medium, hoặc High.
2. Xác định Rủi ro (Critical Features): Quét qua các biến đầu vào để tìm ra các "điểm đỏ" (ví dụ: sleepHours < 5 hoặc studyLoad >= 4).
3. Tạo Gợi ý: Áp dụng các quy tắc (Rule-based) để đưa ra tối thiểu 3 gợi ý thực tế cho mỗi trường hợp.

Quy tắc Gợi ý Cụ thể:
- Thiếu ngủ (sleepHours < 6 hoặc chọn mức thấp): Tập trung vào vệ sinh giấc ngủ, kỹ thuật tắt màn hình.
- Áp lực học tập cao (studyLoad >= 4): Đề xuất kỹ thuật Pomodoro và chia nhỏ mục tiêu.
- Ít vận động (exercise chọn mức thấp): Khuyến khích đi bộ quanh campus hoặc đăng ký lớp thể dục trường.
- Stress mức HIGH: BẮT BUỘC hiển thị thông tin Hotline 1800 599 920 và yêu cầu gặp chuyên gia.

Ràng buộc Đạo đức & Bảo mật:
- Không định danh: Tuyệt đối không yêu cầu hoặc lưu trữ tên, email, MSSV.
- Disclaimer: Luôn đính kèm thông báo: "Kết quả này chỉ mang tính chất tham khảo, không thay thế chẩn đoán y khoa." (Sẽ được hiển thị ở UI).
- Ngôn ngữ: Sử dụng tiếng Việt thân thiện, hỗ trợ và không gây kỳ thị.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stress_level: {
            type: Type.STRING,
            description: "Mức độ stress: High, Medium, hoặc Low",
          },
          confidence_score: {
            type: Type.NUMBER,
            description: "Độ tin cậy của dự đoán (0.0 - 1.0)",
          },
          feature_importance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                feature: { type: Type.STRING, description: "Phân loại: Giấc ngủ, Học tập, Xã hội, Thể chất, Tài chính, Khác" },
                importance: { type: Type.NUMBER, description: "Mức độ tác động (0 - 100, tổng bằng 100)" }
              },
              required: ["feature", "importance"]
            },
            description: "Danh sách các yếu tố tác động chính đến stress",
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "ID duy nhất cho gợi ý này (ví dụ: rec-1)" },
                category: { type: Type.STRING, description: "Phân loại: Giấc ngủ, Học tập, Xã hội, Thể dục, Tài chính, Khác" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, description: "Mức độ ưu tiên: Cao, Trung bình, Thấp" },
              },
              required: ["id", "category", "title", "description", "priority"],
            },
            description: "Danh sách các gợi ý cải thiện",
          },
          emergency_contact: {
            type: Type.STRING,
            description: "Thông tin liên hệ khẩn cấp (bắt buộc nếu stress_level là High)",
          },
        },
        required: ["stress_level", "confidence_score", "feature_importance", "recommendations"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AIRecommendation;
}
