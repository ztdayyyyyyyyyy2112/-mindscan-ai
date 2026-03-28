import { useState } from 'react';
import { motion } from 'motion/react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${isDark ? 'bg-[#1f1f1f]' : 'bg-[#f5f5f5]'}`}>
      
      {/* Container matching the original */}
      <div 
        className={`relative flex flex-col items-center justify-center w-full max-w-[800px] min-h-[500px] rounded-[20px] transition-colors duration-700 border ${isDark ? 'bg-[#1f1f1f] border-black text-white' : 'bg-white border-[#585858] text-black'}`} 
        style={!isDark ? { backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(105, 66, 246, 0.05), rgba(13, 5, 43, 0) 64%)' } : {}}
      >
        
        <div className="absolute top-4 left-4">
          <a href="https://www.elyagol.com/" target="_blank" rel="noreferrer" className="text-sm opacity-50 hover:opacity-100 transition-opacity font-medium">
            Powered by Elyakim Goldfus
          </a>
        </div>

        {/* The Toggle Button */}
        <motion.div 
          className="relative w-[180px] h-[59px] rounded-full border-2 border-white cursor-pointer overflow-hidden flex items-center shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_2px_4px_4px_2px_rgba(2,1,68,0.5),inset_-2px_-2px_2px_rgba(1,0,89,0.5)]"
          animate={{ backgroundColor: isDark ? '#0f172a' : '#236fe9' }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsDark(!isDark)}
        >
          
          {/* Moving Clouds Background (Lottie) - Base Layer */}
          <motion.div 
            className="absolute pointer-events-none z-0"
            style={{ width: '140%', height: '200%', left: '-20%', top: '-50%' }}
            animate={{ opacity: isDark ? 0.6 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Player
              autoplay
              loop
              speed={1.5}
              src="https://cdn.prod.website-files.com/6485b1e6f5eb4dc9ec89e560/6485bab50719867ec6c32ff9_clouds.json"
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>

          {/* Moving Clouds Background (Lottie) - Extra Layer 1 (Dark Mode Only) */}
          <motion.div 
            className="absolute pointer-events-none z-0"
            style={{ width: '250%', height: '250%', left: '-75%', top: '-75%' }}
            animate={{ opacity: isDark ? 0.5 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Player
              autoplay
              loop
              speed={1.2}
              src="https://cdn.prod.website-files.com/6485b1e6f5eb4dc9ec89e560/6485bab50719867ec6c32ff9_clouds.json"
              style={{ width: '100%', height: '100%', transform: 'scale(-0.8, 0.8) translateY(-10%)' }}
            />
          </motion.div>

          {/* Moving Clouds Background (Lottie) - Extra Layer 2 (Dark Mode Only) */}
          <motion.div 
            className="absolute pointer-events-none z-0"
            style={{ width: '300%', height: '300%', left: '-100%', top: '-100%' }}
            animate={{ opacity: isDark ? 0.4 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Player
              autoplay
              loop
              speed={1.8}
              src="https://cdn.prod.website-files.com/6485b1e6f5eb4dc9ec89e560/6485bab50719867ec6c32ff9_clouds.json"
              style={{ width: '100%', height: '100%', transform: 'scale(0.6) translateY(15%)' }}
            />
          </motion.div>

          {/* Night Stars (Lottie) */}
          <motion.div 
            className="absolute left-0 top-0 w-full h-full pointer-events-none z-0"
            animate={{ opacity: isDark ? 1 : 0, y: isDark ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Player
              autoplay
              loop
              src="https://cdn.prod.website-files.com/6485b1e6f5eb4dc9ec89e560/6485bab4d8da4bb319001bbe_stars.json"
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>

          {/* Ripple Effects */}
          <motion.div 
            className="absolute pointer-events-none z-0"
            style={{ left: '30px', top: '50%' }}
            animate={{ x: isDark ? 120 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="absolute w-[100px] h-[100px] bg-white/10 rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
            <div className="absolute w-[160px] h-[160px] bg-white/10 rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
            <div className="absolute w-[220px] h-[220px] bg-white/10 rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
          </motion.div>

          {/* Static Clouds */}
          <motion.div 
            className="absolute bottom-[-30px] left-[-20%] w-[140%] h-[150px] flex flex-col items-center justify-end pointer-events-none z-0"
            animate={{ y: isDark ? 60 : 0, opacity: isDark ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed6_Vectors-Wrapper.svg" 
              className="w-[245px] h-[90px] object-cover absolute bottom-[-10px]" 
              animate={{ x: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 5.33, ease: "easeInOut" }}
              alt="" 
            />
            <motion.img 
              src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed5_Vectors-Wrapper.svg" 
              className="w-[245px] h-[90px] object-cover absolute bottom-[10px]" 
              animate={{ x: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 6.67, ease: "easeInOut" }}
              alt="" 
            />
          </motion.div>

          {/* Glows */}
          <motion.div 
            className="absolute flex items-center justify-center mix-blend-screen pointer-events-none z-0"
            style={{ left: '-60px', top: '50%', transform: 'translateY(-50%)' }}
            animate={{ x: isDark ? 120 : 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <motion.img 
              src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed3_Vectors-Wrapper.svg" 
              className="absolute w-[117px] h-[117px] object-cover" 
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              alt="" 
            />
            <motion.img 
              src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed2_Vectors-Wrapper.svg" 
              className="absolute w-[156px] h-[156px] object-cover" 
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              alt="" 
            />
            <motion.img 
              src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed4_Vectors-Wrapper.svg" 
              className="absolute w-[195px] h-[195px] object-cover" 
              animate={{ scale: [1, 1.02, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              alt="" 
            />
          </motion.div>

          {/* Thumb Wrapper (Sun and Moon) */}
          <div className="absolute inset-0 flex items-center px-[10px] pointer-events-none z-10 w-full h-full">
            <motion.div 
              className="relative w-[40px] h-[40px] rounded-full flex items-center justify-center"
              animate={{ x: isDark ? 120 : 0, rotate: isDark ? 360 : 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {/* Sun */}
              <motion.img 
                src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed0_Vectors-Wrapper.svg" 
                className="absolute w-[40px] h-[40px] rounded-full shadow-[4px_8px_6px_rgba(0,0,0,0.2)] overflow-hidden"
                animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.5 : 1 }}
                transition={{ duration: 0.3 }}
                alt="Sun"
              />
              {/* Moon */}
              <motion.img 
                src="https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/69c773b78211f0dc7da25ed1_Vectors-Wrapper.svg" 
                className="absolute w-[40px] h-[40px] rounded-full overflow-hidden"
                animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
                alt="Moon"
              />
            </motion.div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
