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
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, Pie, Cell, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { analyzeSurveyData, AIRecommendation } from './services/geminiService';

// --- LIQUID DESIGN COMPONENTS ---

const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`
      relative
      bg-white/20 backdrop-blur-3xl 
      border border-white/40 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] 
      rounded-[2rem] overflow-hidden
      ${onClick ? 'cursor-pointer hover:bg-white/30 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] transition-all duration-300' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const LiquidButton = ({ children, onClick, variant = 'primary', className = "", icon: Icon }: any) => {
  const baseStyle = "relative overflow-hidden rounded-full font-semibold px-8 py-4 transition-all duration-300 flex items-center justify-center gap-2 group";
  const variants = {
    primary: "bg-white/30 backdrop-blur-2xl text-blue-700 border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:bg-white/40 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-0.5",
    secondary: "bg-black/5 backdrop-blur-2xl text-slate-800 border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.5)] hover:bg-black/10 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:-translate-y-0.5",
    outline: "bg-transparent border-2 border-slate-300/50 text-slate-600 hover:bg-white/20"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {/* Liquid hover effect overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {Icon && <Icon className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
      </span>
    </button>
  );
};

const LiquidBlob = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob ${className}`}></div>
);

// --- EXISTING COMPONENTS REFACTORED FOR LIQUID DESIGN ---

const GaugeChart = ({ level, confidence }: { level: string, confidence: number }) => {
  const rotation = level === 'Low' ? -60 : level === 'Medium' ? 0 : 60;
  const levelText = level === 'Low' ? 'LOW' : level === 'Medium' ? 'MEDIUM' : 'HIGH';
  const levelColor = level === 'Low' ? '#34d399' : level === 'Medium' ? '#fbbf24' : '#f43f5e';

  return (
    <div className="flex flex-col items-center relative">
      {/* Soft glow behind gauge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-30" style={{ backgroundColor: levelColor }}></div>
      
      <div className="relative w-72 h-36 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feOffset dx="0" dy="4"/>
              <feGaussianBlur stdDeviation="4" result="offset-blur"/>
              <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
              <feFlood floodColor="black" floodOpacity="0.1" result="color"/>
              <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
          </defs>
          {/* Background Track */}
          <path
            d="M 20 90 A 70 70 0 0 1 180 90"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#inset-shadow)"
          />
          {/* Colored Track */}
          <path
            d="M 20 90 A 70 70 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="24"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          {/* Needle */}
          <g transform={`translate(100, 90) rotate(${rotation})`} className="transition-transform duration-1000 ease-out">
            <path d="M -5 0 L 0 -65 L 5 0 Z" fill="#1e293b" className="drop-shadow-md" />
            <circle cx="0" cy="0" r="8" fill="#1e293b" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        </svg>
      </div>
      <div className="text-center mt-2 relative z-10">
        <div className="text-xl font-bold text-gray-800 tracking-tight">Stress Level: <span style={{ color: levelColor }} className="drop-shadow-sm">{levelText}</span></div>
        <div className="text-sm font-medium text-gray-500 mt-1 bg-white/50 px-3 py-1 rounded-full inline-block backdrop-blur-sm">AI Confidence: {Math.round(confidence * 100)}%</div>
      </div>
    </div>
  );
};

const CustomStackedBar = ({ data, height = 'h-14', showLabels = true }: { data: any[], height?: string, showLabels?: boolean }) => {
  const total = data.reduce((sum: number, item: any) => sum + item.importance, 0);
  return (
    <div className={`flex w-full ${height} rounded-2xl overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] bg-gray-100/50 p-1 gap-1 backdrop-blur-sm`}>
      {data.map((item: any, idx: number) => (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${(item.importance / total) * 100}%`, opacity: 1 }}
          transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
          key={idx} 
          style={{ backgroundColor: item.color }}
          className="h-full flex items-center justify-center text-white font-bold text-sm rounded-xl relative overflow-hidden group"
          title={`${item.feature}: ${item.importance}%`}
        >
          {/* Glass reflection effect on bars */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10 drop-shadow-md">
            {showLabels && item.importance > 8 ? `${item.importance}%` : ''}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const ActionCard: React.FC<{ title: string, description: string, icon: any, colorClass: string }> = ({ title, description, icon: Icon, colorClass }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract text color from colorClass (e.g., 'bg-emerald-100 text-emerald-600' -> 'text-emerald-600')
  const textColor = colorClass.split(' ').find(c => c.startsWith('text-')) || 'text-slate-600';

  return (
    <GlassCard 
      onClick={() => setIsExpanded(!isExpanded)}
      className="p-6 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] bg-white/40 backdrop-blur-md relative overflow-hidden`}>
          <Icon className={`w-6 h-6 relative z-10 ${textColor}`} />
        </div>
        <div className="flex-1 pt-1">
          <h4 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">{title}</h4>
          <motion.div 
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 40 }}
            className="overflow-hidden"
          >
            <p className={`text-slate-600 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {description}
            </p>
          </motion.div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors mt-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] ${isExpanded ? 'bg-white/60 text-slate-800' : 'bg-white/30 text-slate-500'}`}>
          <ChevronDown className={`w-5 h-5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </GlassCard>
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
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
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
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsAnalyzing(true);
      setIsCompleted(true);
      try {
        const result = await analyzeSurveyData(formData);
        
        const categoryColors: Record<string, string> = {
          'Giấc ngủ': '#6ee7b7',
          'Học tập': '#2dd4bf',
          'Xã hội': '#c084fc',
          'Thể chất': '#cbd5e1',
          'Tài chính': '#fb7185',
          'Khác': '#f3f4f6'
        };
        
        result.feature_importance = result.feature_importance.map(f => ({
          ...f,
          color: categoryColors[f.feature] || '#f3f4f6'
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
      className="bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] rounded-[2rem] p-8 md:p-12 max-w-3xl mx-auto text-left relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white relative z-10">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight relative z-10">Informed Consent & Quyền riêng tư</h2>
      
      <div className="space-y-4 text-slate-600 mb-10 h-64 overflow-y-auto pr-4 font-medium leading-relaxed relative z-10 custom-scrollbar">
        <p>Chào mừng bạn đến với MindScan AI. Trước khi bắt đầu, vui lòng đọc kỹ các điều khoản sau:</p>
        <h3 className="font-bold text-slate-900 mt-4">1. Mục đích khảo sát</h3>
        <p>Khảo sát này nhằm mục đích thu thập thông tin về thói quen sinh hoạt, học tập và mức độ căng thẳng của sinh viên để hệ thống AI có thể đưa ra các gợi ý cải thiện sức khỏe tâm thần cá nhân hóa.</p>
        
        <h3 className="font-bold text-slate-900 mt-4">2. Bảo mật & Ẩn danh</h3>
        <p>Tất cả dữ liệu của bạn được thu thập hoàn toàn <strong>ẩn danh</strong>. Chúng tôi không yêu cầu tên, email hay Mã số sinh viên (MSSV). Dữ liệu chỉ được sử dụng cho mục đích phân tích cá nhân của bạn trong phiên làm việc này.</p>
        
        <h3 className="font-bold text-slate-900 mt-4">3. Giới hạn của AI</h3>
        <p>MindScan AI là một công cụ sàng lọc sơ bộ dựa trên mô hình học máy. <strong>Kết quả từ hệ thống không thay thế cho chẩn đoán y khoa hoặc lời khuyên từ chuyên gia tâm lý/bác sĩ.</strong></p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-end relative z-10">
        <LiquidButton 
          variant="secondary"
          onClick={() => setIsSurveyOpen(false)}
        >
          Từ chối & Quay lại
        </LiquidButton>
        <LiquidButton 
          onClick={acceptConsent}
        >
          Tôi đồng ý & Bắt đầu
        </LiquidButton>
      </div>
    </motion.div>
  );

  const renderEmergencyModal = () => (
    <AnimatePresence>
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)] rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-400"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Cảnh báo Khẩn cấp</h2>
            <p className="text-slate-600 mb-8 text-lg font-medium leading-relaxed">
              Mức độ stress của bạn đang ở mức <strong>rất cao</strong>. Đừng ngần ngại tìm kiếm sự trợ giúp chuyên nghiệp ngay lập tức. Bạn không đơn độc!
            </p>
            
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100/50 rounded-[2rem] p-6 mb-8 text-left shadow-inner">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-50">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-bold tracking-wide uppercase mb-1">Hotline hỗ trợ (24/7)</div>
                  <div className="text-3xl font-black text-red-600 tracking-tight">1800 599 920</div>
                </div>
              </div>
              <a 
                href="tel:1800599920"
                className="block w-full text-center bg-gradient-to-r from-red-600 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Gọi ngay
              </a>
            </div>

            <div className="text-sm text-slate-500 mb-8 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
              Hoặc liên hệ <strong>Phòng Tư vấn Tâm lý</strong> của trường tại Phòng A1.102 (Giờ hành chính).
            </div>

            <button 
              onClick={() => setShowEmergencyModal(false)}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
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
            className="space-y-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-white">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nhóm 1: Thông tin chung</h2>
            </div>
            
            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="year-label" className="block text-base font-bold text-slate-800 mb-4">1. Bạn đang là sinh viên năm mấy?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="year-label">
                {['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5+'].map(year => (
                  <button
                    key={year}
                    role="radio"
                    aria-checked={formData.year === year}
                    onClick={() => handleInputChange('year', year)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.year === year 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label htmlFor="major-select" className="block text-base font-bold text-slate-800 mb-4">2. Ngành học của bạn là gì?</label>
              <div className="relative">
                <select 
                  id="major-select"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl appearance-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 shadow-sm"
                >
                  <option value="">Chọn ngành học...</option>
                  <option value="CNTT">Công nghệ thông tin</option>
                  <option value="Kinh tế">Kinh tế</option>
                  <option value="Kỹ thuật">Kỹ thuật</option>
                  <option value="Y Dược">Y Dược</option>
                  <option value="Khác">Khác</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label htmlFor="age-input" className="block text-base font-bold text-slate-800 mb-4">3. Độ tuổi hiện tại của bạn?</label>
              <input 
                id="age-input"
                type="number" 
                min="18" max="30"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="18 - 30"
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="gender-label" className="block text-base font-bold text-slate-800 mb-4">4. Giới tính của bạn?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="gender-label">
                {['Nam', 'Nữ', 'Khác'].map(gender => (
                  <button
                    key={gender}
                    role="radio"
                    aria-checked={formData.gender === gender}
                    onClick={() => handleInputChange('gender', gender)}
                    className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                      formData.gender === gender 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
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
            className="space-y-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nhóm 2: Học tập & Áp lực</h2>
            </div>
            
            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label htmlFor="gpa-input" className="block text-base font-bold text-slate-800 mb-4">5. Điểm GPA hiện tại của bạn (thang 4.0)?</label>
              <input 
                id="gpa-input"
                type="number" 
                step="0.1" min="0.0" max="4.0"
                value={formData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                placeholder="Ví dụ: 3.5"
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium text-slate-700 shadow-sm"
              />
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="study-hours-label" className="block text-base font-bold text-slate-800 mb-4">6. Trung bình bạn dành bao nhiêu tiếng để học ngoài giờ lên lớp mỗi ngày?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="study-hours-label">
                {['<2h', '2-4h', '4-6h', '6-8h', '>8h'].map(hours => (
                  <button
                    key={hours}
                    role="radio"
                    aria-checked={formData.studyHours === hours}
                    onClick={() => handleInputChange('studyHours', hours)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 ${
                      formData.studyHours === hours 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-white shadow-[0_4px_15px_rgba(20,184,166,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
                    }`}
                  >
                    {hours}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="study-load-label" className="block text-base font-bold text-slate-800 mb-4">7. Bạn tự đánh giá mức độ áp lực học tập hiện tại như thế nào?</label>
              <div className="px-4 py-6">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.studyLoad}
                  onChange={(val) => handleInputChange('studyLoad', val)}
                  ariaLabel="Mức độ áp lực học tập từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-6 font-bold uppercase tracking-wider" aria-hidden="true">
                  <span>Rất thấp</span>
                  <span>Rất cao</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="worry-level-label" className="block text-base font-bold text-slate-800 mb-4">8. Bạn có thường xuyên lo lắng về kết quả thi cử hoặc sự nghiệp tương lai không?</label>
              <div className="px-4 py-6">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.worryLevel}
                  onChange={(val) => handleInputChange('worryLevel', val)}
                  ariaLabel="Mức độ lo lắng từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-6 font-bold uppercase tracking-wider" aria-hidden="true">
                  <span>Không bao giờ</span>
                  <span>Luôn luôn</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-white">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nhóm 3: Sức khỏe & Lối sống</h2>
            </div>
            
            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="sleep-hours-label" className="block text-base font-bold text-slate-800 mb-4">9. Thời gian ngủ trung bình mỗi đêm của bạn?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="sleep-hours-label">
                {['<4h', '4-5h', '6-7h', '7-8h', '>8h'].map(hours => (
                  <button
                    key={hours}
                    role="radio"
                    aria-checked={formData.sleepHours === hours}
                    onClick={() => handleInputChange('sleepHours', hours)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      formData.sleepHours === hours 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    {hours}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="exercise-label" className="block text-base font-bold text-slate-800 mb-4">10. Tần số tập thể dục của bạn trong tuần?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="exercise-label">
                {['0 ngày', '1-2 ngày', '3-4 ngày', '5+ ngày'].map(freq => (
                  <button
                    key={freq}
                    role="radio"
                    aria-checked={formData.exercise === freq}
                    onClick={() => handleInputChange('exercise', freq)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      formData.exercise === freq 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="social-activities-label" className="block text-base font-bold text-slate-800 mb-4">11. Mức độ tham gia các hoạt động xã hội hoặc câu lạc bộ?</label>
              <div className="px-4 py-6">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.socialActivities}
                  onChange={(val) => handleInputChange('socialActivities', val)}
                  ariaLabel="Mức độ tham gia hoạt động xã hội từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-6 font-bold uppercase tracking-wider" aria-hidden="true">
                  <span>Không bao giờ</span>
                  <span>Rất thường xuyên</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600 rounded-[1.25rem] flex items-center justify-center shadow-inner border border-white">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nhóm 4: Tâm lý & Tài chính</h2>
            </div>
            
            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="financial-pressure-label" className="block text-base font-bold text-slate-800 mb-4">12. Mức độ áp lực về tài chính (học phí, sinh hoạt phí) bạn đang gặp phải?</label>
              <div className="px-4 py-6">
                <CustomSlider 
                  min={1} max={5} step={1}
                  value={formData.financialPressure}
                  onChange={(val) => handleInputChange('financialPressure', val)}
                  ariaLabel="Mức độ áp lực tài chính từ 1 đến 5"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-6 font-bold uppercase tracking-wider" aria-hidden="true">
                  <span>Rất thấp</span>
                  <span>Rất cao</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="mental-history-label" className="block text-base font-bold text-slate-800 mb-4">13. Bạn có từng trải qua hoặc có tiền sử vấn đề sức khỏe tâm thần không?</label>
              <div className="flex gap-4" role="radiogroup" aria-labelledby="mental-history-label">
                {['Có', 'Không'].map(opt => (
                  <button
                    key={opt}
                    role="radio"
                    aria-checked={formData.mentalHistory === opt}
                    onClick={() => handleInputChange('mentalHistory', opt)}
                    className={`px-10 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                      formData.mentalHistory === opt 
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-[0_4px_15px_rgba(147,51,234,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] p-6 rounded-[2rem]">
              <label id="relationship-label" className="block text-base font-bold text-slate-800 mb-4">14. Tình trạng mối quan hệ hiện tại của bạn?</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="relationship-label">
                {['Độc thân', 'Đang trong mối quan hệ', 'Khác'].map(rel => (
                  <button
                    key={rel}
                    role="radio"
                    aria-checked={formData.relationship === rel}
                    onClick={() => handleInputChange('relationship', rel)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                      formData.relationship === rel 
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-[0_4px_15px_rgba(147,51,234,0.3)] border-transparent' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 bg-white/30 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] mt-10">
              <label id="stress-level-label" className="block text-xl font-black text-slate-900 mb-2 text-center tracking-tight">15. Tự đánh giá mức độ stress hiện tại của bạn?</label>
              <p className="text-sm text-slate-500 mb-10 text-center font-medium">Kéo thanh trượt để chọn mức độ từ 1 đến 10</p>
              <div className="px-4">
                <CustomSlider 
                  min={1} max={10} step={1}
                  value={formData.stressLevel}
                  onChange={(val) => handleInputChange('stressLevel', val)}
                  size="large"
                  ariaLabel="Mức độ stress hiện tại từ 1 đến 10"
                />
                <div 
                  className="mt-8 text-center text-4xl font-black transition-colors duration-300 drop-shadow-sm"
                  style={{ color: getSliderColor(formData.stressLevel, 1, 10) }}
                  aria-live="polite"
                >
                  {formData.stressLevel} <span className="text-xl text-slate-400 font-bold">/ 10</span>
                </div>
                <div className="flex justify-between text-sm mt-6 font-bold uppercase tracking-wider" aria-hidden="true">
                  <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Thoải mái</span>
                  <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Cực kỳ áp lực</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans text-[#0f172a] overflow-hidden relative">
      {/* Liquid Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <LiquidBlob className="top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/30" />
        <LiquidBlob className="bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-400/30 animation-delay-2000" />
        <LiquidBlob className="top-[40%] left-[60%] w-[40vw] h-[40vw] bg-teal-400/30 animation-delay-4000" />
        <LiquidBlob className="top-[20%] left-[20%] w-[30vw] h-[30vw] bg-rose-300/20" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="text-2xl font-extrabold tracking-tighter cursor-pointer flex items-center gap-2" onClick={() => {setIsSurveyOpen(false); setIsCompleted(false); setCurrentStep(1);}}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 shadow-inner flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Mindscan.ai
            </div>
            {!isSurveyOpen && (
              <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
                <a href="#" className="text-blue-600">Solutions</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Technology</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Methodology</a>
                <a href="#" className="hover:text-gray-900 transition-colors">Pricing</a>
              </nav>
            )}
          </div>
          {!isSurveyOpen && (
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Sign In</a>
              <LiquidButton onClick={() => setIsSurveyOpen(true)} className="py-2.5 px-6 text-sm">
                Get Started
              </LiquidButton>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!isSurveyOpen ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero Section */}
              <section className="container mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
                <div className="max-w-xl relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
                    className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide mb-8 shadow-sm"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    RESEARCH-BASED AI
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 pb-2"
                  >
                    Student Stress Detection <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">&</span> Mental Wellness
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-lg text-slate-500 mb-10 leading-relaxed font-medium max-w-lg"
                  >
                    Discover a more balanced academic life. Our smart, supportive technology identifies stress patterns early and provides personalized wellness steps to keep you thriving.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex flex-wrap items-center gap-4 mb-16"
                  >
                    <LiquidButton onClick={() => setIsSurveyOpen(true)} icon={ArrowRight}>
                      Start Stress Survey
                    </LiquidButton>
                    <LiquidButton variant="secondary" icon={Play}>
                      See how it works
                    </LiquidButton>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
                    className="flex items-center gap-8 text-sm font-bold text-slate-400"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-slate-300" />
                      <span className="leading-tight">EXPERT<br/>BACKED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-slate-300" />
                      <span className="leading-tight">100% ANONYMIZED<br/>SURVEY</span>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Main Image Container with Glassmorphism */}
                  <div className="relative rounded-[3rem] p-2 bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-[3rem] -z-10 blur-2xl"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                      alt="Student relaxing in library" 
                      className="rounded-[2.5rem] object-cover w-full h-[600px] shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating Elements */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      className="absolute -top-6 -right-6 w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border border-white/50 rotate-12"
                    >
                      <Leaf className="w-7 h-7" />
                    </motion.div>

                    <motion.div 
                      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-12 -left-8"
                    >
                      <GlassCard className="p-5 max-w-[240px]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-inner">
                            <Heart className="w-5 h-5 fill-current" />
                          </div>
                          <span className="text-xs font-extrabold tracking-wider text-slate-800">DAILY BALANCE</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Your wellness index has improved by <span className="text-green-600 font-bold">22%</span> this week.</p>
                      </GlassCard>
                    </motion.div>
                  </div>
                </motion.div>
              </section>

              {/* Wellness Tools Section */}
              <section className="py-24 relative">
                <div className="container mx-auto px-6 relative z-10">
                  <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Supportive Wellness Tools</h2>
                    <p className="text-slate-500 text-lg font-medium">
                      We provide the tools you need to understand your mental health and find your perfect balance on campus.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <GlassCard className="p-8 group">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <BarChart2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900 tracking-tight">Stress Insights</h3>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        Understand your stressors through 100% anonymous, data-backed surveys designed for students.
                      </p>
                    </GlassCard>

                    <GlassCard className="p-8 group">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Leaf className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900 tracking-tight">Wellness Paths</h3>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        Get tailored recommendations for meditation, study breaks, and campus resources based on your needs.
                      </p>
                    </GlassCard>

                    <GlassCard className="p-8 group">
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <HeartHandshake className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900 tracking-tight">Peer & Pro Support</h3>
                      <p className="text-slate-500 leading-relaxed font-medium">
                        Quickly connect with student support groups or professional counselors whenever you need a hand.
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-lg pt-12 pb-8 relative z-10">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="text-xl font-extrabold mb-2 text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" /> Mindscan.ai
                    </div>
                    <div className="text-sm text-slate-500 font-medium">© 2024 Mindscan.ai. Supporting Student Wellness Worldwide.</div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm font-semibold text-slate-500">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Research Ethics</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Campus Partners</a>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : !hasConsented ? (
            <motion.div 
              key="consent"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="container mx-auto px-6 py-12 relative z-10"
            >
              {renderConsentScreen()}
            </motion.div>
          ) : (
            <motion.div 
              key="survey"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="container mx-auto px-6 py-12 max-w-3xl relative z-10"
            >
              {!isCompleted ? (
                <GlassCard className="p-8 md:p-12">
                  {/* Progress Bar */}
                  <div className="mb-12">
                    <div className="flex justify-between text-sm font-bold text-slate-500 mb-4">
                      <span>Bước {currentStep} / 4</span>
                      <span className="text-blue-600">{Math.round((currentStep / 4) * 100)}% Hoàn thành</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full relative"
                        initial={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                        animate={{ width: `${(currentStep / 4) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Survey Content */}
                  <AnimatePresence mode="wait">
                    {renderStepContent()}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={prevStep}
                      aria-label="Quay lại bước trước"
                      className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Quay lại
                    </button>
                    <LiquidButton 
                      onClick={nextStep}
                      aria-label={currentStep === 4 ? 'Hoàn thành khảo sát' : 'Tiếp tục bước tiếp theo'}
                      icon={currentStep === 4 ? CheckCircle2 : ArrowRight}
                    >
                      {currentStep === 4 ? 'Hoàn thành' : 'Tiếp tục'}
                    </LiquidButton>
                  </div>
                </GlassCard>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <GlassCard className="p-16 text-center">
                      <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
                      </div>
                      <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Đang phân tích dữ liệu...</h2>
                      <p className="text-slate-500 font-medium text-lg">Hệ thống AI đang đánh giá mức độ stress và tạo lộ trình cá nhân hóa cho bạn.</p>
                    </GlassCard>
                  ) : aiResult ? (
                    <GlassCard className="p-8 md:p-12 w-full max-w-4xl mx-auto">
                      
                      {/* 1. Biểu đồ Gauge */}
                      <div className="mb-16 flex flex-col items-center">
                        <GaugeChart level={aiResult.stress_level} confidence={aiResult.confidence_score} />
                      </div>

                      {/* 2. Biểu đồ Stacked Bar - Yếu tố tác động */}
                      <div className="mb-16 bg-white/20 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)]">
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-8 text-center tracking-tight">Yếu tố tác động (Feature Importance)</h3>
                        
                        <div className="flex flex-wrap justify-center gap-6 mb-6">
                          {aiResult.feature_importance.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                              <span className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: item.color }}></span>
                              {item.feature}
                            </div>
                          ))}
                        </div>

                        <CustomStackedBar data={aiResult.feature_importance} height="h-16" />
                      </div>

                      {/* 3. Biểu đồ Line/Bar (Lịch sử ẩn danh) */}
                      {sessionHistory.length > 0 && (
                        <div className="mb-16 bg-white/20 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)]">
                          <h3 className="text-2xl font-extrabold text-slate-900 mb-8 text-center tracking-tight">Lịch sử ẩn danh (Lịch sử stress)</h3>
                          <div className="space-y-4">
                            {sessionHistory.map((session, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`px-4 py-2 rounded-xl text-sm font-extrabold whitespace-nowrap shadow-inner ${
                                  session.level === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  session.level === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  {session.date}
                                </div>
                                <div className="flex-1">
                                  {session.features && <CustomStackedBar data={session.features} height="h-10" showLabels={false} />}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Action Cards */}
                      <div className="mb-12">
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-8 text-center tracking-tight">Thẻ hành động (Action Cards)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {aiResult.recommendations.slice(0, 4).map((rec, idx) => {
                            let Icon = Moon;
                            let colorClass = 'bg-emerald-100 text-emerald-600';
                            
                            if (rec.category === 'Giấc ngủ') { Icon = Moon; colorClass = 'bg-indigo-100 text-indigo-600'; }
                            else if (rec.category === 'Học tập') { Icon = BookOpen; colorClass = 'bg-blue-100 text-blue-600'; }
                            else if (rec.category === 'Xã hội') { Icon = Users; colorClass = 'bg-purple-100 text-purple-600'; }
                            else if (rec.category === 'Thể dục' || rec.category === 'Thể chất') { Icon = Activity; colorClass = 'bg-orange-100 text-orange-600'; }
                            else if (rec.category === 'Tài chính') { Icon = DollarSign; colorClass = 'bg-rose-100 text-rose-600'; }

                            return (
                              <ActionCard 
                                key={idx}
                                title={rec.title}
                                description={rec.description}
                                icon={Icon}
                                colorClass={colorClass}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* 5. Disclaimer & Quyền riêng tư */}
                      <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium">
                        <p>MindScan AI là công cụ sàng lọc sơ bộ, KHÔNG thay thế chẩn đoán y khoa.</p>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100">
                          <ShieldCheck className="w-4 h-4" />
                          Informed Consent confirmed.
                        </div>
                      </div>

                      <div className="text-center mt-12">
                        <LiquidButton 
                          variant="secondary"
                          onClick={() => {
                            setIsSurveyOpen(false);
                            setIsCompleted(false);
                            setCurrentStep(1);
                            setAiResult(null);
                          }}
                        >
                          Quay lại trang chủ
                        </LiquidButton>
                      </div>

                    </GlassCard>
                  ) : (
                    <GlassCard className="p-16 text-center">
                      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100">
                        <AlertTriangle className="w-12 h-12" />
                      </div>
                      <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Đã có lỗi xảy ra</h2>
                      <p className="text-slate-500 font-medium text-lg mb-10">Không thể phân tích dữ liệu lúc này. Vui lòng thử lại sau.</p>
                      <LiquidButton 
                        onClick={() => {
                          setIsSurveyOpen(false);
                          setIsCompleted(false);
                          setCurrentStep(1);
                          setAiResult(null);
                        }}
                      >
                        Trở về trang chủ
                      </LiquidButton>
                    </GlassCard>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

