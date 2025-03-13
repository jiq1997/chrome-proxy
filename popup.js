// popup.js

// 保存设置
function saveSettings() {
  chrome.storage.local.set({
    requestUrl: document.getElementById('requestUrl').value,
    proxyUrl: document.getElementById('proxyUrl').value,
  })
}

// 加载设置
function loadSettings() {
  chrome.storage.local.get(['requestUrl', 'proxyUrl'], (result) => {
    document.getElementById('requestUrl').value = result.requestUrl || ''
    document.getElementById('proxyUrl').value = result.proxyUrl || ''
  })
}

// 清空设置
function clearSettings() {
  document.getElementById('requestUrl').value = ''
  document.getElementById('proxyUrl').value = ''
  chrome.storage.local.remove(['requestUrl', 'proxyUrl'], () => {
    // 清空设置时移除代理规则
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1], // 移除代理规则
    })
  })
}

// 页面加载时自动加载设置
window.onload = loadSettings

// 添加事件监听器
document.getElementById('saveButton').addEventListener('click', saveSettings)
document.getElementById('clearButton').addEventListener('click', clearSettings)
document.getElementById('loadButton').addEventListener('click', loadSettings)
