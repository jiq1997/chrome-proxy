chrome.runtime.onInstalled.addListener(() => {
  updateRules()
})

chrome.storage.onChanged.addListener(() => {
  console.log('设置更新啦');
  updateRules()
})

function updateRules() {
  chrome.storage.local.get(['proxies', 'toggleSwitch'], (result) => {
    const proxies = result.proxies || []
    const toggleSwitch = result.toggleSwitch !== undefined ? result.toggleSwitch : true
    if (!toggleSwitch) {
      chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
        const existingRuleIds = existingRules.map(rule => rule.id);
        chrome.declarativeNetRequest.updateDynamicRules(
          {
            removeRuleIds: existingRuleIds
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error('更新动态规则时出错:', chrome.runtime.lastError)
            } else {
              console.log('动态规则已成功更新')
            }
          }
        )
      })
      return
    }

    const rules = proxies.map((proxy, index) => {
      const escapedRequestUrl = proxy.requestUrl
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
      return {
        id: index + 1, // 确保 id 是整数
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: `${proxy.proxyUrl.trim()}\\1`, // 使用代理 URL
          },
        },
        condition: {
          regexFilter: `^${escapedRequestUrl}(.*)`,
          resourceTypes: ['xmlhttprequest', 'main_frame', 'sub_frame'], // 'main_frame', 'sub_frame'
        },
      }
    })
    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const existingRuleIds = existingRules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: rules,
          removeRuleIds: existingRuleIds
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error('更新动态规则时出错:', chrome.runtime.lastError)
          } else {
            console.log('动态规则已成功更新')
          }
        }
      )
    })
  })
}