def generate_recommendations(features: dict, stress_level: int) -> list:
    recommendations = []
    extra = features.get('extra_features') or {}

    def get_f(key, default=0):
        return features.get(key, extra.get(key, default))

    # High stress — khuyến nghị khẩn cấp
    if stress_level >= 2:
        recommendations.append({
            "category": "Hỗ trợ khẩn cấp",
            "title": "Tìm kiếm hỗ trợ chuyên nghiệp",
            "description": "Mức độ căng thẳng của bạn đang ở mức cao. Hãy liên hệ đường dây hỗ trợ tâm lý 1800 599 920 hoặc đến phòng tư vấn tâm lý của trường."
        })

    # Giấc ngủ
    sleep = get_f('sleep_hours', 7)
    if sleep < 5:
        recommendations.append({
            "category": "Giấc ngủ",
            "title": "Cải thiện chất lượng giấc ngủ",
            "description": "Bạn đang ngủ dưới 5 tiếng mỗi đêm — điều này ảnh hưởng lớn đến stress. Hãy xây dựng lịch ngủ đều đặn và hạn chế màn hình 1 giờ trước khi ngủ."
        })

    # Học tập
    pressure = get_f('academic_pressure', 0)
    if pressure > 3:
        recommendations.append({
            "category": "Học tập",
            "title": "Quản lý áp lực học tập",
            "description": "Áp lực học tập đang ở mức cao. Hãy tận dụng các nhóm học tập, lên kế hoạch ôn thi sớm và nhớ sắp xếp thời gian nghỉ ngơi hợp lý."
        })

    # Thể chất
    physical = get_f('physical_activity', 5)
    if physical < 2:
        recommendations.append({
            "category": "Thể chất",
            "title": "Tăng cường vận động hàng ngày",
            "description": "Vận động thể chất giải phóng endorphin giúp giảm stress. Hãy dành ít nhất 15–30 phút đi bộ hoặc tập nhẹ mỗi ngày."
        })

    # Tài chính
    financial = get_f('financial_stress', 0)
    if financial > 3:
        recommendations.append({
            "category": "Tài chính",
            "title": "Lập kế hoạch tài chính cá nhân",
            "description": "Áp lực tài chính có thể làm trầm trọng thêm stress. Hãy tìm hiểu về học bổng, hỗ trợ sinh viên hoặc đến gặp phòng công tác sinh viên của trường."
        })

    # Xã hội
    social = get_f('social_activity', 5)
    if social < 2:
        recommendations.append({
            "category": "Xã hội",
            "title": "Duy trì kết nối xã hội",
            "description": "Sự cô lập xã hội làm tăng cảm giác căng thẳng. Hãy tham gia câu lạc bộ, nhóm học tập hoặc dành thời gian với bạn bè ít nhất 2 lần/tuần."
        })

    # Mặc định nếu không có gợi ý nào khớp
    if not recommendations:
        recommendations.append({
            "category": "Học tập",
            "title": "Duy trì lối sống cân bằng",
            "description": "Các chỉ số của bạn đang ở mức ổn. Tiếp tục duy trì thói quen lành mạnh hiện tại và đừng quên nghỉ ngơi đầy đủ!"
        })

    return recommendations

