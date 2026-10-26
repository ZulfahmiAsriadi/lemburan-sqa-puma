/**
 * Overtime Timesheet Application Logic
 * Multi-Admin Tab & Real-time Online Sync
 * Admin List: Amin Syahar Hasanuddin, Tiara Syahrani Maulida, Muhiddin
 */

const STORAGE_KEY_MULTI = 'overtime_multi_admin_v3';
const API_URL = '/api/data';

// Default Database Structure
const initialAppData = {
  admins: {
    muhiddin: {
      id: 'muhiddin',
      nama: 'Muhiddin',
      jabatan: 'OS1',
      divisi: 'Service Quality Assurance Maluku and Papua Department',
      periode: 'Oktober 2026',
      rows: [
        {
          id: 1,
          hariTanggal: 'Selasa, 6 Oktober 2026',
          rawDate: '2026-10-06',
          deskripsi: 'Productivity weekly Report Compared Marsma Week 38 Compared data site UME and REM Collect data Azimuth and territory NDM',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 2,
          hariTanggal: 'Rabu, 7 Oktober 2026',
          rawDate: '2026-10-07',
          deskripsi: 'Productivity weekly Report daily report collect data revenue and payload weekly and monthly level site by request user',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 3,
          hariTanggal: 'Kamis, 8 Oktober 2026',
          rawDate: '2026-10-08',
          deskripsi: 'Productivity weekly Report Compared Marsma Week 38 , Create Gcell Marsma Mapping KML and KMZ and validate longlate and latitude',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 4,
          hariTanggal: 'Jumat, 9 Oktober 2026',
          rawDate: '2026-10-09',
          deskripsi: 'Productivity weekly Report Compared Marsma Wekk 38 validate on air date, class revenue, tech, band with ndm cell_name level',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 5,
          hariTanggal: 'Senin, 12 Oktober 2026',
          rawDate: '2026-10-12',
          deskripsi: 'Productivity weekly Report Compared Marsma Wekk 38 validate class revenue, Anthena Type, and Create Weekly Report W41 PUMA',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 6,
          hariTanggal: 'Selasa, 20 Oktober 2026',
          rawDate: '2026-10-20',
          deskripsi: 'Productivity weekly Report Compared Marsma Week 42 , Create Gcell Marsma Mapping KML and KMZ and validate BCP site , class revenue',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 7,
          hariTanggal: 'Rabu, 21 Oktober 2026',
          rawDate: '2026-10-21',
          deskripsi: 'Productivity weekly Report Compared Marsma Week 42 data site UME and REM Collect data Azimuth, territory, departemen and Coverage',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 8,
          hariTanggal: 'Kamis, 22 Oktober 2026',
          rawDate: '2026-10-22',
          deskripsi: 'Productivity daily report Collect data NDM payload and revenue , Created Marsma Week 43, validation UME Site marsma',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: ''
        }
      ]
    },
    amin: {
      id: 'amin',
      nama: 'Amin Syahar Hasanuddin',
      jabatan: 'OS1',
      divisi: 'Service Quality Assurance Maluku and Papua Department',
      periode: 'Oktober 2026',
      rows: [
        {
          id: 101,
          hariTanggal: 'Selasa, 6 Oktober 2026',
          rawDate: '2026-10-06',
          deskripsi: 'Monitoring performansi network QoS area Papua & penanganan tiket prioritas',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 102,
          hariTanggal: 'Kamis, 8 Oktober 2026',
          rawDate: '2026-10-08',
          deskripsi: 'Validasi integrasi data site Maluku & rekapitulasi availability service harian',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        }
      ]
    },
    tiara: {
      id: 'tiara',
      nama: 'Tiara Syahrani Maulida',
      jabatan: 'OS1',
      divisi: 'Service Quality Assurance Maluku and Papua Department',
      periode: 'Oktober 2026',
      rows: [
        {
          id: 201,
          hariTanggal: 'Rabu, 7 Oktober 2026',
          rawDate: '2026-10-07',
          deskripsi: 'Audit laporan KPI mingguan dan pengecekan threshold payload regional',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        },
        {
          id: 202,
          hariTanggal: 'Jumat, 9 Oktober 2026',
          rawDate: '2026-10-09',
          deskripsi: 'Rekonsiliasi database site UME & pembaharuan matriks eskalasi departemen',
          jamMasuk: '18:00',
          jamPulang: '22:00',
          durasi: 4,
          status: 'Done'
        }
      ]
    }
  }
};

// Global App State
let appData = JSON.parse(JSON.stringify(initialAppData));
let activeTab = 'summary'; // 'amin' | 'tiara' | 'muhiddin' | 'summary'
let summaryFilter = 'all'; // 'all' | 'amin' | 'tiara' | 'muhiddin'
let currentRole = 'staff'; // 'staff' | 'admin'
let editingRowId = null;
let isOnline = false;

// Overtime Tracking & Notification State
const knownRowIds = new Set();
let isInitialSync = true;
let audioCtx = null;

// Web Audio API Synthesizer (Instant crystal-clear chime with zero external dependencies)
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Unlock audio context immediately on first user touch/click
const unlockAudioOnTouch = () => {
  getAudioContext();
  window.removeEventListener('click', unlockAudioOnTouch);
  window.removeEventListener('touchstart', unlockAudioOnTouch);
};
window.addEventListener('click', unlockAudioOnTouch, { passive: true });
window.addEventListener('touchstart', unlockAudioOnTouch, { passive: true });

function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First tone: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second tone: A5 (880.00 Hz) - higher pleasant finish
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.14);
    gain2.gain.setValueAtTime(0.001, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.32, now + 0.19);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.7);
  } catch (err) {
    console.warn('Audio chime playback error:', err);
  }
}

// Native System Notification Dispatcher (Android Notification Drawer / Status Bar)
async function showNativeNotification(title, body, targetAdminKey) {
  const options = {
    body: body,
    icon: './app_icon.png',
    badge: './app_icon.png',
    vibrate: [200, 100, 200, 100, 300],
    tag: 'lemburan-sqa-puma-' + Date.now(),
    renotify: true,
    data: {
      url: './?admin=' + (targetAdminKey || 'muhiddin')
    }
  };

  // Try Service Worker registration first (standard for Android PWA / WebAPK)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && typeof reg.showNotification === 'function') {
        await reg.showNotification(title, options);
        return;
      }
    } catch (e) {
      console.warn('SW showNotification fallback:', e);
    }
  }

  // Fallback to Window Notification API
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (e) {
      console.warn('Window Notification error:', e);
    }
  }
}

// Full Trigger for New Overtime Creation
function triggerOvertimeCreatedNotification({ adminName, durasi, deskripsi, hariTanggal, adminKey, isLocal }) {
  // 1. Play chime sound
  playNotificationSound();

  // 2. Hardware vibration on Android phone
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 300]);
    } catch (e) {}
  }

  // 3. Android System Notification (Status Bar)
  const title = `📢 Lemburan Baru: ${adminName}`;
  const shortDesc = (deskripsi || '').length > 70 ? (deskripsi || '').substring(0, 67) + '...' : (deskripsi || '-');
  const body = `${hariTanggal || 'Hari ini'} • ${durasi} Jam\n${shortDesc}`;

  if ('Notification' in window && Notification.permission === 'granted') {
    showNativeNotification(title, body, adminKey);
  }

  // 4. In-App visual Toast
  const sourceText = isLocal ? 'Berhasil dicatat!' : 'Baru saja diinput staf!';
  showToast(`🔔 [Lemburan Baru] ${adminName} (${durasi} Jam) - ${sourceText}`, 'success');
}

// Service Worker & PWA Install Support
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.log('SW registration error:', err);
    });
  });
}

// ===================================================================
// Initialization
// ===================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Check URL Parameter for default active tab, fallback to localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const targetAdmin = urlParams.get('admin');
  const savedTab = localStorage.getItem('active_admin_tab');

  if (targetAdmin && (appData.admins[targetAdmin] || targetAdmin === 'summary')) {
    activeTab = targetAdmin;
  } else if (savedTab && (appData.admins[savedTab] || savedTab === 'summary')) {
    activeTab = savedTab;
  } else {
    activeTab = 'summary'; // Default to summary so users see all 3 admins first
  }

  loadLocalData();
  setupEventListeners();
  initFormDateDefaults();
  setupNotificationUI();

  // Restore role preference (default: staff)
  const savedRole = localStorage.getItem('user_role_preference');
  const btnStaff = document.getElementById('btn-mode-staff');
  const btnAdmin = document.getElementById('btn-mode-admin');
  const adminBar = document.getElementById('admin-quick-bar');
  if (savedRole === 'admin') {
    currentRole = 'admin';
    if (btnAdmin) btnAdmin.classList.add('active');
    if (btnStaff) btnStaff.classList.remove('active');
    if (adminBar) adminBar.style.display = 'flex';
  } else {
    currentRole = 'staff';
    if (btnStaff) btnStaff.classList.add('active');
    if (btnAdmin) btnAdmin.classList.remove('active');
    if (adminBar) adminBar.style.display = 'none';
  }
  updateStatusOptionsByRole();
  
  // Connect to server database
  await syncFromServer();
  
  // Render active view
  switchTab(activeTab);
  updateAllTabBadges();

  // Background auto-sync every 5 seconds
  setInterval(syncFromServer, 5000);
});

// Load from LocalStorage
function loadLocalData() {
  const saved = localStorage.getItem(STORAGE_KEY_MULTI);
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.warn('Gagal memuat local data, menggunakan default.');
    }
  }
}

// State for locking background auto-sync during user edits
let isSavingInProgress = false;

// Save to LocalStorage and push to Server API
async function saveData() {
  isSavingInProgress = true;
  localStorage.setItem(STORAGE_KEY_MULTI, JSON.stringify(appData));
  try {
    await pushToServer();
  } catch (err) {
    console.error('Error in saveData:', err);
  } finally {
    isSavingInProgress = false;
  }
  renderActiveTab();
  updateAllTabBadges();
}

// Synchronize from Server
async function syncFromServer() {
  if (isSavingInProgress) return; // Do not overwrite in-progress edits

  const syncBadge = document.getElementById('online-sync-badge');
  const syncText = document.getElementById('sync-status-text');

  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && serverData.admins) {
        
        // Track newly created rows
        if (isInitialSync) {
          // First load: memorize all existing row IDs so we do NOT trigger alerts on old history
          Object.values(serverData.admins).forEach(adm => {
            (adm.rows || []).forEach(r => knownRowIds.add(r.id));
          });
          isInitialSync = false;
        } else {
          // Subsequent syncs: detect records whose id is not yet in knownRowIds
          const newlyAdded = [];
          Object.entries(serverData.admins).forEach(([key, adm]) => {
            (adm.rows || []).forEach(r => {
              if (!knownRowIds.has(r.id)) {
                knownRowIds.add(r.id);
                newlyAdded.push({
                  adminName: adm.nama,
                  adminKey: key,
                  durasi: r.durasi,
                  deskripsi: r.deskripsi,
                  hariTanggal: r.hariTanggal
                });
              }
            });
          });

          // Trigger notification for each new entry created by staff/admin
          if (newlyAdded.length > 0) {
            newlyAdded.forEach(item => {
              triggerOvertimeCreatedNotification({
                adminName: item.adminName,
                durasi: item.durasi,
                deskripsi: item.deskripsi,
                hariTanggal: item.hariTanggal,
                adminKey: item.adminKey,
                isLocal: false
              });
            });
          }
        }

        // Only update if not currently saving
        if (!isSavingInProgress) {
          appData = serverData;
          localStorage.setItem(STORAGE_KEY_MULTI, JSON.stringify(appData));
        }
      }
      isOnline = true;
      if (syncBadge) {
        syncBadge.querySelector('.status-dot').className = 'status-dot online';
        syncText.textContent = 'Tersinkronisasi Online';
      }
      renderActiveTab();
      updateAllTabBadges();
      return;
    }
  } catch (err) {
    // Server is local/offline
    isOnline = false;
    if (syncBadge) {
      syncBadge.querySelector('.status-dot').className = 'status-dot offline';
      syncText.textContent = 'Mode Offline (Lokal)';
    }
  }
}

// Push to Server
async function pushToServer() {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    if (res.ok) {
      isOnline = true;
      const syncBadge = document.getElementById('online-sync-badge');
      const syncText = document.getElementById('sync-status-text');
      if (syncBadge) {
        syncBadge.querySelector('.status-dot').className = 'status-dot online';
        syncText.textContent = 'Tersinkronisasi Online';
      }
    }
  } catch (e) {
    console.warn('Push error:', e);
  }
}

// ===================================================================
// Tab Navigation & Switching
// ===================================================================
function switchTab(tabKey) {
  if (!tabKey) return;
  activeTab = tabKey;

  // Persist active tab to localStorage so APK always remembers user's selection
  try {
    localStorage.setItem('active_admin_tab', tabKey);
  } catch (e) {}

  // Update tab buttons active class
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.admin === tabKey);
  });

  // Automatically scroll the horizontal tabs bar so the active button is visible in screen!
  const activeBtn = document.querySelector(`.tab-btn[data-admin="${tabKey}"]`);
  if (activeBtn) {
    try {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch (e) {}
  }

  const viewSingle = document.getElementById('view-single-admin');
  const viewSummary = document.getElementById('view-summary');

  if (tabKey === 'summary') {
    if (viewSingle) viewSingle.style.display = 'none';
    if (viewSummary) viewSummary.style.display = 'flex';
    renderSummaryView();
  } else {
    if (viewSummary) viewSummary.style.display = 'none';
    if (viewSingle) viewSingle.style.display = 'flex';
    renderActiveTab();
  }

  // Smooth scroll window to top so user sees the newly opened timesheet header cleanly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL without reload for easy sharing
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('admin', tabKey);
  window.history.replaceState({}, '', newUrl);
}

function updateAllTabBadges() {
  let grandHours = 0;

  ['amin', 'tiara', 'muhiddin'].forEach(key => {
    const adminObj = appData.admins[key];
    if (!adminObj) return;

    let adminTotal = 0;
    (adminObj.rows || []).forEach(r => adminTotal += (Number(r.durasi) || 0));
    grandHours += adminTotal;

    const badge = document.getElementById(`badge-tab-${key}`);
    if (badge) {
      badge.textContent = `${adminTotal} Jam (${(adminObj.rows || []).length} baris)`;
    }
  });

  const summaryBadge = document.getElementById('badge-tab-summary');
  if (summaryBadge) {
    summaryBadge.textContent = `Total: ${grandHours} Jam`;
  }
}

// ===================================================================
// Rendering Active Admin Sheet
// ===================================================================
function renderActiveTab() {
  if (activeTab === 'summary') {
    renderSummaryView();
    return;
  }

  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  // Render Profil
  document.getElementById('meta-nama').textContent = currentAdmin.nama;
  document.getElementById('meta-jabatan').textContent = currentAdmin.jabatan;
  document.getElementById('meta-divisi').textContent = currentAdmin.divisi;
  document.getElementById('meta-periode').textContent = currentAdmin.periode;

  const avatarEl = document.getElementById('meta-avatar-badge');
  if (avatarEl) {
    if (activeTab === 'amin') {
      avatarEl.textContent = 'AS';
      avatarEl.className = 'meta-avatar avatar-amin';
    } else if (activeTab === 'tiara') {
      avatarEl.textContent = 'TM';
      avatarEl.className = 'meta-avatar avatar-tiara';
    } else {
      avatarEl.textContent = 'MH';
      avatarEl.className = 'meta-avatar avatar-muhiddin';
    }
  }

  // Render Table
  const tbody = document.getElementById('timesheet-tbody');
  let totalJam = 0;
  let countDone = 0;
  let countPending = 0;

  const rows = currentAdmin.rows || [];

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="padding: 30px; color: #94a3b8; font-style: italic;">
          Belum ada catatan lembur untuk ${escapeHTML(currentAdmin.nama)}. Klik tombol "+ Tambah Lemburan" di atas untuk menambahkan.
        </td>
      </tr>
    `;
    document.getElementById('footer-total-jam').textContent = '0';
    document.getElementById('footer-status-summary').textContent = '0 Selesai';
    return;
  }

  tbody.innerHTML = rows.map((row, index) => {
    const rowNum = index + 1;
    const durasi = Number(row.durasi) || 0;
    totalJam += durasi;

    const isDone = (row.status && row.status.toLowerCase() === 'done');
    if (isDone) countDone++;
    else countPending++;

    let statusHTML = '';
    const statusTitle = (currentRole === 'admin') ? 'Klik untuk verifikasi status' : 'Status review lemburan';
    if (isDone) {
      statusHTML = `<span class="status-pill status-done" onclick="toggleRowStatus(${row.id})" title="${statusTitle}">Done</span>`;
    } else if (row.status) {
      statusHTML = `<span class="status-pill status-pending" onclick="toggleRowStatus(${row.id})" title="${statusTitle}">${escapeHTML(row.status)}</span>`;
    } else {
      statusHTML = `<span class="status-pill status-empty" onclick="toggleRowStatus(${row.id})" title="${statusTitle}">Menunggu Review</span>`;
    }

    return `
      <tr>
        <td class="text-center font-mono" style="font-weight: 600;">${rowNum}</td>
        <td class="date-cell">${escapeHTML(row.hariTanggal)}</td>
        <td class="task-cell-content">${escapeHTML(row.deskripsi)}</td>
        <td class="text-center"><span class="time-cell">${row.jamMasuk}</span></td>
        <td class="text-center"><span class="time-cell">${row.jamPulang}</span></td>
        <td class="text-center duration-cell">${durasi}</td>
        <td class="text-center">${statusHTML}</td>
        <td class="text-center cell-actions">
          ${!isDone && currentRole === 'admin' ? `
            <button class="btn-cell-icon approve" title="Setujui (Tandai Done)" onclick="markRowDone(${row.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          ` : ''}
          <button class="btn-cell-icon" title="Edit Baris" onclick="openEditModal(${row.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="btn-cell-icon delete" title="Hapus Baris" onclick="deleteRow(${row.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const formattedTotal = Number.isInteger(totalJam) ? totalJam : totalJam.toFixed(1);
  document.getElementById('footer-total-jam').textContent = formattedTotal;
  document.getElementById('footer-status-summary').textContent = `${countDone} Selesai (Done), ${countPending} Menunggu Konfirmasi`;

  // Render Mobile Cards Container
  const mobileContainer = document.getElementById('timesheet-mobile-cards');
  if (mobileContainer) {
    if (rows.length === 0) {
      mobileContainer.innerHTML = `
        <div class="mobile-card-item text-center" style="padding: 24px; color: #94a3b8; font-style: italic;">
          Belum ada catatan lembur untuk ${escapeHTML(currentAdmin.nama)}. Ketuk tombol "+ Catat Lembur" di bawah.
        </div>
      `;
    } else {
      mobileContainer.innerHTML = rows.map((row, index) => {
        const isDone = (row.status && row.status.toLowerCase() === 'done');
        let statusBadge = isDone
          ? `<span class="status-pill status-done" onclick="toggleRowStatus(${row.id})">Done</span>`
          : (row.status ? `<span class="status-pill status-pending" onclick="toggleRowStatus(${row.id})">${escapeHTML(row.status)}</span>` : `<span class="status-pill status-empty" onclick="toggleRowStatus(${row.id})">Menunggu Review</span>`);

        return `
          <div class="mobile-card-item">
            <div class="mobile-card-top">
              <div class="mobile-card-date">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${escapeHTML(row.hariTanggal)}</span>
              </div>
              ${statusBadge}
            </div>

            <div class="mobile-card-timebar">
              <span class="mobile-time-pill">🕐 ${row.jamMasuk} - ${row.jamPulang}</span>
              <span class="mobile-dur-pill">⏱️ ${row.durasi} Jam</span>
            </div>

            <div class="mobile-card-desc">
              ${escapeHTML(row.deskripsi)}
            </div>

            <div class="mobile-card-actions">
              <div class="mobile-card-actions-left">
                ${!isDone ? (
                  currentRole === 'admin' ? `
                    <button class="btn-mobile-approve" onclick="markRowDone(${row.id})">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Setujui (Done)
                    </button>
                  ` : '<span style="font-size: 0.775rem; color: #f59e0b; font-weight: 600;">⏳ Menunggu Review</span>'
                ) : '<span style="font-size: 0.775rem; color: #10b981; font-weight: 700;">✓ Disetujui</span>'}
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn-mobile-action" title="Edit" onclick="openEditModal(${row.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button class="btn-mobile-action" title="Hapus" style="color: #ef4444;" onclick="deleteRow(${row.id})">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Update mobile total chip
  const mobTotalChip = document.getElementById('mobile-top-total-hours');
  if (mobTotalChip) mobTotalChip.textContent = `${formattedTotal} Jam`;
}

// ===================================================================
// Summary View Rendering
// ===================================================================
function renderSummaryView() {
  const tbody = document.getElementById('summary-tbody');
  let grandHours = 0;
  let grandDone = 0;
  let grandPending = 0;
  let totalAllRows = 0;

  const adminKeys = ['amin', 'tiara', 'muhiddin'];

  tbody.innerHTML = adminKeys.map((key, index) => {
    const admin = appData.admins[key];
    const rows = admin.rows || [];
    let adminHours = 0;
    let doneCount = 0;
    let pendingCount = 0;

    rows.forEach(r => {
      adminHours += (Number(r.durasi) || 0);
      if (r.status && r.status.toLowerCase() === 'done') doneCount++;
      else pendingCount++;
    });

    grandHours += adminHours;
    grandDone += doneCount;
    grandPending += pendingCount;
    totalAllRows += rows.length;

    const isAllDone = (doneCount === rows.length && rows.length > 0);
    const badgeClass = isAllDone ? 'badge-done-all' : 'badge-pending-some';
    const badgeText = isAllDone ? `${doneCount} Selesai (100%)` : `${doneCount} / ${rows.length} Selesai`;

    return `
      <tr>
        <td class="text-center font-mono" style="font-weight: 700; color: #64748b;">${index + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="tab-avatar ${key === 'amin' ? 'avatar-amin' : key === 'tiara' ? 'avatar-tiara' : 'avatar-muhiddin'}" style="width: 28px; height: 28px; font-size: 0.75rem;">
              ${key === 'amin' ? 'AS' : key === 'tiara' ? 'TM' : 'MH'}
            </div>
            <strong style="color: #0f172a; font-size: 0.95rem;">${escapeHTML(admin.nama)}</strong>
          </div>
        </td>
        <td class="text-center"><span class="badge-role">${escapeHTML(admin.jabatan)}</span></td>
        <td style="color: #475569; font-weight: 500;">${escapeHTML(admin.divisi)}</td>
        <td class="text-center font-mono" style="font-weight: 700;">${rows.length} baris</td>
        <td class="text-center duration-cell" style="color: var(--primary); font-size: 1.1rem;">${adminHours} Jam</td>
        <td class="text-center">
          <span class="${badgeClass}">
            ${badgeText}
          </span>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-primary" onclick="switchTab('${key}')">
            Buka Timesheet ${escapeHTML(admin.nama.split(' ')[0])} &rarr;
          </button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('summary-grand-hours').textContent = `${grandHours} Jam`;
  document.getElementById('summary-grand-done').textContent = `${grandDone} Pekerjaan`;
  document.getElementById('summary-grand-pending').textContent = `${grandPending} Pending`;

  const badgeTotalAll = document.getElementById('badge-total-all-rows');
  if (badgeTotalAll) badgeTotalAll.textContent = `${totalAllRows} Baris Total`;

  // Render Mobile Summary Cards
  const sumMobContainer = document.getElementById('summary-mobile-cards');
  if (sumMobContainer) {
    sumMobContainer.innerHTML = adminKeys.map((key) => {
      const a = appData.admins[key];
      const r = a.rows || [];
      let hrs = 0;
      let done = 0;
      r.forEach(x => {
        hrs += (Number(x.durasi) || 0);
        if (x.status && x.status.toLowerCase() === 'done') done++;
      });
      const isAllDone = (done === r.length && r.length > 0);
      return `
        <div class="mobile-sum-card-item">
          <div class="mobile-sum-card-header">
            <div class="mobile-sum-user">
              <div class="tab-avatar ${key === 'amin' ? 'avatar-amin' : key === 'tiara' ? 'avatar-tiara' : 'avatar-muhiddin'}" style="width: 34px; height: 34px; font-size: 0.8rem;">
                ${key === 'amin' ? 'AS' : key === 'tiara' ? 'TM' : 'MH'}
              </div>
              <span class="mobile-sum-name">${escapeHTML(a.nama)}</span>
            </div>
            <span class="badge-role">${escapeHTML(a.jabatan)}</span>
          </div>
          <div class="mobile-sum-stats">
            <span><strong>${r.length}</strong> baris kerja</span>
            <span style="color: var(--primary); font-weight: 800; font-size: 1rem;">${hrs} Jam</span>
            <span class="${isAllDone ? 'badge-done-all' : 'badge-pending-some'}">${done}/${r.length} Selesai</span>
          </div>
          <button class="btn btn-sm btn-outline-primary" style="width: 100%; justify-content: center;" onclick="switchTab('${key}')">
            Buka Timesheet ${escapeHTML(a.nama.split(' ')[0])} &rarr;
          </button>
        </div>
      `;
    }).join('');
  }

  // Render Combined Timesheet in Summary View
  renderCombinedSummaryTimesheet();
}

// Render Combined Overtime Records in Summary View with Filters
function renderCombinedSummaryTimesheet() {
  const combinedTbody = document.getElementById('summary-combined-tbody');
  const combinedCards = document.getElementById('summary-combined-mobile-cards');
  if (!combinedTbody && !combinedCards) return;

  // Gather rows according to summaryFilter
  let combinedRows = [];
  const adminKeys = (summaryFilter === 'all') 
    ? ['amin', 'tiara', 'muhiddin'] 
    : [summaryFilter];

  adminKeys.forEach(k => {
    const admin = appData.admins[k];
    if (!admin) return;
    (admin.rows || []).forEach(r => {
      combinedRows.push({
        ...r,
        adminKey: k,
        adminNama: admin.nama,
        adminAvatar: (k === 'amin') ? 'AS' : (k === 'tiara') ? 'TM' : 'MH'
      });
    });
  });

  // Sort by date descending (latest first)
  combinedRows.sort((a, b) => {
    const dateA = a.rawDate || '';
    const dateB = b.rawDate || '';
    return dateB.localeCompare(dateA);
  });

  // Render Desktop / Tablet Table
  if (combinedTbody) {
    if (combinedRows.length === 0) {
      combinedTbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center" style="padding: 24px; color: #94a3b8; font-style: italic;">
            Tidak ada catatan lembur yang sesuai filter.
          </td>
        </tr>
      `;
    } else {
      combinedTbody.innerHTML = combinedRows.map((r, i) => {
        const isDone = (r.status && r.status.toLowerCase() === 'done');
        const statusHtml = isDone
          ? `<span class="status-pill status-done">Done</span>`
          : (r.status ? `<span class="status-pill status-pending">${escapeHTML(r.status)}</span>` : `<span class="status-pill status-empty">(Kosong)</span>`);

        return `
          <tr>
            <td class="text-center font-mono" style="font-weight: 600;">${i + 1}</td>
            <td>
              <span class="admin-tag-badge admin-tag-${r.adminKey}">
                ${r.adminAvatar} ${escapeHTML(r.adminNama.split(' ')[0])}
              </span>
            </td>
            <td class="date-cell">${escapeHTML(r.hariTanggal)}</td>
            <td class="task-cell-content">${escapeHTML(r.deskripsi)}</td>
            <td class="text-center font-mono"><span class="time-cell">${r.jamMasuk}</span></td>
            <td class="text-center font-mono"><span class="time-cell">${r.jamPulang}</span></td>
            <td class="text-center duration-cell">${r.durasi}</td>
            <td class="text-center">${statusHtml}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Mobile Cards
  if (combinedCards) {
    if (combinedRows.length === 0) {
      combinedCards.innerHTML = `
        <div class="mobile-card-item text-center" style="padding: 20px; color: #94a3b8; font-style: italic;">
          Tidak ada catatan lembur yang sesuai filter.
        </div>
      `;
    } else {
      combinedCards.innerHTML = combinedRows.map((r) => {
        const isDone = (r.status && r.status.toLowerCase() === 'done');
        const statusBadge = isDone
          ? `<span class="status-pill status-done">Done</span>`
          : (r.status ? `<span class="status-pill status-pending">${escapeHTML(r.status)}</span>` : `<span class="status-pill status-empty">Pending</span>`);

        return `
          <div class="mobile-card-item">
            <div class="mobile-card-top">
              <span class="admin-tag-badge admin-tag-${r.adminKey}">
                ${r.adminAvatar} ${escapeHTML(r.adminNama)}
              </span>
              ${statusBadge}
            </div>

            <div class="mobile-card-timebar">
              <span class="mobile-time-pill">📅 ${escapeHTML(r.hariTanggal)}</span>
              <span class="mobile-time-pill">🕐 ${r.jamMasuk} - ${r.jamPulang}</span>
              <span class="mobile-dur-pill">⏱️ ${r.durasi} Jam</span>
            </div>

            <div class="mobile-card-desc">
              ${escapeHTML(r.deskripsi)}
            </div>

            <div class="mobile-card-actions">
              <span style="font-size: 0.75rem; color: #64748b;">Disinkronkan Online</span>
              <button class="btn btn-sm btn-outline-primary" onclick="switchTab('${r.adminKey}')">
                Buka Sheet ${escapeHTML(r.adminNama.split(' ')[0])} &rarr;
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// ===================================================================
// Status & Row Actions
// ===================================================================
async function toggleRowStatus(id) {
  if (currentRole !== 'admin') {
    showToast('Hanya Reviewer (Atasan) yang berwenang mengubah status lemburan.', 'info');
    return;
  }
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  const row = currentAdmin.rows.find(r => r.id === id);
  if (!row) return;

  if (!row.status || row.status.toLowerCase() !== 'done') {
    row.status = 'Done';
    showToast(`Status baris di ${currentAdmin.nama} diubah ke "Done"`, 'success');
  } else {
    row.status = '';
    showToast(`Status baris di ${currentAdmin.nama} diset Menunggu Review`, 'info');
  }

  await saveData();
  renderActiveTab();
}

async function markRowDone(id) {
  if (currentRole !== 'admin') {
    showToast('Hanya Reviewer (Atasan) yang berwenang menyetujui status Done.', 'info');
    return;
  }
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  const row = currentAdmin.rows.find(r => r.id === id);
  if (!row) return;

  row.status = 'Done';
  await saveData();
  renderActiveTab();
  showToast(`Status baris telah disetujui: "Done"`, 'success');
}

async function bulkApproveAll() {
  if (currentRole !== 'admin') {
    showToast('Hanya Reviewer (Atasan) yang dapat menyetujui semua lemburan.', 'info');
    return;
  }
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  let count = 0;
  (currentAdmin.rows || []).forEach(r => {
    if (!r.status || r.status.toLowerCase() !== 'done') {
      r.status = 'Done';
      count++;
    }
  });

  if (count === 0) {
    showToast('Semua baris di tab ini sudah berstatus "Done".', 'info');
    return;
  }

  await saveData();
  renderActiveTab();
  showToast(`${count} baris lembur untuk ${currentAdmin.nama} disetujui menjadi "Done"!`, 'success');
}

async function deleteRow(id) {
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  if (confirm(`Hapus baris lembur ini dari timesheet ${currentAdmin.nama}?`)) {
    currentAdmin.rows = currentAdmin.rows.filter(r => r.id !== id);
    await saveData();
    renderActiveTab();
    showToast('Baris lembur berhasil dihapus.', 'info');
  }
}

// ===================================================================
// Duration & Date Utilities
// ===================================================================
function calculateDuration(jamMasuk, jamPulang) {
  if (!jamMasuk || !jamPulang) return 0;

  const [inH, inM] = jamMasuk.split(':').map(Number);
  const [outH, outM] = jamPulang.split(':').map(Number);

  let inTotal = inH * 60 + inM;
  let outTotal = outH * 60 + outM;

  if (outTotal < inTotal) {
    outTotal += 24 * 60;
  }

  const diffMinutes = outTotal - inTotal;
  const hours = diffMinutes / 60;
  return Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
}

function formatIndonesianDate(dateString) {
  if (!dateString) return '';
  const dateObj = new Date(dateString + 'T00:00:00');
  if (isNaN(dateObj.getTime())) return dateString;

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// ===================================================================
// Modals Handlers
// ===================================================================
function initFormDateDefaults() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const dateInput = document.getElementById('input-tanggal');
  if (dateInput && !dateInput.value) {
    dateInput.value = todayStr;
    updateDatePreview(todayStr);
  }

  updateLiveDuration();
}

function updateDatePreview(dateStr) {
  const preview = document.getElementById('preview-formatted-date');
  if (!preview) return;
  preview.textContent = dateStr ? 'Tampilan: ' + formatIndonesianDate(dateStr) : 'Format: Hari, DD MMMM YYYY';
}

function updateLiveDuration() {
  const jamMasuk = document.getElementById('input-jam-masuk').value;
  const jamPulang = document.getElementById('input-jam-pulang').value;
  const durasi = calculateDuration(jamMasuk, jamPulang);
  document.getElementById('calc-durasi-display').textContent = `${durasi} Jam`;
}

// Atur pilihan status pekerjaan berdasarkan role (Staff vs Reviewer)
function updateStatusOptionsByRole(currentStatusVal = '') {
  const statusSelect = document.getElementById('input-status');
  const hintEl = document.getElementById('status-field-hint') || document.querySelector('#status-field-wrapper .form-hint');
  if (!statusSelect) return;

  if (currentRole === 'staff') {
    // Mode Staff / Pengisi: HANYA berikan akses (Kosong / Menunggu Review)
    statusSelect.innerHTML = `<option value="">(Kosong / Menunggu Review)</option>`;
    statusSelect.value = '';
    statusSelect.disabled = true;
    if (hintEl) {
      hintEl.textContent = '🔒 Mode Pengisi: Status otomatis diset "(Kosong / Menunggu Review)" sampai disetujui Reviewer.';
    }
  } else {
    // Mode Reviewer (Saya): Opsi lengkap (Kosong, Done, Pending)
    statusSelect.disabled = false;
    statusSelect.innerHTML = `
      <option value="">(Kosong / Menunggu Review)</option>
      <option value="Done">Done</option>
      <option value="Pending">Pending</option>
    `;
    statusSelect.value = currentStatusVal || 'Done';
    if (hintEl) {
      hintEl.textContent = 'Mode Reviewer: Anda dapat menyetujui langsung sebagai Done atau menandai Pending.';
    }
  }
}

function openAddModal() {
  editingRowId = null;
  document.getElementById('modal-lembur-title').textContent = 'Input Catatan Lembur';
  document.getElementById('form-lembur').reset();
  document.getElementById('entry-id').value = '';

  // Select current active admin by default in dropdown
  const adminSelect = document.getElementById('select-target-admin');
  if (adminSelect) {
    adminSelect.value = (activeTab !== 'summary') ? activeTab : 'muhiddin';
  }

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  document.getElementById('input-tanggal').value = todayStr;
  updateDatePreview(todayStr);
  document.getElementById('input-jam-masuk').value = '18:00';
  document.getElementById('input-jam-pulang').value = '22:00';
  
  // Update status dropdown options strictly based on current role
  updateStatusOptionsByRole(currentRole === 'admin' ? 'Done' : '');

  updateLiveDuration();
  document.getElementById('modal-lembur').style.display = 'flex';
}

function openEditModal(id) {
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  const row = currentAdmin.rows.find(r => r.id === id);
  if (!row) return;

  editingRowId = id;
  document.getElementById('modal-lembur-title').textContent = `Edit Baris Lembur (${currentAdmin.nama})`;
  document.getElementById('entry-id').value = row.id;

  const adminSelect = document.getElementById('select-target-admin');
  if (adminSelect) adminSelect.value = activeTab;

  document.getElementById('input-tanggal').value = row.rawDate || '';
  updateDatePreview(row.rawDate || '');
  document.getElementById('input-jam-masuk').value = row.jamMasuk || '18:00';
  document.getElementById('input-jam-pulang').value = row.jamPulang || '22:00';
  document.getElementById('input-deskripsi').value = row.deskripsi || '';
  
  // Update status dropdown options strictly based on current role
  updateStatusOptionsByRole(row.status || '');

  updateLiveDuration();
  document.getElementById('modal-lembur').style.display = 'flex';
}

function closeLemburModal() {
  document.getElementById('modal-lembur').style.display = 'none';
  editingRowId = null;
}

async function handleSaveLembur(e) {
  e.preventDefault();

  const targetAdminKey = document.getElementById('select-target-admin').value;
  const targetAdmin = appData.admins[targetAdminKey];
  if (!targetAdmin) return;

  const rawDate = document.getElementById('input-tanggal').value;
  const jamMasuk = document.getElementById('input-jam-masuk').value;
  const jamPulang = document.getElementById('input-jam-pulang').value;
  const deskripsi = document.getElementById('input-deskripsi').value.trim();

  // Tentukan status sesuai hak akses: Staff HANYA bisa kosong / menunggu review
  let status = '';
  if (currentRole === 'admin') {
    const statusSelect = document.getElementById('input-status');
    status = statusSelect ? statusSelect.value.trim() : '';
  } else {
    // Mode staff: jika mengedit baris yang sudah Done, pertahankan status Done
    if (editingRowId) {
      const existingRow = targetAdmin.rows.find(r => r.id === editingRowId);
      status = (existingRow && existingRow.status === 'Done') ? 'Done' : '';
    } else {
      status = ''; // Entri baru dari staf selalu kosong / menunggu review
    }
  }

  const durasi = calculateDuration(jamMasuk, jamPulang);
  if (durasi <= 0) {
    alert('Jam pulang tidak boleh sama atau lebih awal dari jam masuk.');
    return;
  }

  const hariTanggal = formatIndonesianDate(rawDate);

  if (editingRowId) {
    const idx = targetAdmin.rows.findIndex(r => r.id === editingRowId);
    if (idx !== -1) {
      targetAdmin.rows[idx] = {
        ...targetAdmin.rows[idx],
        rawDate,
        hariTanggal,
        jamMasuk,
        jamPulang,
        durasi,
        deskripsi,
        status
      };
      showToast('Baris lembur berhasil diperbarui!', 'success');
    }
  } else {
    const newId = Date.now();
    const newRecord = {
      id: newId,
      rawDate,
      hariTanggal,
      jamMasuk,
      jamPulang,
      durasi,
      deskripsi,
      status
    };
    targetAdmin.rows.push(newRecord);
    knownRowIds.add(newId);

    // Trigger notification immediately on creation
    triggerOvertimeCreatedNotification({
      adminName: targetAdmin.nama,
      durasi: durasi,
      deskripsi: deskripsi,
      hariTanggal: hariTanggal,
      adminKey: targetAdminKey,
      isLocal: true
    });
  }

  await saveData();
  if (activeTab !== targetAdminKey) {
    switchTab(targetAdminKey);
  } else {
    renderActiveTab();
  }
  closeLemburModal();
}

// Profil Modal
function openProfilModal() {
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  document.getElementById('input-profil-nama').value = currentAdmin.nama;
  document.getElementById('input-profil-jabatan').value = currentAdmin.jabatan;
  document.getElementById('input-profil-divisi').value = currentAdmin.divisi;
  document.getElementById('input-profil-periode').value = currentAdmin.periode;
  document.getElementById('modal-profil').style.display = 'flex';
}

function closeProfilModal() {
  document.getElementById('modal-profil').style.display = 'none';
}

async function handleSaveProfil(e) {
  e.preventDefault();
  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  currentAdmin.nama = document.getElementById('input-profil-nama').value.trim();
  currentAdmin.jabatan = document.getElementById('input-profil-jabatan').value.trim();
  currentAdmin.divisi = document.getElementById('input-profil-divisi').value.trim();
  currentAdmin.periode = document.getElementById('input-profil-periode').value.trim();

  await saveData();
  renderActiveTab();
  closeProfilModal();
  showToast('Identitas berhasil diperbarui!', 'success');
}

// ===================================================================
// Share Link Modal
// ===================================================================
function openShareModal() {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const baseUrl = `${origin}${pathname}`;

  document.getElementById('share-url-main').value = baseUrl;
  document.getElementById('share-url-amin').value = `${baseUrl}?admin=amin`;
  document.getElementById('share-url-tiara').value = `${baseUrl}?admin=tiara`;
  document.getElementById('share-url-muhiddin').value = `${baseUrl}?admin=muhiddin`;

  document.getElementById('modal-share').style.display = 'flex';
}

function closeShareModal() {
  document.getElementById('modal-share').style.display = 'none';
}

function copyShareLink(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value).then(() => {
    showToast('Link berhasil disalin ke clipboard!', 'success');
  }).catch(() => {
    document.execCommand('copy');
    showToast('Link berhasil disalin!', 'success');
  });
}

// ===================================================================
// Excel / CSV Export
// ===================================================================
function exportToExcelCSV() {
  if (activeTab === 'summary') {
    exportSummaryExcel();
    return;
  }

  const currentAdmin = appData.admins[activeTab];
  if (!currentAdmin) return;

  let totalJam = 0;
  (currentAdmin.rows || []).forEach(r => totalJam += (Number(r.durasi) || 0));

  const lines = [
    `"Nama";":";"${escapeCSV(currentAdmin.nama)}"`,
    `"Jabatan";":";"${escapeCSV(currentAdmin.jabatan)}"`,
    `"Divisi";":";"${escapeCSV(currentAdmin.divisi)}"`,
    '',
    `"Bulan/Tahun";":";"${escapeCSV(currentAdmin.periode)}"`,
    '',
    ['"No"', '"Hari/Tanggal/Bulan/Tahun"', '"Deskripsi Kerjaan"', '"Jam Masuk"', '"Jam Pulang"', '"Durasi"', '"status"'].join(';')
  ];

  (currentAdmin.rows || []).forEach((row, i) => {
    lines.push([
      i + 1,
      `"${escapeCSV(row.hariTanggal)}"`,
      `"${escapeCSV(row.deskripsi)}"`,
      `"${row.jamMasuk}"`,
      `"${row.jamPulang}"`,
      row.durasi,
      `"${escapeCSV(row.status || '')}"`
    ].join(';'));
  });

  lines.push(['"Total Jam"', '""', '""', '""', '""', totalJam, '""'].join(';'));

  downloadCSV(lines.join('\r\n'), `Rekap_Lembur_${currentAdmin.nama.replace(/\s+/g, '_')}.csv`);
}

function exportSummaryExcel() {
  const lines = [
    '"REKAPITULASI LEMBUR GABUNGAN 3 ADMIN SQA PUMA"',
    `"Periode";":";"${escapeCSV(appData.admins.muhiddin.periode)}"`,
    '',
    ['"No"', '"Nama Admin"', '"Jabatan"', '"Divisi"', '"Jumlah Baris"', '"Total Durasi (Jam)"'].join(';')
  ];

  let grandHours = 0;
  ['amin', 'tiara', 'muhiddin'].forEach((key, i) => {
    const a = appData.admins[key];
    let total = 0;
    (a.rows || []).forEach(r => total += (Number(r.durasi) || 0));
    grandHours += total;
    lines.push([
      i + 1,
      `"${escapeCSV(a.nama)}"`,
      `"${escapeCSV(a.jabatan)}"`,
      `"${escapeCSV(a.divisi)}"`,
      (a.rows || []).length,
      total
    ].join(';'));
  });

  lines.push(['"TOTAL KESELURUHAN"', '""', '""', '""', '""', grandHours].join(';'));

  downloadCSV(lines.join('\r\n'), 'Rekap_Gabungan_3_Admin.csv');
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('File lembur berhasil diexport ke Excel (CSV)!', 'success');
}

// ===================================================================
// Event Listeners
// ===================================================================
function setupEventListeners() {
  // Tab buttons click
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.admin);
    });
  });

  // Mode switcher (Staff vs Reviewer)
  const btnStaff = document.getElementById('btn-mode-staff');
  const btnAdmin = document.getElementById('btn-mode-admin');
  const adminBar = document.getElementById('admin-quick-bar');

  btnStaff.addEventListener('click', () => {
    currentRole = 'staff';
    localStorage.setItem('user_role_preference', 'staff');
    btnStaff.classList.add('active');
    btnAdmin.classList.remove('active');
    if (adminBar) adminBar.style.display = 'none';
    updateStatusOptionsByRole('');
    renderActiveTab();
    showToast('Beralih ke Mode Pengisi (Staff)', 'info');
  });

  btnAdmin.addEventListener('click', () => {
    currentRole = 'admin';
    localStorage.setItem('user_role_preference', 'admin');
    btnAdmin.classList.add('active');
    btnStaff.classList.remove('active');
    if (adminBar) adminBar.style.display = 'flex';
    updateStatusOptionsByRole('Done');
    renderActiveTab();
    showToast('Beralih ke Mode Reviewer (Saya)', 'info');
  });

  // Share Modal
  document.getElementById('btn-share-link').addEventListener('click', openShareModal);
  document.getElementById('btn-close-share-modal').addEventListener('click', closeShareModal);
  document.getElementById('btn-close-share-btn').addEventListener('click', closeShareModal);

  // Profil modal
  document.getElementById('btn-edit-profil').addEventListener('click', openProfilModal);
  document.getElementById('btn-close-profil-modal').addEventListener('click', closeProfilModal);
  document.getElementById('btn-cancel-profil-modal').addEventListener('click', closeProfilModal);
  document.getElementById('form-profil').addEventListener('submit', handleSaveProfil);

  // Lembur modal
  document.getElementById('btn-open-form').addEventListener('click', openAddModal);
  document.getElementById('btn-close-lembur-modal').addEventListener('click', closeLemburModal);
  document.getElementById('btn-cancel-lembur-modal').addEventListener('click', closeLemburModal);
  document.getElementById('form-lembur').addEventListener('submit', handleSaveLembur);

  // Live calculation listener
  document.getElementById('input-jam-masuk').addEventListener('input', updateLiveDuration);
  document.getElementById('input-jam-pulang').addEventListener('input', updateLiveDuration);
  document.getElementById('input-tanggal').addEventListener('change', (e) => {
    updateDatePreview(e.target.value);
  });

  // PWA / APK Install Button
  const btnInstall = document.getElementById('btn-install-apk');
  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('Aplikasi SQA PUMA sedang dipasang di HP Android Anda!', 'success');
        }
        deferredInstallPrompt = null;
      } else {
        alert('CARA PASANG DI HP ANDROID (OS TERBARU):\n\n1. Buka link ini di browser Google Chrome pada HP Android Anda.\n2. Ketuk tombol Titik Tiga (⋮) di pojok kanan atas.\n3. Pilih "Tambahkan ke Layar Utama" (Add to Home screen) atau "Instal Aplikasi".\n4. Ikon SQA PUMA akan langsung muncul di daftar aplikasi HP dan berjalan fullscreen layaknya aplikasi APK native!');
      }
    });
  }

  // Quick Approve All
  document.getElementById('btn-approve-all').addEventListener('click', bulkApproveAll);

  // Export & Print
  document.getElementById('btn-export-excel').addEventListener('click', exportToExcelCSV);
  document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
  });

  // Mobile View Switcher (Kartu HP vs Tabel Sheet)
  const btnViewCards = document.getElementById('btn-view-cards');
  const btnViewTable = document.getElementById('btn-view-table');
  const mobileCardsCont = document.getElementById('timesheet-mobile-cards');
  const timesheetTableWrap = document.getElementById('timesheet-table-wrapper');

  if (btnViewCards && btnViewTable) {
    btnViewCards.addEventListener('click', () => {
      btnViewCards.classList.add('active');
      btnViewTable.classList.remove('active');
      if (mobileCardsCont) mobileCardsCont.classList.remove('hide-cards');
      if (timesheetTableWrap) timesheetTableWrap.classList.remove('show-table');
    });

    btnViewTable.addEventListener('click', () => {
      btnViewTable.classList.add('active');
      btnViewCards.classList.remove('active');
      if (mobileCardsCont) mobileCardsCont.classList.add('hide-cards');
      if (timesheetTableWrap) timesheetTableWrap.classList.add('show-table');
    });
  }

  // Summary Timesheet Filter Pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      summaryFilter = btn.dataset.filter || 'all';
      renderCombinedSummaryTimesheet();
    });
  });

  // Modal Backdrop click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.style.display = 'none';
      editingRowId = null;
    }
  });
}

// ===================================================================
// Notification System UI Controller
// ===================================================================
function setupNotificationUI() {
  const btnToggle = document.getElementById('btn-toggle-notif');
  const btnText = document.getElementById('notif-btn-text');
  const banner = document.getElementById('notification-permission-banner');

  function updateState() {
    if (!('Notification' in window)) {
      if (btnToggle) btnToggle.style.display = 'none';
      if (banner) banner.style.display = 'none';
      return;
    }

    if (Notification.permission === 'granted') {
      if (btnToggle) {
        btnToggle.classList.add('active');
        btnToggle.classList.remove('denied');
        btnToggle.title = 'Notifikasi Aktif: HP akan berbunyi & bergetar saat lemburan baru tercatat';
        if (btnText) btnText.textContent = 'Notif Aktif';
      }
      if (banner) banner.style.display = 'none';
    } else if (Notification.permission === 'denied') {
      if (btnToggle) {
        btnToggle.classList.remove('active');
        btnToggle.classList.add('denied');
        btnToggle.title = 'Notifikasi diblokir di browser. Ketuk untuk melihat petunjuk mengizinkan.';
        if (btnText) btnText.textContent = 'Notif Diblokir';
      }
      if (banner) banner.style.display = 'none';
    } else {
      // 'default' (belum diizinkan)
      if (btnToggle) {
        btnToggle.classList.remove('active');
        btnToggle.classList.remove('denied');
        btnToggle.title = 'Ketuk untuk aktifkan notifikasi lemburan baru';
        if (btnText) btnText.textContent = 'Notifikasi';
      }
      if (banner && sessionStorage.getItem('dismissed_notif_banner') !== 'true') {
        banner.style.display = 'flex';
      }
    }
  }

  if (btnToggle) {
    btnToggle.addEventListener('click', async () => {
      getAudioContext();

      if (!('Notification' in window)) {
        alert('Perangkat atau browser ini belum mendukung Notification API.');
        return;
      }

      if (Notification.permission === 'default') {
        const result = await Notification.requestPermission();
        updateState();
        if (result === 'granted') {
          playNotificationSound();
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          showNativeNotification(
            '🔔 Notifikasi SQA PUMA Aktif!',
            'HP Anda akan berbunyi & bergetar otomatis setiap ada lemburan baru yang dibuat.',
            activeTab
          );
          showToast('✅ Notifikasi Berhasil Diaktifkan!', 'success');
        } else {
          showToast('Izin notifikasi belum diizinkan.', 'info');
        }
      } else if (Notification.permission === 'granted') {
        // Send a test chime & notification so user can verify right away
        playNotificationSound();
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        showNativeNotification(
          '🔔 Tes Notifikasi SQA PUMA',
          'Notifikasi suara, getar, & banner berfungsi sempurna di HP Anda!',
          activeTab
        );
        showToast('🔔 Tes notifikasi terkirim! Suara & getar aktif.', 'success');
      } else {
        alert('Izin notifikasi diblokir oleh setelan browser.\n\nCara mengaktifkannya di HP:\n1. Ketuk ikon gembok/setelan di samping URL di atas.\n2. Buka "Setelan Situs" (Site Settings) atau "Izin".\n3. Ubah "Notifikasi" ke "Izinkan" (Allow).\n4. Muat ulang halaman.');
      }
    });
  }

  const btnAllowBanner = document.getElementById('btn-banner-allow-notif');
  if (btnAllowBanner) {
    btnAllowBanner.addEventListener('click', () => {
      if (btnToggle) btnToggle.click();
    });
  }

  const btnDismissBanner = document.getElementById('btn-banner-dismiss-notif');
  if (btnDismissBanner) {
    btnDismissBanner.addEventListener('click', () => {
      if (banner) banner.style.display = 'none';
      sessionStorage.setItem('dismissed_notif_banner', 'true');
    });
  }

  updateState();
}

// ===================================================================
// Utilities & Toasts
// ===================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeCSV(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '""');
}
