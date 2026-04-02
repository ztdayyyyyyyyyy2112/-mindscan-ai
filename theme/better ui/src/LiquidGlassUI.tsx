import React from 'react';

/**
 * LIQUID GLASS UI COMPONENTS
 * 
 * Hướng dẫn sử dụng cho dự án khác:
 * 1. Cài đặt Tailwind CSS và Lucide React (nếu dùng icon).
 * 2. Thêm các keyframes sau vào file CSS toàn cục (ví dụ: index.css):
 * 
 * @keyframes blob {
 *   0% { transform: translate(0px, 0px) scale(1); }
 *   33% { transform: translate(30px, -50px) scale(1.1); }
 *   66% { transform: translate(-20px, 20px) scale(0.9); }
 *   100% { transform: translate(0px, 0px) scale(1); }
 * }
 * 
 * @keyframes shimmer {
 *   100% { transform: translateX(100%); }
 * }
 * 
 * .animate-blob { animation: blob 7s infinite; }
 * .animate-shimmer { animation: shimmer 2s infinite; }
 * 
 * .animation-delay-2000 { animation-delay: 2s; }
 * .animation-delay-4000 { animation-delay: 4s; }
 */

// --- 1. GlassCard: Thẻ kính lỏng bán trong suốt ---
export const GlassCard = ({ 
  children, 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode, 
  className?: string, 
  onClick?: () => void 
}) => (
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

// --- 2. LiquidButton: Nút bấm hiệu ứng kính lỏng ---
export const LiquidButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "", 
  icon: Icon 
}: {
  children: React.ReactNode,
  onClick?: () => void,
  variant?: 'primary' | 'secondary' | 'outline',
  className?: string,
  icon?: any
}) => {
  const baseStyle = "relative overflow-hidden rounded-full font-semibold px-8 py-4 transition-all duration-300 flex items-center justify-center gap-2 group";
  
  const variants = {
    primary: "bg-white/30 backdrop-blur-2xl text-blue-700 border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:bg-white/40 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-0.5",
    secondary: "bg-black/5 backdrop-blur-2xl text-slate-800 border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.5)] hover:bg-black/10 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:-translate-y-0.5",
    outline: "bg-transparent border-2 border-slate-300/50 text-slate-600 hover:bg-white/20"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {/* Hiệu ứng Shimmer (lấp lánh) khi hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

// --- 3. LiquidBlob: Khối màu chất lỏng chuyển động ở nền ---
export const LiquidBlob = ({ className = "" }: { className?: string }) => (
  <div className={`absolute rounded-full filter blur-[100px] opacity-60 animate-blob ${className}`}></div>
);

// --- Ví dụ sử dụng ---
/*
export const ExampleUsage = () => (
  <div className="relative min-h-screen bg-slate-50 overflow-hidden flex items-center justify-center p-10">
    {/* Nền chất lỏng *\/}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <LiquidBlob className="top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/30" />
      <LiquidBlob className="bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-400/30 animation-delay-2000" />
    </div>

    {/* Nội dung kính lỏng *\/}
    <GlassCard className="max-w-md p-10 z-10">
      <h1 className="text-3xl font-bold mb-4">Liquid Glass UI</h1>
      <p className="text-slate-600 mb-8">Đây là ví dụ về giao diện kính lỏng bán trong suốt với hiệu ứng blur cực mạnh.</p>
      <LiquidButton onClick={() => alert('Clicked!')}>
        Bắt đầu ngay
      </LiquidButton>
    </GlassCard>
  </div>
);
*/
