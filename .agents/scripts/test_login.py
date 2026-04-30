"""
Diagnosa login issue EDUFIN:
1. Buka halaman login
2. Cek apakah backend bisa dijangkau
3. Coba login demo dan tangkap semua error
"""
from playwright.sync_api import sync_playwright
import json, sys

FRONTEND = "http://localhost:5173"
BACKEND  = "http://127.0.0.1:8000/api"

console_logs = []
network_errs = []
api_responses = []

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context()
        page = ctx.new_page()

        # Tangkap console
        page.on("console", lambda m: console_logs.append(f"[{m.type}] {m.text}"))
        page.on("pageerror", lambda e: console_logs.append(f"[PAGE ERROR] {e}"))

        # Tangkap network
        def on_response(resp):
            if "/api/" in resp.url:
                try:
                    body = resp.json()
                except Exception:
                    body = resp.text()
                api_responses.append({
                    "url": resp.url,
                    "status": resp.status,
                    "body": body
                })
        page.on("response", on_response)

        print("=" * 60)
        print("1. Cek apakah frontend jalan...")
        try:
            page.goto(FRONTEND, timeout=10000)
            page.wait_for_load_state("networkidle", timeout=10000)
            print("   ✅ Frontend OK")
        except Exception as e:
            print(f"   ❌ Frontend GAGAL: {e}")
            browser.close()
            return

        # 2. Cek backend via fetch di browser
        print("2. Cek koneksi ke backend Laravel...")
        result = page.evaluate("""
            async () => {
                try {
                    const r = await fetch('http://127.0.0.1:8000/api/auth/login', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                        body: JSON.stringify({email: 'test@test.com', password: 'wrong'})
                    });
                    return {ok: true, status: r.status, body: await r.json()};
                } catch(e) {
                    return {ok: false, error: e.message};
                }
            }
        """)
        if result.get("ok"):
            print(f"   ✅ Backend RUNNING — status: {result['status']}")
            print(f"      Response: {json.dumps(result['body'], ensure_ascii=False)}")
        else:
            print(f"   ❌ Backend TIDAK BISA DIAKSES: {result.get('error')}")
            print("   → Jalankan: php artisan serve (di folder backend)")
            browser.close()
            return

        # 3. Coba login ke halaman login
        print("3. Navigasi ke /login...")
        page.goto(f"{FRONTEND}/login", timeout=10000)
        page.wait_for_load_state("networkidle", timeout=10000)
        page.screenshot(path="c:/laragon/www/project-edufin/.agents/debug_login_before.png")
        print("   Screenshot disimpan → debug_login_before.png")

        # 4. Isi form login dengan demo donatur
        print("4. Coba login sebagai Donatur (rina@gmail.com)...")
        api_responses.clear()

        page.fill("input[type='email']", "rina@gmail.com")
        page.fill("input[type='password']", "password123")
        page.screenshot(path="c:/laragon/www/project-edufin/.agents/debug_login_filled.png")

        # Klik submit
        page.click("button[type='submit']")
        page.wait_for_timeout(3000)
        page.screenshot(path="c:/laragon/www/project-edufin/.agents/debug_login_after.png")

        print("   API calls yang terjadi:")
        for r in api_responses:
            print(f"   [{r['status']}] {r['url']}")
            print(f"         → {json.dumps(r['body'], ensure_ascii=False)[:200]}")

        current_url = page.url
        print(f"   URL sekarang: {current_url}")

        if "/donor" in current_url or "/student" in current_url or "/school" in current_url:
            print("   ✅ LOGIN BERHASIL! Redirect ke dashboard")
        else:
            # Cari pesan error di halaman
            err_els = page.locator("text=Email atau password").all()
            err_els2 = page.locator("text=tidak bisa terhubung").all()
            err_els3 = page.locator("text=Kata sandi").all()
            if err_els or err_els2 or err_els3:
                print("   ⚠️  Error message tampil di halaman:")
                for el in (err_els + err_els2 + err_els3):
                    print(f"      '{el.text_content()}'")
            else:
                print("   ❌ Login gagal tapi tidak ada pesan error yang terdeteksi")

        # 5. Cek console errors
        if console_logs:
            print("\n5. Console errors:")
            for log in console_logs:
                print(f"   {log}")
        else:
            print("\n5. Tidak ada console error")

        # 6. Coba cek apakah akun demo ada di database
        print("\n6. Cek akun demo via backend...")
        result2 = page.evaluate("""
            async () => {
                const demos = [
                    {email: 'admin@edufin.sch.id', password: 'admin123'},
                    {email: 'hendra@gmail.com', password: 'password123'},
                    {email: 'rina@gmail.com', password: 'password123'},
                ];
                const results = [];
                for (const d of demos) {
                    try {
                        const r = await fetch('http://127.0.0.1:8000/api/auth/login', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                            body: JSON.stringify(d)
                        });
                        const body = await r.json();
                        results.push({email: d.email, status: r.status, success: body.success, msg: body.message});
                    } catch(e) {
                        results.push({email: d.email, error: e.message});
                    }
                }
                return results;
            }
        """)
        print("   Hasil cek akun demo:")
        for r in result2:
            icon = "✅" if r.get("success") else "❌"
            msg = r.get("msg", r.get("error", ""))
            print(f"   {icon} {r['email']} — status {r.get('status','?')} — {msg}")

        browser.close()
        print("\n" + "=" * 60)
        print("Screenshots: .agents/debug_login_*.png")

if __name__ == "__main__":
    run()
