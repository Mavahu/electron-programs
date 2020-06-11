const { app, BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
  constructor(file, isDev) {
    console.log(`${__dirname}/assets/icons/icon.png`);
    super({
      title: "SysTop",
      width: isDev ? 800 : 355,
      height: 500,
      icon: `${__dirname}/assets/icons/icon.png`,
      resizable: isDev,
      backgroundColor: "white",
      show: false,
      opacity: 0.9,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.loadFile(file);

    if (isDev) {
      this.webContents.openDevTools();
    }

    this.on("close", (e) => this.onClose(e));
  }

  onClose(e) {
    if (!app.isQuitting) {
      e.preventDefault();
      this.hide();
    }

    return true;
  }
}

module.exports = MainWindow;
