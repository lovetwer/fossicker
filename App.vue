<script>
export default {
  onLaunch() {
    console.log('App Launch')
    // 挂载自定义 toast 到全局
    this.$mountToast()
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  methods: {
    $mountToast() {
      // 创建 toast 实例并挂载到全局
      const toastVm = {
        show: (options) => {
          const pages = getCurrentPages()
          const page = pages[pages.length - 1]
          if (page && page.$refs && page.$refs.toast) {
            return page.$refs.toast.show(options)
          }
          // 如果当前页面没有 toast 组件，使用 uni.showToast 降级
          return uni.showToast(options)
        },
        hide: () => {
          const pages = getCurrentPages()
          const page = pages[pages.length - 1]
          if (page && page.$refs && page.$refs.toast) {
            page.$refs.toast.hide()
          }
        },
        success: (message, duration) => {
          return toastVm.show({ title: message, icon: 'success', duration })
        },
        error: (message, duration) => {
          return toastVm.show({ title: message, icon: 'error', duration })
        },
        loading: (message) => {
          return toastVm.show({ title: message, icon: 'loading', duration: 0 })
        },
        info: (message, duration) => {
          return toastVm.show({ title: message, icon: 'none', duration })
        }
      }
      
      uni.$toast = toastVm
      this.globalData = { toast: toastVm }
    }
  }
}
</script>

<style>
page {
  font-family: 'Trebuchet MS', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  color: var(--ink-900);
  background:
    radial-gradient(circle at top left, rgba(201, 58, 90, 0.08), transparent 32%),
    radial-gradient(circle at top right, rgba(244, 183, 196, 0.14), transparent 26%),
    linear-gradient(180deg, #fffaf5 0%, #fdf7ef 48%, #fceff3 100%);
}

page,
view,
text,
button,
input,
textarea,
scroll-view {
  box-sizing: border-box;
}

:root {
  --accent: #c93a5a;
  --accent-deep: #a92a47;
  --accent-soft: #fceff3;
  --gold: #f4b7c4;
  --gold-soft: #fff1f5;
  --ink-900: #1f2937;
  --ink-700: #4b5563;
  --ink-500: #8a94a6;
  --line: rgba(31, 41, 55, 0.08);
  --card: rgba(255, 255, 255, 0.92);
  --shadow: 0 18rpx 48rpx rgba(116, 63, 77, 0.08);
  --radius-xl: 32rpx;
  --radius-lg: 24rpx;
  --radius-md: 18rpx;
}

button {
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  line-height: inherit;
}

button::after {
  border: none;
}

input,
textarea {
  outline: none;
}

.card {
  background: var(--card);
  border: 1rpx solid rgba(255, 255, 255, 0.88);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18rpx);
}

.primary-button {
  height: 96rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, var(--accent) 0%, #f08ca4 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.secondary-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: var(--ink-700);
  background: rgba(255, 255, 255, 0.78);
  border: 1rpx solid rgba(31, 41, 55, 0.06);
}
</style>






