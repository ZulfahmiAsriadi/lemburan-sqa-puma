import subprocess
import re
import time
import os
import sys
import socket

# Prevent crash when running headless/pythonw
if sys.stdout is None:
    try:
        sys.stdout = open(os.devnull, "w")
    except:
        pass
if sys.stderr is None:
    try:
        sys.stderr = open(os.devnull, "w")
    except:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCRATCH_DIR = os.path.dirname(BASE_DIR)
CF_EXE = os.path.join(SCRATCH_DIR, "cloudflared.exe")
URL_FILE = os.path.join(BASE_DIR, "public_url.txt")
SERVER_PY = os.path.join(BASE_DIR, "server.py")
LOG_FILE = os.path.join(BASE_DIR, "server_online.log")

CREATE_NO_WINDOW = 0x08000000

def log(msg):
    ts = time.strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{ts} {msg}"
    try:
        print(line, flush=True)
    except:
        pass
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except:
        pass

def main():
    # Socket lock to guarantee single instance without stale PID issues
    lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        lock_socket.bind(('127.0.0.1', 8090))
    except socket.error:
        log("Service start_online sudah aktif di latar belakang (Port 8090 terkunci).")
        sys.exit(0)

    log("=====================================================")
    log("Memulai Service Lemburan Admin Online (Background)...")
    log("=====================================================")

    # 1. Start Server Backend
    log("[1/2] Memastikan Server Backend Aktif di Port 8089...")
    server_proc = None
    server_ready = False
    for attempt in range(5):
        try:
            import urllib.request
            urllib.request.urlopen("http://127.0.0.1:8089/", timeout=1)
            log("Server lokal sudah berjalan di port 8089.")
            server_ready = True
            break
        except:
            if attempt == 0:
                log("Menjalankan server.py...")
                py_bin = sys.executable.replace("pythonw.exe", "python.exe")
                if not os.path.exists(py_bin):
                    py_bin = sys.executable
                server_proc = subprocess.Popen(
                    [py_bin, SERVER_PY],
                    cwd=BASE_DIR,
                    creationflags=CREATE_NO_WINDOW if os.name == 'nt' else 0
                )
            time.sleep(1.5)

    if not server_ready:
        log("Server lokal aktif dan siap melayani permintaan.")

    # 2. Start Cloudflare Tunnel with auto-restart on disconnect
    if os.path.exists(URL_FILE):
        try:
            os.remove(URL_FILE)
        except:
            pass

    log("[2/2] Membuka Akses Online Publik via Cloudflare Tunnel...")

    def run_tunnel_loop():
        while True:
            log("Menghubungkan tunnel Cloudflare...")
            cf_cmd = [CF_EXE, "tunnel", "--url", "http://127.0.0.1:8089", "--no-autoupdate"]
            cf_proc = subprocess.Popen(
                cf_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
                creationflags=CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            found_url = None

            try:
                while True:
                    line = cf_proc.stdout.readline()
                    if not line:
                        if cf_proc.poll() is not None:
                            log("Tunnel terputus, menginisiasi ulang dalam 3 detik...")
                            break
                        time.sleep(0.1)
                        continue

                    clean = line.strip()
                    m = re.search(r'https://[a-zA-Z0-9\-]+\.trycloudflare\.com', clean)
                    if m and not found_url:
                        found_url = m.group(0)
                        with open(URL_FILE, "w", encoding="utf-8") as f:
                            f.write(found_url)
                        log("="*65)
                        log(">>> LINK ONLINE AKTIF SEKARANG: " + found_url)
                        log("="*65)
            except Exception as e:
                log(f"Error in tunnel loop: {e}")
            finally:
                try:
                    cf_proc.terminate()
                except:
                    pass
            time.sleep(3)

    try:
        run_tunnel_loop()
    except KeyboardInterrupt:
        log("Service dihentikan oleh user (KeyboardInterrupt).")
    except Exception as e:
        log(f"Fatal exception: {e}")
    finally:
        if server_proc:
            try:
                server_proc.terminate()
            except:
                pass
        try:
            lock_socket.close()
        except:
            pass

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"Crash at root: {e}")
