import http.server
import socketserver
import json
import os
import sys

# Prevent crash when running headless/pythonw where stdout is None
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

PORT = int(os.environ.get("PORT", 8089))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")

# Default initial database for the 3 admins
INITIAL_DATA = {
    "admins": {
        "muhiddin": {
            "id": "muhiddin",
            "nama": "Muhiddin",
            "jabatan": "OS1",
            "divisi": "Service Quality Assurance PUMA Department",
            "periode": "Oktober 2026",
            "rows": [
                {
                    "id": 1,
                    "hariTanggal": "Selasa, 6 Oktober 2026",
                    "rawDate": "2026-10-06",
                    "deskripsi": "Productivity weekly Report Compared Marsma Week 38 Compared data site UME and REM Collect data Azimuth and territory NDM",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 2,
                    "hariTanggal": "Rabu, 7 Oktober 2026",
                    "rawDate": "2026-10-07",
                    "deskripsi": "Productivity weekly Report daily report collect data revenue and payload weekly and monthly level site by request user",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 3,
                    "hariTanggal": "Kamis, 8 Oktober 2026",
                    "rawDate": "2026-10-08",
                    "deskripsi": "Productivity weekly Report Compared Marsma Week 38 , Create Gcell Marsma Mapping KML and KMZ and validate longlate and latitude",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 4,
                    "hariTanggal": "Jumat, 9 Oktober 2026",
                    "rawDate": "2026-10-09",
                    "deskripsi": "Productivity weekly Report Compared Marsma Wekk 38 validate on air date, class revenue, tech, band with ndm cell_name level",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 5,
                    "hariTanggal": "Senin, 12 Oktober 2026",
                    "rawDate": "2026-10-12",
                    "deskripsi": "Productivity weekly Report Compared Marsma Wekk 38 validate class revenue, Anthena Type, and Create Weekly Report W41 PUMA",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 6,
                    "hariTanggal": "Selasa, 20 Oktober 2026",
                    "rawDate": "2026-10-20",
                    "deskripsi": "Productivity weekly Report Compared Marsma Week 42 , Create Gcell Marsma Mapping KML and KMZ and validate BCP site , class revenue",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 7,
                    "hariTanggal": "Rabu, 21 Oktober 2026",
                    "rawDate": "2026-10-21",
                    "deskripsi": "Productivity weekly Report Compared Marsma Week 42 data site UME and REM Collect data Azimuth, territory, departemen and Coverage",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 8,
                    "hariTanggal": "Kamis, 22 Oktober 2026",
                    "rawDate": "2026-10-22",
                    "deskripsi": "Productivity daily report Collect data NDM payload and revenue , Created Marsma Week 43, validation UME Site marsma",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": ""
                }
            ]
        },
        "amin": {
            "id": "amin",
            "nama": "Amin Syahar Hasanuddin",
            "jabatan": "OS1",
            "divisi": "Service Quality Assurance PUMA Department",
            "periode": "Oktober 2026",
            "rows": [
                {
                    "id": 101,
                    "hariTanggal": "Selasa, 6 Oktober 2026",
                    "rawDate": "2026-10-06",
                    "deskripsi": "Monitoring performansi network QoS area Papua & penanganan tiket prioritas",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 102,
                    "hariTanggal": "Kamis, 8 Oktober 2026",
                    "rawDate": "2026-10-08",
                    "deskripsi": "Validasi integrasi data site Maluku & rekapitulasi availability service harian",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                }
            ]
        },
        "tiara": {
            "id": "tiara",
            "nama": "Tiara Syahrani Maulida",
            "jabatan": "OS1",
            "divisi": "Service Quality Assurance PUMA Department",
            "periode": "Oktober 2026",
            "rows": [
                {
                    "id": 201,
                    "hariTanggal": "Rabu, 7 Oktober 2026",
                    "rawDate": "2026-10-07",
                    "deskripsi": "Audit laporan KPI mingguan dan pengecekan threshold payload regional",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                },
                {
                    "id": 202,
                    "hariTanggal": "Jumat, 9 Oktober 2026",
                    "rawDate": "2026-10-09",
                    "deskripsi": "Rekonsiliasi database site UME & pembaharuan matriks eskalasi departemen",
                    "jamMasuk": "18:00",
                    "jamPulang": "22:00",
                    "durasi": 4,
                    "status": "Done"
                }
            ]
        }
    }
}

def ensure_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(INITIAL_DATA, f, indent=2, ensure_ascii=False)

ensure_data_file()

class OvertimeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS for cross-device & tunnel access
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/data":
            ensure_data_file()
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/data":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                parsed = json.loads(post_data.decode("utf-8"))
                with open(DATA_FILE, "w", encoding="utf-8") as f:
                    json.dump(parsed, f, indent=2, ensure_ascii=False)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "message": "Data berhasil disimpan"}).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    ensure_data_file()
    # Use ThreadingHTTPServer for high-performance concurrent multi-admin requests
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), OvertimeRequestHandler) as httpd:
        print(f"Overtime Multi-Admin Server running on port {PORT}...")
        httpd.serve_forever()
