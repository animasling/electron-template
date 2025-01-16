
// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const path = require('path')
const fs = require('fs');
// const updateElectron = require('update-electron-app');

// updateElectron(); // 检查更新

const handleSaveFile = (event, data) => {
  console.log(data)
  fs.writeFileSync('/Users/mac/Desktop/临时/hello2.txt', data)
}

const handleReadFile = (event, data) => {
  return fs.readFileSync('/Users/mac/Desktop/临时/hello2.txt').toString();
}

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true, // 隐藏菜单栏
    // x:0, // 设置窗口位置
    // y:0,
    alwaysOnTop: true, // 窗口置顶
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('save-file', handleSaveFile);
  ipcMain.handle('read-file', handleReadFile);
  
  setTimeout(() => {
    mainWindow.webContents.send('send-message', 'hello world')
  }, 6000)

  // 加载 本地index.html
  mainWindow.loadFile('src/pages/Home/index.html') 
  // 加载 网页
  // mainWindow.loadURL('http://baidu.com')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})