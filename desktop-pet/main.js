const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');

const WEB_URL = 'https://jingqix60-ctrl.github.io/c9-cultivation/';

let mainWindow = null;
let petWindow = null;
let tray = null;

// ── 主窗口（嵌网站） ──
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '天道修炼 · C9考研数学',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(WEB_URL);
  mainWindow.webContents.on('page-title-updated', (e) => e.preventDefault());
  mainWindow.on('close', (e) => { e.preventDefault(); mainWindow.hide(); });
}

// ── 灵宠悬浮窗 ──
function createPetWindow() {
  petWindow = new BrowserWindow({
    width: 320,
    height: 280,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  petWindow.loadFile('pet.html');
  petWindow.setPosition(50, 100);

  // 拖拽
  ipcMain.on('pet-move', (e, { dx, dy }) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win) {
      const [x, y] = win.getPosition();
      win.setPosition(x + dx, y + dy);
    }
  });

  // 从主窗口同步进度
  ipcMain.on('sync-progress', async (e) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        const data = await mainWindow.webContents.executeJavaScript(`
          (function() {
            const result = {};
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key.startsWith('c9_')) {
                try { result[key] = JSON.parse(localStorage.getItem(key)); }
                catch { result[key] = localStorage.getItem(key); }
              }
            }
            return result;
          })()
        `);
        if (petWindow && !petWindow.isDestroyed()) {
          petWindow.webContents.send('progress-update', data);
        }
      } catch (err) { console.error('sync error:', err); }
    }
  });
}

// ── 系统托盘 ──
function createTray() {
  tray = new Tray(nativeImage.createEmpty());
  tray.setToolTip('天道修炼 · C9考研数学');
  const menu = Menu.buildFromTemplate([
    { label: '📖 打开修炼', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
    { label: '🐾 灵宠', click: () => { if (petWindow && !petWindow.isDestroyed()) petWindow.show(); } },
    { type: 'separator' },
    { label: '退出', click: () => { app.isQuitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(menu);
  tray.on('double-click', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } });
}

// ── 定时同步（每30秒） ──
setInterval(() => {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.webContents.send('sync-progress');
  }
}, 30000);

app.whenReady().then(() => {
  createMainWindow();
  createPetWindow();
  createTray();
  // 启动后同步
  setTimeout(() => {
    if (petWindow && !petWindow.isDestroyed()) petWindow.webContents.send('sync-progress');
  }, 3000);
});

app.on('window-all-closed', () => {});
app.on('activate', () => { if (mainWindow) mainWindow.show(); });
