import psutil

for conn in psutil.net_connections(kind='inet'):
    if conn.laddr.port == 8080:
        try:
            p = psutil.Process(conn.pid)
            print(f"Killing process on 8080: {p.pid} ({p.name()})")
            p.kill()
        except Exception as e:
            print(e)
