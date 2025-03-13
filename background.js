chrome.runtime.onInstalled.addListener(() => {
  // 加载默认规则
  chrome.storage.local.get(['requestUrl', 'proxyUrl'], (result) => {
    if (result.requestUrl && result.proxyUrl) {
      const escapedRequestUrl = result.requestUrl
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
      const rule = {
        id: 1, // 确保 id 是整数
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: `${result.proxyUrl.trim()}\\1`, // 使用代理 URL
          },
        },
        condition: {
          regexFilter: `^${escapedRequestUrl}(.*)`,
          resourceTypes: ['xmlhttprequest', 'main_frame', 'sub_frame'], // 'main_frame', 'sub_frame'
        },
      }
      console.log('%c!<----start ---->', 'color:mediumspringgreen')
      console.log(rule)
      console.log('%c!<---- end ---->', 'color:mediumspringgreen')
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: [rule],
          removeRuleIds: [1], // 移除之前的规则
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error('更新动态规则时出错:', chrome.runtime.lastError)
          } else {
            console.log('动态规则已成功更新')
          }
        }
      )
    }
  })
})

// 监听设置的变化
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(['requestUrl', 'proxyUrl'], (result) => {
    if (result.requestUrl && result.proxyUrl) {
      const escapedRequestUrl = result.requestUrl
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符

      const rule = {
        id: 1, // 确保 id 是整数
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: `${result.proxyUrl.trim()}\\1`, // 使用代理 URL
          },
        },
        condition: {
          regexFilter: `^${escapedRequestUrl}(.*)`,
          resourceTypes: ['xmlhttprequest', 'main_frame', 'sub_frame'], // 'main_frame', 'sub_frame'
        },
      }
      console.log('%c!<----start ---->', 'color:mediumspringgreen')
      console.log(rule)
      console.log('%c!<---- end ---->', 'color:mediumspringgreen')
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          addRules: [rule],
          removeRuleIds: [1], // 移除之前的规则
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error('更新动态规则时出错:', chrome.runtime.lastError)
          } else {
            console.log('动态规则已成功更新')
          }
        }
      )
    }
  })
})
