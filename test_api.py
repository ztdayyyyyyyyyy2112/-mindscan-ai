import urllib.request
import urllib.error
import json

req1 = urllib.request.Request('http://localhost:8080/api/session', method='POST')
with urllib.request.urlopen(req1) as resp1:
    session_id = json.loads(resp1.read().decode())['session_id']

data = { 'age': 20, 'gender': 'male', 'anxiety_level': 5, 'depression': 5, 'self_esteem': 15, 'mental_health_history': 0, 'blood_pressure': 2, 'sleep_quality': 3, 'headache': 0, 'breathing_problem': 0, 'study_load': 3, 'academic_performance': 3, 'teacher_student_relationship': 3, 'future_career_concerns': 3, 'social_support': 1, 'peer_pressure': 0, 'extracurricular_activities': 2, 'bullying': 0, 'noise_level': 0, 'living_conditions': 3, 'safety': 3, 'basic_needs': 3 }
req2 = urllib.request.Request(f'http://localhost:8080/api/predict?session_id={session_id}', data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    resp2 = urllib.request.urlopen(req2)
    print(resp2.read().decode())
except urllib.error.HTTPError as e:
    print('Err:', e.read().decode())
