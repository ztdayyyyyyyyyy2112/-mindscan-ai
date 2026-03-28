with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

dictionaries_code = """        const categoryColors: Record<string, string> = {
          'age': '#a78bfa',
          'gender': '#a78bfa',
          'academic_performance': '#2dd4bf',
          'study_load': '#2dd4bf',
          'teacher_student_relationship': '#2dd4bf',
          'future_career_concerns': '#fb7185',
          'anxiety_level': '#f97316',
          'depression': '#f97316',
          'self_esteem': '#fbbf24',
          'mental_health_history': '#f97316',
          'blood_pressure': '#94a3b8',
          'sleep_quality': '#6ee7b7',
          'headache': '#94a3b8',
          'breathing_problem': '#94a3b8',
          'social_support': '#c084fc',
          'peer_pressure': '#c084fc',
          'extracurricular_activities': '#818cf8',
          'bullying': '#f43f5e',
          'noise_level': '#60a5fa',
          'living_conditions': '#38bdf8',
          'safety': '#38bdf8',
          'basic_needs': '#34d399'
        };

        const featureDisplayNames: Record<string, string> = {
          'age': 'Độ tuổi',
          'gender': 'Giới tính',
          'academic_performance': 'Kết quả học',
          'study_load': 'Khối lượng học',
          'teacher_student_relationship': 'Quan hệ GV-SV',
          'future_career_concerns': 'Áp lực tương lai',
          'anxiety_level': 'Mức độ lo âu',
          'depression': 'Mức độ trầm cảm',
          'self_esteem': 'Lòng tự trọng',
          'mental_health_history': 'Tiền sử tâm lý',
          'blood_pressure': 'Huyết áp',
          'sleep_quality': 'Chất lượng ngủ',
          'headache': 'Đau đầu',
          'breathing_problem': 'Vấn đề hô hấp',
          'social_support': 'Hỗ trợ xã hội',
          'peer_pressure': 'Áp lực ĐTL',
          'extracurricular_activities': 'Ngoại khóa',
          'bullying': 'Bắt nạt',
          'noise_level': 'Tiếng ồn',
          'living_conditions': 'Điều kiện sống',
          'safety': 'An toàn',
          'basic_needs': 'Nhu cầu cơ bản'
        };
"""

cases_code = """      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 1: Thông tin chung & Học tập</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">1. Độ tuổi hiện tại của bạn?</label>
                <input type="number" min="10" max="100" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} placeholder="Ví dụ: 20" className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">2. Giới tính của bạn?</label>
                <div className="flex flex-wrap gap-2">
                  {['Nam', 'Nữ', 'Khác'].map(gender => (
                    <button key={gender} onClick={() => handleInputChange('gender', gender)} className={`px-4 py-2 rounded-full text-sm font-medium border ${formData.gender === gender ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{gender}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">3. Đánh giá kết quả học tập (0 = Rất tệ, 5 = Xuất sắc)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.academic_performance} onChange={(v) => handleInputChange('academic_performance', v)} ariaLabel="Kết quả học tập" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">4. Khối lượng học tập (0 = Rất nhẹ, 5 = Rất nặng)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.study_load} onChange={(v) => handleInputChange('study_load', v)} ariaLabel="Khối lượng học" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">5. Mối quan hệ với giảng viên (0 = Rất tệ, 5 = Rất tốt)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.teacher_student_relationship} onChange={(v) => handleInputChange('teacher_student_relationship', v)} ariaLabel="Quan hệ giảng viên" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">6. Áp lực tương lai/nghề nghiệp (0 = Không, 5 = Cực lớn)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.future_career_concerns} onChange={(v) => handleInputChange('future_career_concerns', v)} ariaLabel="Áp lực tương lai" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 2: Tâm lý & Cảm xúc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">7. Mức độ lo âu (Anxiety: 0 - 21)?</label>
                <CustomSlider min={0} max={21} step={1} value={formData.anxiety_level} onChange={(v) => handleInputChange('anxiety_level', v)} ariaLabel="Lo âu" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>21</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">8. Mức độ trầm cảm (Depression: 0 - 27)?</label>
                <CustomSlider min={0} max={27} step={1} value={formData.depression} onChange={(v) => handleInputChange('depression', v)} ariaLabel="Trầm cảm" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>27</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">9. Sự tự tin (Self Esteem: 0 - 30)?</label>
                <CustomSlider min={0} max={30} step={1} value={formData.self_esteem} onChange={(v) => handleInputChange('self_esteem', v)} ariaLabel="Tự tin" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>30</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">10. Tiền sử bệnh tâm lý?</label>
                <div className="flex gap-4">
                  {['Có', 'Không'].map(opt => (
                    <button key={opt} onClick={() => handleInputChange('mental_health_history', opt)} className={`px-6 py-2 rounded-xl text-sm font-medium border ${formData.mental_health_history === opt ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 3: Thể chất & Sinh lý</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">11. Huyết áp của bạn?</label>
                <select value={formData.blood_pressure} onChange={(e) => handleInputChange('blood_pressure', parseInt(e.target.value))} className="w-full p-3 border border-gray-300 rounded-xl bg-white outline-none">
                  <option value={1}>Thấp (1)</option>
                  <option value={2}>Bình thường (2)</option>
                  <option value={3}>Cao (3)</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">12. Chất lượng giấc ngủ (0 = Tệ nhất, 5 = Tốt nhất)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.sleep_quality} onChange={(v) => handleInputChange('sleep_quality', v)} ariaLabel="Giấc ngủ" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">13. Tần suất đau đầu (0 = Không bao giờ, 5 = Liên tục)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.headache} onChange={(v) => handleInputChange('headache', v)} ariaLabel="Đau đầu" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">14. Khó thở/Hoảng hốt (0 = Không, 5 = Thường xuyên)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.breathing_problem} onChange={(v) => handleInputChange('breathing_problem', v)} ariaLabel="Khó thở" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 4: Xã hội & Cảm xúc</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">15. Hỗ trợ xã hội/gia đình (0 = Không, 3 = Rất nhiều)?</label>
                <CustomSlider min={0} max={3} step={1} value={formData.social_support} onChange={(v) => handleInputChange('social_support', v)} ariaLabel="Hỗ trợ xã hội" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>3</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">16. Áp lực đồng trang lứa (0 = Không, 5 = Quá lớn)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.peer_pressure} onChange={(v) => handleInputChange('peer_pressure', v)} ariaLabel="Áp lực đồng trang lứa" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">17. Hoạt động ngoại khóa (0 = Không, 5 = Rất tích cực)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.extracurricular_activities} onChange={(v) => handleInputChange('extracurricular_activities', v)} ariaLabel="Ngoại khóa" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">18. Bạn có bị bắt nạt không (0 = Không, 5 = Bị khủng hoảng)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.bullying} onChange={(v) => handleInputChange('bullying', v)} ariaLabel="Bị bắt nạt" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-bold text-[#0b132b] mb-6">Nhóm 5: Môi trường & Cuộc sống</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">19. Mức độ tiếng ồn nơi ở (0 = Tĩnh lặng, 5 = Quá ồn)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.noise_level} onChange={(v) => handleInputChange('noise_level', v)} ariaLabel="Tiếng ồn" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">20. Điều kiện sống chung (0 = Rất tệ, 5 = Rất tốt)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.living_conditions} onChange={(v) => handleInputChange('living_conditions', v)} ariaLabel="Điều kiện sống" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">21. Cảm giác an toàn ở nơi ở (0 = Nguy hiểm, 5 = An toàn tuyệt đối)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.safety} onChange={(v) => handleInputChange('safety', v)} ariaLabel="Cảm giác an toàn" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">22. Mức độ đáp ứng nhu cầu cơ bản (0 = Không, 5 = Đầy đủ)?</label>
                <CustomSlider min={0} max={5} step={1} value={formData.basic_needs} onChange={(v) => handleInputChange('basic_needs', v)} ariaLabel="Nhu cầu cơ bản" />
                <div className="flex justify-between text-xs text-gray-600"><span>0</span><span>5</span></div>
              </div>
            </div>
          </motion.div>
        );
"""

new_lines = []
i = 0
while i < len(lines):
    if lines[i].strip() == "const categoryColors: Record<string, string> = {":
        new_lines.append(dictionaries_code)
        # skip until we find '        };' for the second dictionary
        end_idx = i
        count = 0
        while count < 2:
            if lines[end_idx].strip() == '};':
                count += 1
            end_idx += 1
        i = end_idx
        continue
    
    if lines[i].strip() == "case 1:":
        new_lines.append(cases_code)
        # skip until default
        while lines[i].strip() != "default:":
            i += 1
        new_lines.append(lines[i]) # add default line
        i += 1
        continue
        
    new_lines.append(lines[i])
    i += 1

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
