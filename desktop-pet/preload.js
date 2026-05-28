const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onProgressUpdate: (callback) => ipcRenderer.on('progress-update', (_, data) => callback(data)),
  onShowQuiz: (callback) => ipcRenderer.on('show-quiz', (_, task) => callback(task)),
  // 窗口拖拽：渲染进程通知主进程移动窗口
  moveWindow: (dx, dy) => ipcRenderer.send('pet-move', { dx, dy }),
  // 手动触发同步
  syncNow: () => ipcRenderer.send('sync-progress'),
});
