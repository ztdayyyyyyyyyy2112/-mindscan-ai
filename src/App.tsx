/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  BarChart2, 
  Leaf, 
  HeartHandshake,
  Share2,
  Mail,
  Heart,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  PhoneCall,
  Info,
  Moon,
  BookOpen,
  Users,
  Activity,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, Pie, Cell, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { analyzeSurveyData, AIRecommendation } from './services/geminiService';

const GaugeChart = ({ level, confidence }: { level: string, confidence: number }) => {
  // Tính toán góc quay (rotation) chi tiết hơn để kim không bị "chết" ở 3 tư thế
  // -90 đến -30 là Low
  // -30 đến 30 là Medium
  // 30 đến 90 là High
  let rotation = 0;
  if (level === 'Low') {
    rotation = -75 + (confidence - 0.5) * 30; // Từ -90 đến -60
  } else if (level === 'Medium') {
    rotation = (confidence - 0.5) * 40; // Từ -20 đến 20
  } else {
    rotation = 75 - (confidence - 0.5) * 30; // Từ 60 đến 90
  }

  const levelText = level === 'Low' ? 'LOW' : level === 'Medium' ? 'MEDIUM' : 'HIGH';
  const levelColor = level === 'Low' ? '#6ee7b7' : level === 'Medium' ? '#fcd34d' : '#fb7185';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-32 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="50%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>
          <path
            d="M 20 90 A 70 70 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <g transform="translate(100, 90)">
            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: rotation }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.25 }}
            >
              <path d="M -4 0 L 0 -66 L 4 0 Z" fill="#334155" filter="url(#shadow)" />
              <circle cx="0" cy="0" r="7" fill="#1e293b" />
              <circle cx="0" cy="0" r="3" fill="#94a3b8" />
            </motion.g>
          </g>
        </svg>
      </div>
      <div className="text-center mt-4">
        <div className="text-lg font-bold text-gray-800">Mức độ Stress Hiện tại: <span style={{ color: levelColor }}>{levelText}</span></div>
        <div className="text-sm text-gray-500">Độ Tự tin (Confidence): {Math.round(confidence * 100)}%</div>
      </div>
    </div>
  );
};

// Fallback palette for history entries that may have been saved without colors
const BAR_FALLBACK_COLORS = ['#6ee7b7','#2dd4bf','#c084fc','#94a3b8','#fb7185','#fbbf24','#60a5fa','#a78bfa'];

const CustomStackedBar = ({ data, height = 'h-12', showLabels = true }: { data: any[], height?: string, showLabels?: boolean }) => {
  const total = data.reduce((sum: number, item: any) => sum + item.importance, 0);
  if (!total) return <div className={`flex w-full ${height} rounded-2xl bg-gray-100`} />;
  return (
    <div className={`flex w-full ${height} rounded-2xl overflow-hidden shadow-sm`}>
      {data.map((item: any, idx: number) => {
        // Use saved color, but fall back to palette if missing or nearly-white
        const color = (!item.color || item.color === '#f3f4f6') ? BAR_FALLBACK_COLORS[idx % BAR_FALLBACK_COLORS.length] : item.color;
        return (
          <div
            key={idx}
            style={{ width: `${(item.importance / total) * 100}%`, backgroundColor: color }}
            className="h-full flex items-center justify-center text-white font-bold text-sm transition-all hover:opacity-90"
            title={`${item.feature}: ${item.importance}%`}
          >
            {showLabels && item.importance > 8 ? item.importance : ''}
          </div>
        );
      })}
    </div>
  );
};

const ActionCard = ({ id, title, description, icon: Icon, colorClass, isBookmarked, onBookmark }: { id: string, title: string, description: string, icon: any, colorClass: string, isBookmarked: boolean, onBookmark: (e: React.MouseEvent) => void, key?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 cursor-pointer relative"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
        <p className={`text-gray-500 text-sm transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
          {description}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button 
          onClick={onBookmark}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          aria-label="Lưu gợi ý"
        >
          {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400 hover:bg-gray-100 transition-colors">
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [hasConsented, setHasConsented] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecommendation | null>(null);
  const [bookmarkedRecs, setBookmarkedRecs] = useState<string[]>([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    // Step 1
    year: '',
    major: '',
    age: '',
    gender: '',
    // Step 2
    gpa: '',
    studyHours: '',
    studyLoad: 3,
    worryLevel: 3,
    // Step 3
    sleepHours: '',
    exercise: '',
    socialActivities: 3,
    // Step 4
    financialPressure: 3,
    mentalHistory: '',
    relationship: '',
    stressLevel: 5,
    // Step 5
    selfEsteem: 5,
    depression: 1,
    headache: 1,
    breathingProblem: 1,
    noiseLevel: 3,
    livingConditions: 3,
    bullying: 'Không',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Storage version — bump this to clear stale data after format changes
    const STORAGE_VERSION = 'v2';
    const storedVersion = localStorage.getItem('mindscan_storage_version');
    if (storedVersion !== STORAGE_VERSION) {
      // Clear old history entries that may have bad color data
      Object.keys(localStorage)
        .filter(k => k.startsWith('mindscan_history_'))
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem('mindscan_storage_version', STORAGE_VERSION);
    }

    let sid = localStorage.getItem('mindscan_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('mindscan_session_id', sid);
    }
    setSessionId(sid);

    const history = localStorage.getItem(`mindscan_history_${sid}`);
    if (history) {
      setSessionHistory(JSON.parse(history));
    } else {
      const dummyHistory = [
        {
          date: '10 Mar 2026',
          stressScore: 30,
          level: 'Low',
          features: [
            { feature: 'Giấc ngủ', importance: 40, color: '#6ee7b7' },
            { feature: 'Học tập', importance: 30, color: '#2dd4bf' },
            { feature: 'Xã hội', importance: 20, color: '#c084fc' },
            { feature: 'Thể chất', importance: 5, color: '#cbd5e1' },
            { feature: 'Tài chính', importance: 5, color: '#fb7185' },
          ]
        },
        {
          date: '12 Mar 2026',
          stressScore: 60,
          level: 'Medium',
          features: [
            { feature: 'Giấc ngủ', importance: 20, color: '#6ee7b7' },
            { feature: 'Học tập', importance: 40, color: '#2dd4bf' },
            { feature: 'Xã hội', importance: 15, color: '#c084fc' },
            { feature: 'Thể chất', importance: 10, color: '#cbd5e1' },
            { feature: 'Tài chính', importance: 15, color: '#fb7185' },
          ]
        }
      ];
      setSessionHistory(dummyHistory);
    }
  }, []);

  const saveToHistory = (result: AIRecommendation) => {
    const newEntry = {
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
      stressScore: result.stress_level === 'High' ? 85 : result.stress_level === 'Medium' ? 50 : 20,
      level: result.stress_level,
      features: result.feature_importance
    };
    setSessionHistory(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(`mindscan_history_${sessionId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const startSurvey = () => {
    setIsSurveyOpen(true);
  };

  const acceptConsent = () => {
    setHasConsented(true);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedRecs(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const nextStep = async () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsAnalyzing(true);
      setIsCompleted(true);
      try {
        const result = await analyzeSurveyData(formData);
        
        // Map from backend English feature keys → display color
        const categoryColors: Record<string, string> = {
          // Sleep-related
          'sleep_hours': '#6ee7b7',
          // Academic-related
          'cgpa': '#2dd4bf',
          'study_hours': '#2dd4bf',
          'academic_pressure': '#2dd4bf',
          'anxiety_level': '#2dd4bf',
          // Social-related
          'social_activity': '#c084fc',
          'relationship_status': '#c084fc',
          // Physical-related
          'physical_activity': '#94a3b8',
          'headache': '#94a3b8',
          'breathing_problem': '#94a3b8',
          // Financial-related
          'financial_stress': '#fb7185',
          // Psychological
          'self_esteem': '#fbbf24',
          'depression': '#f97316',
          'mental_health_history': '#f97316',
          // Environment
          'noise_level': '#60a5fa',
          'living_conditions': '#60a5fa',
          'bullying': '#60a5fa',
          // Demographics
          'age': '#a78bfa',
          'gender': '#a78bfa',
        };

        // Map from backend English feature keys → Vietnamese display label
        const featureDisplayNames: Record<string, string> = {
          'sleep_hours': 'Giấc ngủ',
          'cgpa': 'Điểm GPA',
          'study_hours': 'Giờ học',
          'academic_pressure': 'Áp lực học',
          'anxiety_level': 'Lo lắng',
          'social_activity': 'Xã hội',
          'relationship_status': 'Mối quan hệ',
          'physical_activity': 'Thể chất',
          'headache': 'Đau đầu',
          'breathing_problem': 'Khó thở',
          'financial_stress': 'Tài chính',
          'self_esteem': 'Tự tin',
          'depression': 'Trầm cảm',
          'mental_health_history': 'Tiền sử TT',
          'noise_level': 'Tiếng ồn',
          'living_conditions': 'Môi trường sống',
          'bullying': 'Bắt nạt',
          'age': 'Độ tuổi',
          'gender': 'Giới tính',
        };

        result.feature_importance = result.feature_importance.map(f => ({
          ...f,
          feature: featureDisplayNames[f.feature] || f.feature,
          color: categoryColors[f.feature] || '#94a3b8'
        })) as any;

        setAiResult(result);
        saveToHistory(result);
        if (result.stress_level === 'High') {
          setShowEmergencyModal(true);
        }
      } catch (error) {
        console.error("Error analyzing data:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else setIsSurveyOpen(false);
  };

  // Helper to calculate color based on slider value
  const getSliderColor = (value: number, min: number, max: number) => {
    const percentage = (value - min) / (max - min);
    const hue = (1 - percentage) * 120;
    return `hsl(${hue}, 84%, 50%)`;
  };

  const CustomSlider = ({ min, max, step, value, onChange, size = 'normal', ariaLabel }: { min: number, max: number, step: number, value: number, onChange: (val: number) => void, size?: 'normal' | 'large', ariaLabel: string }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const currentColor = getSliderColor(value, min, max);

    const heightClass = size === 'large' ? 'h-4' : 'h-2';
    const thumbSizeClass = size === 'large' 
      ? '[&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8' 
      : '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5';

    return (
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`w-full appearance-none rounded-full cursor-pointer ${heightClass} ${thumbSizeClass} focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[var(--thumb-color)] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[var(--thumb-color)] transition-all duration-300`}
        style={{
          background: `linear-gradient(to right, ${currentColor} ${percentage}%, #e5e7eb ${percentage}%)`,
          '--thumb-color': currentColor,
        } as React.CSSProperties}
      />
    );
  };

  const renderConsentScreen = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-3xl mx-auto text-left"
    >
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-bold text-[#0b132b] mb-6">Informed Consent & Quyền riêng tư</h2>
      
      <div className="space-y-4 text-gray-600 mb-8 h-64 overflow-y-auto pr-4">
        <p>Chào mừng bạn đến với MindScan AI. Trước khi bắt đầu, vui lòng đọc kỹ các điều khoản sau:</p>
        <h3 className="font-bold text-gray-900 mt-4">1. Mục đích khảo sát</h3>
        <p>Khảo sát này nhằm mục đích thu thập thông tin về thói quen sinh hoạt, học tập và mức độ căng thẳng của sinh viên để hệ thống AI có thể đưa ra các gợi ý cải thiện sức khỏe tâm thần cá nhân hóa.</p>
        
        <h3 className="font-bold text-gray-900 mt-4">2. Bảo mật & Ẩn danh</h3>
        <p>Tất cả dữ liệu của bạn được thu thập hoàn toàn <strong>ẩn danh</strong>. Chúng tôi không yêu cầu tên, email hay Mã số sinh viên (MSSV). Dữ liệu chỉ được sử dụng cho mục đích phân tích cá nhân của bạn trong phiên làm việc này.</p>
        
        <h3 className="font-bold text-gray-900 mt-4">3. Giới hạn của AI</h3>
        <p>MindScan AI là một công cụ sàng lọc sơ bộ dựa trên mô hình học máy. <strong>Kết quả từ hệ thống không thay thế cho chẩn đoán y khoa hoặc lời khuyên từ chuyên gia tâm lý/bác sĩ.</strong></p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button 
          onClick={() => setIsSurveyOpen(false)}
          className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Từ chối & Quay lại
        </button>
        <button 
          onClick={acceptConsent}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          Tôi đồng ý & Bắt đầu
        </button>
      </div>
    </motion.div>
  );

  const renderEmergencyModal = () => (
    <AnimatePresence>
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-lg w-full text-center relative"
          >
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Cảnh báo Khẩn cấp</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Mức độ stress của bạn đang ở mức <strong>rất cao</strong>. Đừng ngần ngại tìm kiếm sự trợ giúp chuyên nghiệp ngay lập tức. Bạn không đơn độc!
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Hotline hỗ trợ tâm lý (24/7)</div>
                  <div className="text-2xl font-bold text-red-600">1800 599 920</div>
                </div>
              </div>
              <a 
                href="tel:1800599920"
                className="block w-full text-center bg-red-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
              >
                Gọi ngay
              </a>
            </div>

            <div className="text-sm text-gray-500 mb-6">
              Hoặc liên hệ <strong>Phòng Tư vấn Tâm lý</strong> của trường tại Phòng A1.102 (Giờ hành chính).
            </div>

            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="text-gray-500 hover:text-gray-800 font-medium underline"
            >
              Tôi đã hiểu và sẽ tìm sự trợ giúp
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 1: Thông tin chung</h2>
            
            <div className="space-y-4">
              <label id="year-label" className="block text-sm font-medium text-gray-800">1. Bạn đang là sinh viên năm mấy?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="year-label">
                {['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5+'].map(year => (
                  <button
                    key={year}
                    role="radio"
                    aria-checked={formData.year === year}
                    onClick={() => handleInputChange('year', year)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.year === year ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="major-select" className="block text-sm font-medium text-gray-800">2. Ngành học của bạn là gì?</label>
              <select 
                id="major-select"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              >
                <option value="">Chọn ngành học...</option>
                <option value="CNTT">Công nghệ thông tin</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Kỹ thuật">Kỹ thuật</option>
                <option value="Y Dược">Y Dược</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="space-y-4">
              <label htmlFor="age-input" className="block text-sm font-medium text-gray-800">3. Độ tuổi hiện tại của bạn?</label>
              <input 
                id="age-input"
                type="number" 
                min="18" max="30"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="18 - 30"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-4">
              <label id="gender-label" className="block text-sm font-medium text-gray-800">4. Giới tính của bạn?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="gender-label">
                {['Nam', 'Nữ', 'Khác'].map(gender => (
                  <button
                    key={gender}
                    role="radio"
                    aria-checked={formData.gender === gender}
                    onClick={() => handleInputChange('gender', gender)}
                    className={`px-6 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.gender === gender ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 2: Học tập & Áp lực</h2>
            
            <div className="space-y-4">
              <label htmlFor="gpa-input" className="block text-sm font-medium text-gray-800">5. Điểm GPA hiện tại của bạn (thang 4.0)?</label>
              <input 
                id="gpa-input"
                type="number" 
                step="0.1" min="0.0" max="4.0"
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                placeholder="Ví dụ: 3.5"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-4">
              <label id="study-hours-label" className="block text-sm font-medium text-gray-800">6. Trung bình bạn dành bao nhiêu tiếng để học ngoài giờ lên lớp mỗi ngày?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="study-hours-label">
                {['<2h', '2-4h', '4-6h', '6-8h', '>8h'].map(hours => (
                  <button
                    key={hours}
                    role="radio"
                    aria-checked={formData.studyHours === hours}
                    onClick={() => handleInputChange('studyHours', hours)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.studyHours === hours ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {hours}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label id="study-load-label" className="block text-sm font-medium text-gray-800">7. Bạn tự đánh giá mức độ áp lực học tập hiện tại như thế nào?</label>
              <div className="px-2">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.studyLoad}
                  onChange={(val) => handleInputChange('studyLoad', val)}
                  ariaLabel="Mức độ áp lực học tập từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium" aria-hidden="true">
                  <span>1 (Rất thấp)</span>
                  <span>5 (Rất cao)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label id="worry-level-label" className="block text-sm font-medium text-gray-800">8. Bạn có thường xuyên lo lắng về kết quả thi cử hoặc sự nghiệp tương lai không?</label>
              <div className="px-2">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.worryLevel}
                  onChange={(val) => handleInputChange('worryLevel', val)}
                  ariaLabel="Mức độ lo lắng từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium" aria-hidden="true">
                  <span>1 (Không bao giờ)</span>
                  <span>5 (Luôn luôn)</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 3: Sức khỏe & Lối sống</h2>
            
            <div className="space-y-4">
              <label id="sleep-hours-label" className="block text-sm font-medium text-gray-800">9. Thời gian ngủ trung bình mỗi đêm của bạn?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="sleep-hours-label">
                {['<4h', '4-5h', '6-7h', '7-8h', '>8h'].map(hours => (
                  <button
                    key={hours}
                    role="radio"
                    aria-checked={formData.sleepHours === hours}
                    onClick={() => handleInputChange('sleepHours', hours)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.sleepHours === hours ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {hours}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label id="exercise-label" className="block text-sm font-medium text-gray-800">10. Tần số tập thể dục của bạn trong tuần?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="exercise-label">
                {['0 ngày', '1-2 ngày', '3-4 ngày', '5+ ngày'].map(freq => (
                  <button
                    key={freq}
                    role="radio"
                    aria-checked={formData.exercise === freq}
                    onClick={() => handleInputChange('exercise', freq)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.exercise === freq ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label id="social-activities-label" className="block text-sm font-medium text-gray-800">11. Mức độ tham gia các hoạt động xã hội hoặc câu lạc bộ?</label>
              <div className="px-2">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.socialActivities}
                  onChange={(val) => handleInputChange('socialActivities', val)}
                  ariaLabel="Mức độ tham gia hoạt động xã hội từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium" aria-hidden="true">
                  <span>1 (Không bao giờ)</span>
                  <span>5 (Rất thường xuyên)</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 4: Tâm lý & Tài chính</h2>
            
            <div className="space-y-4">
              <label id="financial-pressure-label" className="block text-sm font-medium text-gray-800">12. Mức độ áp lực về tài chính (học phí, sinh hoạt phí) bạn đang gặp phải?</label>
              <div className="px-2">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.financialPressure}
                  onChange={(val) => handleInputChange('financialPressure', val)}
                  ariaLabel="Mức độ áp lực tài chính từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium" aria-hidden="true">
                  <span>1 (Rất thấp)</span>
                  <span>5 (Rất cao)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label id="mental-history-label" className="block text-sm font-medium text-gray-800">13. Bạn có từng trải qua hoặc có tiền sử vấn đề sức khỏe tâm thần không?</label>
              <div className="flex gap-4" role="radiogroup" aria-labelledby="mental-history-label">
                {['Có', 'Không'].map(opt => (
                  <button
                    key={opt}
                    role="radio"
                    aria-checked={formData.mentalHistory === opt}
                    onClick={() => handleInputChange('mentalHistory', opt)}
                    className={`px-8 py-3 rounded-xl text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.mentalHistory === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label id="relationship-label" className="block text-sm font-medium text-gray-800">14. Tình trạng mối quan hệ hiện tại của bạn?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="relationship-label">
                {['Độc thân', 'Đang trong mối quan hệ', 'Khác'].map(rel => (
                  <button
                    key={rel}
                    role="radio"
                    aria-checked={formData.relationship === rel}
                    onClick={() => handleInputChange('relationship', rel)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.relationship === rel ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200">
              <label id="stress-level-label" className="block text-base font-bold text-gray-900">15. Tự đánh giá mức độ stress hiện tại của bạn?</label>
              <div className="px-2">
                <CustomSlider 
                  min={1} max={10} step={1}
                  value={formData.stressLevel}
                  onChange={(val) => handleInputChange('stressLevel', val)}
                  size="large"
                  ariaLabel="Mức độ stress hiện tại từ 1 đến 10"
                />
                <div 
                  className="mt-4 text-center text-2xl font-black transition-colors duration-300"
                  style={{ color: getSliderColor(formData.stressLevel, 1, 10) }}
                  aria-live="polite"
                >
                  {formData.stressLevel} / 10
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2 font-medium" aria-hidden="true">
                  <span className="text-green-700">Thoải mái</span>
                  <span className="text-red-700">Cực kỳ áp lực</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 5: Thể chất & Môi trường</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">16. Mức độ tự tin (Self-Esteem) của bạn?</label>
                <CustomSlider min={1} max={10} step={1} value={formData.selfEsteem} onChange={(v) => handleInputChange('selfEsteem', v)} ariaLabel="Self Esteem" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">17. Bạn có hay cảm thấy chán nản, trầm cảm (Depression)?</label>
                <CustomSlider min={1} max={5} step={1} value={formData.depression} onChange={(v) => handleInputChange('depression', v)} ariaLabel="Depression" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">18. Bạn có thường xuyên đau đầu (Headache)?</label>
                <CustomSlider min={1} max={5} step={1} value={formData.headache} onChange={(v) => handleInputChange('headache', v)} ariaLabel="Headache" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">19. Bạn có gặp vấn đề khó thở/hoảng hốt (Breathing Problem)?</label>
                <CustomSlider min={1} max={5} step={1} value={formData.breathingProblem} onChange={(v) => handleInputChange('breathingProblem', v)} ariaLabel="Breathing" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">20. Mức độ tiếng ồn ảnh hưởng tới bạn (Noise Level)?</label>
                <CustomSlider min={1} max={5} step={1} value={formData.noiseLevel} onChange={(v) => handleInputChange('noiseLevel', v)} ariaLabel="Noise" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">21. Đánh giá chất lượng môi trường sống (Living Conditions)?</label>
                 <CustomSlider min={1} max={5} step={1} value={formData.livingConditions} onChange={(v) => handleInputChange('livingConditions', v)} ariaLabel="Living Conditions" />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-gray-800">22. Bạn có từng bị bắt nạt học đường (Bullying) không?</label>
              <div className="flex gap-4">
                {['Có', 'Không'].map(opt => (
                  <button
                    key={opt} onClick={() => handleInputChange('bullying', opt)}
                    className={`px-8 py-3 rounded-xl text-sm font-medium border ${formData.bullying === opt ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-[#0b132b]">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => {setIsSurveyOpen(false); setIsCompleted(false); setCurrentStep(1);}}>Mindscan.ai</div>
          {!isSurveyOpen && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Solutions</a>
              <a href="#" className="hover:text-gray-900 pb-1">Technology</a>
              <a href="#" className="hover:text-gray-900 pb-1">Methodology</a>
              <a href="#" className="hover:text-gray-900 pb-1">Pricing</a>
            </nav>
          )}
        </div>
        {!isSurveyOpen && (
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</a>
            <button 
              onClick={() => setIsSurveyOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {renderEmergencyModal()}
        {!isSurveyOpen ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  RESEARCH-BASED AI
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-[#0b132b]">
                  Student Stress Detection <span className="text-blue-600">&</span> Mental Wellness
                </h1>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  Discover a more balanced academic life. Our smart, supportive technology identifies stress patterns early and provides personalized wellness steps to keep you thriving.
                </p>
                
                <div className="flex flex-wrap items-center gap-6 mb-16">
                  <button 
                    onClick={() => setIsSurveyOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-teal-400 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                  >
                    Start Stress Survey <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-3 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    See how it works
                  </button>
                </div>

                <div className="flex items-center gap-8 text-sm font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="leading-tight">EXPERT<br/>BACKED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span className="leading-tight">100% ANONYMIZED<br/>SURVEY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-500" />
                    <span className="leading-tight">50+ CAMPUS<br/>PARTNERS</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-teal-50 rounded-[3rem] transform translate-x-4 translate-y-4 -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                  alt="Student relaxing in library" 
                  className="rounded-[2.5rem] object-cover w-full h-[600px] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                
                {/* Top Right Floating Badge */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-600">
                  <Leaf className="w-6 h-6" />
                </div>

                {/* Bottom Right Floating Card */}
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-xl max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-xs font-bold tracking-wide text-gray-800">DAILY BALANCE</span>
                  </div>
                  <p className="text-sm text-gray-600">Your wellness index has improved by 22% this week.</p>
                </div>
              </div>
            </section>

            {/* Wellness Tools Section */}
            <section className="bg-gradient-to-b from-white to-[#fafbfc] py-24">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#0b132b]">Supportive Wellness Tools</h2>
                  <p className="text-gray-500 text-lg">
                    We provide the tools you need to understand your mental health and find your perfect balance on campus.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                      <BarChart2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#0b132b]">Stress Insights</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Understand your stressors through 100% anonymous, data-backed surveys designed for students.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#0b132b]">Wellness Paths</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Get tailored recommendations for meditation, study breaks, and campus resources based on your needs.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#0b132b]">Peer & Pro Support</h3>
                    <p className="text-gray-500 leading-relaxed">
                      Quickly connect with student support groups or professional counselors whenever you need a hand.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white pt-12 pb-8">
              <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xl font-bold mb-2 text-[#0b132b]">Mindscan.ai</div>
                  <div className="text-sm text-gray-500">© 2024 Mindscan.ai. Supporting Student Wellness Worldwide.</div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-900">Research Ethics</a>
                  <a href="#" className="hover:text-gray-900">Campus Partners</a>
                  <a href="#" className="hover:text-gray-900">Careers</a>
                </div>

                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </footer>
          </motion.div>
        ) : !hasConsented ? (
          <motion.div 
            key="consent"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-6 py-12"
          >
            {renderConsentScreen()}
          </motion.div>
        ) : (
          <motion.div 
            key="survey"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-6 py-12 max-w-3xl"
          >
            {!isCompleted ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                {/* Progress Bar */}
                <div className="mb-12">
                  <div className="flex justify-between text-sm font-medium text-gray-500 mb-3">
                    <span>Bước {currentStep} / 5</span>
                    <span>{Math.round((currentStep / 5) * 100)}% Hoàn thành</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600 rounded-full"
                      initial={{ width: `${((currentStep - 1) / 5) * 100}%` }}
                      animate={{ width: `${(currentStep / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Survey Content */}
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
                  <button 
                    onClick={prevStep}
                    aria-label="Quay lại bước trước"
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Quay lại
                  </button>
                  <button 
                    onClick={nextStep}
                    aria-label={currentStep === 5 ? 'Hoàn thành khảo sát' : 'Tiếp tục bước tiếp theo'}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    {currentStep === 5 ? 'Hoàn thành' : 'Tiếp tục'} <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
              >
                {isAnalyzing ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-[#0b132b] mb-2">Đang phân tích dữ liệu...</h2>
                    <p className="text-gray-500">Hệ thống AI đang đánh giá mức độ stress và tạo lộ trình cá nhân hóa cho bạn.</p>
                  </div>
                ) : aiResult ? (
                  <div className="text-left w-full max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                    
                    {/* 1. Biểu đồ Gauge */}
                    <div className="mb-12 flex flex-col items-center">
                      <GaugeChart level={aiResult.stress_level} confidence={aiResult.confidence_score} />
                    </div>

                    {/* 2. Biểu đồ Stacked Bar - Yếu tố tác động */}
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Yếu tố tác động (Feature Importance) - Phiên hiện tại</h3>
                      
                      {/* Legend */}
                      <div className="flex flex-wrap justify-center gap-4 mb-4">
                        {aiResult.feature_importance.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            {item.feature}
                          </div>
                        ))}
                      </div>

                      <CustomStackedBar data={aiResult.feature_importance} height="h-16" />
                    </div>

                    {/* 3. Biểu đồ Line/Bar (Lịch sử ẩn danh) */}
                    {sessionHistory.length > 0 && (
                      <div className="mb-12">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Lịch sử ẩn danh (Lịch sử stress)</h3>
                        <div className="space-y-4">
                          {sessionHistory.map((session, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                              <div className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ${
                                session.level === 'High' ? 'bg-red-100 text-red-700' :
                                session.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {session.date}
                              </div>
                              <div className="flex-1">
                                {session.features && <CustomStackedBar data={session.features} height="h-8" showLabels={false} />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Action Cards */}
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Thẻ hành động (Action Cards)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {aiResult.recommendations.slice(0, 4).map((rec, idx) => {
                          let Icon = Moon;
                          let colorClass = 'bg-green-100 text-green-600';
                          
                          if (rec.category === 'Giấc ngủ') { Icon = Moon; colorClass = 'bg-[#a7f3d0] text-[#047857]'; }
                          else if (rec.category === 'Học tập') { Icon = BookOpen; colorClass = 'bg-[#99f6e4] text-[#0f766e]'; }
                          else if (rec.category === 'Xã hội') { Icon = Users; colorClass = 'bg-[#e9d5ff] text-[#7e22ce]'; }
                          else if (rec.category === 'Thể dục' || rec.category === 'Thể chất') { Icon = Activity; colorClass = 'bg-[#e2e8f0] text-[#334155]'; }
                          else if (rec.category === 'Tài chính') { Icon = DollarSign; colorClass = 'bg-[#fecdd3] text-[#be123c]'; }

                          return (
                            <ActionCard 
                              key={rec.id}
                              id={rec.id}
                              title={rec.title}
                              description={rec.description}
                              icon={Icon}
                              colorClass={colorClass}
                              isBookmarked={bookmarkedRecs.includes(rec.id)}
                              onBookmark={(e) => {
                                e.stopPropagation();
                                toggleBookmark(rec.id);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. Disclaimer & Quyền riêng tư */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                      <p>Lời khẳng định kết quả AI này không thay thế chẩn đoán y khoa của chuyên gia. Mục đích của công cụ chỉ là sàng lọc sơ bộ phục vụ giáo dục và nghiên cứu.</p>
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium">
                        <ShieldCheck className="w-4 h-4" />
                        Informed Consent confirmed.
                      </div>
                    </div>

                    <div className="text-center mt-8">
                      <button 
                        onClick={() => {
                          setIsSurveyOpen(false);
                          setIsCompleted(false);
                          setCurrentStep(1);
                          setAiResult(null);
                        }}
                        className="text-gray-500 hover:text-gray-800 font-medium underline underline-offset-4"
                      >
                        Quay lại trang chủ
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0b132b] mb-4">Đã có lỗi xảy ra</h2>
                    <p className="text-gray-500 mb-8">Không thể phân tích dữ liệu lúc này. Vui lòng thử lại sau.</p>
                    <button 
                      onClick={() => {
                        setIsSurveyOpen(false);
                        setIsCompleted(false);
                        setCurrentStep(1);
                        setAiResult(null);
                      }}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Trở về trang chủ
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

