/**
 * src/config/mockApi.ts
 *
 * Mock API engine — mensimulasikan seluruh backend Laravel menggunakan
 * localStorage sebagai database. Aktif otomatis jika backend tidak bisa
 * dijangkau (VITE_MOCK_API=true atau backend ERR_CONNECTION_REFUSED).
 *
 * Data tersimpan di localStorage key: "edufin_mock_db"
 */

// ─── Types ────────────────────────────────────────────────────────────────────
interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;  // plaintext untuk demo (no bcrypt di browser)
  role: string;
  avatar?: string;
  nisn?: string;
}

interface MockStudent {
  id: number;
  nisn: string;
  name: string;
  school_name: string;
  class_name: string;
  address: string;
  parent_id: number | null;
}

interface MockBill {
  id: number;
  student_id: number;
  type: string;
  amount: number;
  due_date: string;
  status: "unpaid" | "paid" | "overdue";
  description: string;
  month: string;
}

interface MockCampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  collected_amount: number;
  type: string;
  status: string;
  image_url: string;
  deadline: string;
  created_at: string;
}

interface MockDonation {
  id: number;
  campaign_id: number;
  donor_id: number;
  amount: number;
  message?: string;
  created_at: string;
}

interface MockPayment {
  id: number;
  user_id: number;
  bill_id: number;
  amount: number;
  status: string;
  payment_url?: string;
  created_at: string;
}

interface MockDB {
  users: MockUser[];
  students: MockStudent[];
  bills: MockBill[];
  campaigns: MockCampaign[];
  donations: MockDonation[];
  payments: MockPayment[];
  tokens: Record<string, number>; // token → user_id
  nextId: Record<string, number>;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
function seedDB(): MockDB {
  return {
    nextId: { users: 10, students: 5, bills: 20, campaigns: 5, donations: 10, payments: 10 },
    tokens: {},
    users: [
      { id: 1, name: "Admin Sekolah",   email: "admin@edufin.sch.id", password: "admin123",    role: "admin_sekolah" },
      { id: 2, name: "Hendra Santoso",  email: "hendra@gmail.com",    password: "password123", role: "parent" },
      { id: 3, name: "Rina Kusuma",     email: "rina@gmail.com",      password: "password123", role: "donor" },
    ],
    students: [
      { id: 1, nisn: "1234567890", name: "Budi Santoso",  school_name: "SMA Edufin",  class_name: "X IPA 1", address: "Jl. Merdeka 10", parent_id: 2 },
      { id: 2, nisn: "0987654321", name: "Ani Santoso",   school_name: "SMA Edufin",  class_name: "XII IPS",  address: "Jl. Merdeka 10", parent_id: 2 },
      { id: 3, nisn: "1111111111", name: "Cici Kurniawan", school_name: "SMA Edufin", class_name: "XI IPA 2", address: "Jl. Kebon 5",   parent_id: null },
    ],
    bills: [
      { id: 1, student_id: 1, type: "SPP",      amount: 200000, due_date: "2026-05-15", status: "unpaid", description: "SPP Mei 2026",      month: "2026-05" },
      { id: 2, student_id: 1, type: "Seragam",  amount: 350000, due_date: "2026-04-30", status: "overdue", description: "Biaya Seragam",    month: "2026-04" },
      { id: 3, student_id: 2, type: "SPP",      amount: 200000, due_date: "2026-05-15", status: "paid",    description: "SPP Mei 2026",      month: "2026-05" },
      { id: 4, student_id: 1, type: "Kegiatan", amount: 150000, due_date: "2026-05-20", status: "unpaid",  description: "Biaya Ekstrakurikuler", month: "2026-05" },
      { id: 5, student_id: 1, type: "SPP",      amount: 200000, due_date: "2026-04-15", status: "paid",    description: "SPP April 2026",    month: "2026-04" },
    ],
    campaigns: [
      { id: 1, title: "Beasiswa Siswa Berprestasi", description: "Membantu siswa berprestasi yang kurang mampu agar tetap bisa melanjutkan pendidikan mereka.", target_amount: 5000000,  collected_amount: 3200000, type: "beasiswa", status: "active", image_url: "", deadline: "2026-06-30", created_at: "2026-01-01" },
      { id: 2, title: "Renovasi Perpustakaan",       description: "Dana untuk renovasi dan penambahan koleksi buku perpustakaan sekolah.", target_amount: 10000000, collected_amount: 6500000, type: "fasilitas", status: "active", image_url: "", deadline: "2026-07-31", created_at: "2026-02-01" },
      { id: 3, title: "Bantuan Bencana Alam",        description: "Donasi untuk siswa yang terdampak bencana alam dan membutuhkan bantuan segera.", target_amount: 3000000,  collected_amount: 1800000, type: "darurat",   status: "active", image_url: "", deadline: "2026-05-31", created_at: "2026-03-01" },
    ],
    donations: [
      { id: 1, campaign_id: 1, donor_id: 3, amount: 500000,  message: "Semangat belajar!", created_at: "2026-04-01" },
      { id: 2, campaign_id: 2, donor_id: 3, amount: 1000000, message: "Sukses!",            created_at: "2026-04-10" },
    ],
    payments: [
      { id: 1, user_id: 2, bill_id: 3, amount: 200000, status: "paid", created_at: "2026-04-15" },
      { id: 2, user_id: 2, bill_id: 5, amount: 200000, status: "paid", created_at: "2026-03-15" },
    ],
  };
}

// ─── DB Helpers ───────────────────────────────────────────────────────────────
const DB_KEY = "edufin_mock_db";

function getDB(): MockDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const fresh = seedDB();
  localStorage.setItem(DB_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveDB(db: MockDB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function nextId(db: MockDB, table: string): number {
  db.nextId[table] = (db.nextId[table] || 1) + 1;
  return db.nextId[table];
}

function makeToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getUserByToken(db: MockDB, req: RequestInit): MockUser | null {
  const auth = (req.headers as Record<string, string>)?.["Authorization"] || "";
  const token = auth.replace("Bearer ", "").trim();
  const userId = db.tokens[token];
  return db.users.find(u => u.id === userId) ?? null;
}

// ─── Route Handlers ───────────────────────────────────────────────────────────
type Handler = (body: Record<string, unknown>, db: MockDB, req: RequestInit) => Response;

const handlers: Record<string, Record<string, Handler>> = {

  // POST /auth/login
  "POST /auth/login": (body, db) => {
    const user = db.users.find(u => u.email === body.email && u.password === body.password);
    if (!user) return jsonResponse({ success: false, message: "Email atau password salah." }, 401);
    const token = makeToken();
    db.tokens[token] = user.id;
    saveDB(db);
    return jsonResponse({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  },

  // POST /auth/register
  "POST /auth/register": (body, db) => {
    if (db.users.find(u => u.email === body.email)) {
      return jsonResponse({ success: false, message: "Email sudah terdaftar.", errors: { email: ["Email sudah terdaftar."] } }, 422);
    }
    if (body.role === "parent" && body.nisn) {
      const student = db.students.find(s => s.nisn === body.nisn);
      if (!student) return jsonResponse({ success: false, message: "NISN tidak valid." }, 422);
      if (student.parent_id) return jsonResponse({ success: false, message: "NISN sudah terhubung ke akun lain." }, 409);
    }
    const id = nextId(db, "users");
    const newUser: MockUser = { id, name: String(body.name), email: String(body.email), password: String(body.password), role: String(body.role) };
    db.users.push(newUser);
    if (body.role === "parent" && body.nisn) {
      const student = db.students.find(s => s.nisn === body.nisn);
      if (student) student.parent_id = id;
    }
    const token = makeToken();
    db.tokens[token] = id;
    saveDB(db);
    return jsonResponse({ success: true, token, user: { id, name: newUser.name, email: newUser.email, role: newUser.role } }, 201);
  },

  // GET /auth/me
  "GET /auth/me": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    return jsonResponse({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  },

  // POST /auth/logout
  "POST /auth/logout": (_, db, req) => {
    const auth = (req.headers as Record<string, string>)?.["Authorization"] || "";
    const token = auth.replace("Bearer ", "").trim();
    delete db.tokens[token];
    saveDB(db);
    return jsonResponse({ success: true, message: "Logout berhasil." });
  },

  // POST /auth/lookup-nisn
  "POST /auth/lookup-nisn": (body, db) => {
    const student = db.students.find(s => s.nisn === body.nisn);
    if (!student) return jsonResponse({ found: false, message: "NISN tidak ditemukan." }, 404);
    const parent = student.parent_id ? db.users.find(u => u.id === student.parent_id) : null;
    return jsonResponse({ found: true, data: { nisn: student.nisn, name: student.name, school: student.school_name, class: student.class_name, parentName: parent?.name ?? "-", address: student.address } });
  },

  // GET /student/my-students
  "GET /student/my-students": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const students = db.students.filter(s => s.parent_id === user.id);
    return jsonResponse({ students });
  },

  // GET /student/bills
  "GET /student/bills": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const myStudents = db.students.filter(s => s.parent_id === user.id).map(s => s.id);
    const bills = db.bills
      .filter(b => myStudents.includes(b.student_id))
      .map(b => {
        const student = db.students.find(s => s.id === b.student_id);
        return { ...b, student_name: student?.name, school_name: student?.school_name };
      });
    const summary = {
      total: bills.reduce((s, b) => s + b.amount, 0),
      paid:  bills.filter(b => b.status === "paid").reduce((s, b) => s + b.amount, 0),
      unpaid: bills.filter(b => b.status !== "paid").reduce((s, b) => s + b.amount, 0),
    };
    return jsonResponse({ bills, summary });
  },

  // GET /payment/history
  "GET /payment/history": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const payments = db.payments
      .filter(p => p.user_id === user.id)
      .map(p => {
        const bill = db.bills.find(b => b.id === p.bill_id);
        return { ...p, bill_description: bill?.description, bill_type: bill?.type };
      })
      .sort((a, b) => b.id - a.id);
    return jsonResponse({ payments });
  },

  // POST /payment/create
  "POST /payment/create": (body, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const bill = db.bills.find(b => b.id === Number(body.bill_id));
    if (!bill) return jsonResponse({ message: "Tagihan tidak ditemukan." }, 404);
    const id = nextId(db, "payments");
    const payment: MockPayment = { id, user_id: user.id, bill_id: bill.id, amount: bill.amount, status: "paid", payment_url: "#mock-payment", created_at: new Date().toISOString() };
    db.payments.push(payment);
    bill.status = "paid";
    saveDB(db);
    return jsonResponse({ success: true, payment, payment_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-token" });
  },

  // GET /campaigns
  "GET /campaigns": (_, db) => {
    return jsonResponse({ campaigns: db.campaigns, data: db.campaigns });
  },

  // GET /campaigns/:id — handled separately

  // POST /campaigns/:id/donate
  "POST /campaigns/:id/donate": (body, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const campaignId = Number(body._campaignId);
    const campaign = db.campaigns.find(c => c.id === campaignId);
    if (!campaign) return jsonResponse({ message: "Kampanye tidak ditemukan." }, 404);
    const id = nextId(db, "donations");
    const donation: MockDonation = { id, campaign_id: campaignId, donor_id: user.id, amount: Number(body.amount), message: String(body.message || ""), created_at: new Date().toISOString() };
    db.donations.push(donation);
    campaign.collected_amount += donation.amount;
    saveDB(db);
    return jsonResponse({ success: true, donation, payment_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/mock-donate" });
  },

  // GET /school/dashboard
  "GET /school/dashboard": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const totalStudents = db.students.length;
    const totalBills = db.bills.length;
    const paidBills = db.bills.filter(b => b.status === "paid").length;
    const totalRevenue = db.payments.reduce((s, p) => s + p.amount, 0);
    const pendingBills = db.bills.filter(b => b.status !== "paid");
    return jsonResponse({ stats: { total_students: totalStudents, total_bills: totalBills, paid_bills: paidBills, total_revenue: totalRevenue, pending_bills: pendingBills.length, collection_rate: totalBills ? Math.round((paidBills / totalBills) * 100) : 0 }, recent_bills: db.bills.slice(0, 5) });
  },

  // GET /school/students
  "GET /school/students": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const students = db.students.map(s => {
      const parent = s.parent_id ? db.users.find(u => u.id === s.parent_id) : null;
      return { ...s, parent_name: parent?.name ?? "Belum ada" };
    });
    return jsonResponse({ students });
  },

  // GET /school/bills
  "GET /school/bills": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    const bills = db.bills.map(b => {
      const student = db.students.find(s => s.id === b.student_id);
      return { ...b, student_name: student?.name };
    });
    return jsonResponse({ bills });
  },

  // GET /school/payments
  "GET /school/payments": (_, db, req) => {
    const user = getUserByToken(db, req);
    if (!user) return jsonResponse({ message: "Unauthenticated." }, 401);
    return jsonResponse({ payments: db.payments });
  },
};

// ─── Main Router ──────────────────────────────────────────────────────────────
export function mockFetch(endpoint: string, options: RequestInit = {}): Response {
  const method  = (options.method || "GET").toUpperCase();
  const db      = getDB();
  let   body: Record<string, unknown> = {};

  try {
    if (options.body && typeof options.body === "string") {
      body = JSON.parse(options.body);
    }
  } catch { /* ignore */ }

  // Dynamic routes: /campaigns/:id and /campaigns/:id/donate
  const campaignShowMatch  = endpoint.match(/^\/campaigns\/(\d+)$/);
  const campaignDonateMatch = endpoint.match(/^\/campaigns\/(\d+)\/donate$/);
  const aidApproveMatch    = endpoint.match(/^\/school\/aid-requests\/(\d+)\/(approve|reject)$/);

  if (campaignShowMatch) {
    const campaign = db.campaigns.find(c => c.id === Number(campaignShowMatch[1]));
    if (!campaign) return jsonResponse({ message: "Kampanye tidak ditemukan." }, 404);
    const donations = db.donations.filter(d => d.campaign_id === campaign.id);
    return jsonResponse({ campaign: { ...campaign, donations_count: donations.length } });
  }

  if (campaignDonateMatch && method === "POST") {
    body._campaignId = campaignDonateMatch[1];
    return handlers["POST /campaigns/:id/donate"](body, db, options);
  }

  if (aidApproveMatch) {
    return jsonResponse({ success: true, message: `Pengajuan ${aidApproveMatch[2] === "approve" ? "disetujui" : "ditolak"}.` });
  }

  const key = `${method} ${endpoint}`;
  const handler = handlers[key];
  if (handler) return handler(body, db, options);

  // Fallback — endpoint belum di-mock
  console.warn(`[MOCK API] Endpoint not mocked: ${method} ${endpoint}`);
  return jsonResponse({ message: `Mock endpoint not found: ${method} ${endpoint}`, data: [], items: [] });
}

// ─── Reset DB (untuk debugging) ───────────────────────────────────────────────
export function resetMockDB() {
  localStorage.setItem(DB_KEY, JSON.stringify(seedDB()));
  console.log("[MOCK API] Database reset ke seed data.");
}
