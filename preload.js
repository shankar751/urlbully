const { contextBridge, ipcRenderer, powerMonitor } = require('electron')
const electron = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('usage', {
  cpu: process.getCPUUsage().percentCPUUsage.toString().slice(0, 5)
});
ipcRenderer.on('cpu', (event, data) => {
  const cpuBar = document.getElementById('cpu-graph-bar');
  cpuBar.innerHTML = Math.round(data.toFixed(2))+'%';
  cpuBar.style.width = Math.round(data.toFixed(2))+'%';
});
ipcRenderer.on('mem', (event, data) => {
  const memBar = document.getElementById('mem-graph-bar');
  memBar.innerHTML = Math.round(data.toFixed(2))+'%';
  memBar.style.width = Math.round(data.toFixed(2))+'%';
  //document.getElementById('mem').innerHTML = data.toFixed(2);
});
ipcRenderer.on('total-mem', (event, data) => {
  //document.getElementById('total-mem').innerHTML = Math.round(data.toFixed(2));
});
