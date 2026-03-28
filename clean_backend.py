import psutil
import os
import signal
import time

killed = 0
for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        cmdline = proc.info.get('cmdline')
        if cmdline and any('uvicorn' in str(arg).lower() for arg in cmdline):
            print(f"Killing PID {proc.info['pid']} - {cmdline}")
            proc.kill()
            killed += 1
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        pass

print(f"Killed {killed} uvicorn processes.")
time.sleep(2)

# Also delete mindscan.db and mindscan_ai.db
db_paths = ["mindscan.db", "backend/mindscan.db", "mindscan_ai.db", "backend/mindscan_ai.db"]
for p in db_paths:
    if os.path.exists(p):
        try:
            os.remove(p)
            print(f"Deleted {p}")
        except Exception as e:
            print(f"Could not delete {p}: {e}")
