function saveSettings() {
  const proxies = []
  const rows = document.querySelectorAll('.proxy-row')
  rows.forEach(row => {
    const requestUrl = row.querySelector('.requestUrl').value
    const proxyUrl = row.querySelector('.proxyUrl').value
    if (requestUrl && proxyUrl) {
      proxies.push({ requestUrl, proxyUrl })
    }
  })
  const toggleSwitch = document.getElementById('toggleSwitch').checked
  chrome.storage.local.set({ proxies, toggleSwitch }, () => {
    console.log('设置成功')
  })
}

function loadSettings() {
  chrome.storage.local.get(['proxies', 'toggleSwitch'], (result) => {
    const proxies = result.proxies || []
    const toggleSwitch = result.toggleSwitch !== undefined ? result.toggleSwitch : true
    document.getElementById('toggleSwitch').checked = toggleSwitch
    proxies.forEach(proxy => {
      addProxyRow(proxy.requestUrl, proxy.proxyUrl)
    })
  })
}

function clearSettings() {
  chrome.storage.local.remove(['proxies', 'toggleSwitch'], () => {
    const container = document.getElementById('proxyContainer')
    container.innerHTML = ''
  })
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    })
  })
}

function addProxyRow(requestUrl = '', proxyUrl = '') {
  console.log(requestUrl);
  console.log(proxyUrl);
  const container = document.getElementById('proxyContainer')
  const row = document.createElement('div')
  row.className = 'proxy-row'
  row.innerHTML = `
    <div class="proxy-input">
        <input style="width:350px;" type="text" class="requestUrl" placeholder="请求接口" value="${requestUrl}" />
        <input style="width:350px;" type="text" class="proxyUrl" placeholder="代理接口" value="${proxyUrl}" />
        <button class="removeButton">删除</button>
    </div>
  `
  container.appendChild(row)
  row.querySelector('.removeButton').addEventListener('click', () => removeProxyRow(row))
}

function removeProxyRow(row) {
  row.remove()
}

window.onload = loadSettings

document.getElementById('saveButton').addEventListener('click', saveSettings)
document.getElementById('clearButton').addEventListener('click', clearSettings)
document.getElementById('addProxyButton').addEventListener('click', ()=>{
    addProxyRow()
})