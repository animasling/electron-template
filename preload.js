const { contextBridge, ipcRenderer, ipcMain } = require('electron');

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('api', {
  electron: process.versions.electron,
  saveFile: data => ipcRenderer.send('save-file', data),
  readFile: () => ipcRenderer.invoke('read-file'), // invoke 返回promise
  getMessage: (cb) => ipcRenderer.on('send-message', cb),
})


// 渲染进程和主进程通信通过 预加载脚本(preload) 通信

// 渲染进程 => 主进程的通信
// 渲染进程: api.saveFile(data);
// preload: savaFile: data => ipcRenderer.send('save-file', data)
// 主进程: ipcMain.on('save-file', handleSaveFile)

// 主进程 <=> 渲染进程的通信，在上面的方法下再加上下面的方法即可
// 渲染进程: api.readFile();
// preload: readFile: () => ipcRenderer.invoke('read-file')
// 主进程: ipcMain.handle('read-file', handleReadFile)

// 主进程 => 渲染进程的通信(主进程主动发送消给渲染进程)
// 主进程: win.weContents.send('send-message', data)
// preload: getMessage: (cb) => ipcRenderer.on('send-message', cb))
// 渲染进程: api.getMessage((event, message) => console.log(message));
