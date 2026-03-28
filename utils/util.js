// 工具函数

export function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  const time = d.getTime()
  if (Number.isNaN(time)) return ''

  const now = Date.now()
  const diff = now - time

  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatNumber(num) {
  if (num === null || num === undefined || num === '') return 0
  const value = Number(num)
  if (Number.isNaN(value)) return num
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value
}

export function formatPrice(price) {
  if (price === 0 || price === '0') return '免费'
  if (price === null || price === undefined || price === '') return ''
  return `¥${parseFloat(price).toFixed(2)}`
}

export function formatCountdown(endTime) {
  if (!endTime) return ''
  const end = new Date(endTime).getTime()
  if (Number.isNaN(end)) return ''

  const diff = end - Date.now()
  if (diff <= 0) return '已结束'

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)

  if (days > 0) return `${days}天${hours}小时后结束`
  if (hours > 0) return `${hours}小时${minutes}分钟后结束`
  return `${Math.max(minutes, 1)}分钟后结束`
}

export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle(fn, interval = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}

export function copyText(text) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        uni.showToast({ title: '已复制', icon: 'success' })
        resolve()
      },
      fail: (err) => {
        uni.showToast({ title: '复制失败', icon: 'none' })
        reject(err)
      }
    })
  })
}
