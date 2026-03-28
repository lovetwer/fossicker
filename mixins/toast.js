// Toast mixin - 为页面添加自定义 Toast 和 Modal 功能
export default {
  methods: {
    // Toast 方法
    $toast(options) {
      if (this.$refs.toast) {
        return this.$refs.toast.show(options)
      }
      // 降级到 uni.showToast
      return uni.showToast(options)
    },
    $toastSuccess(message, duration = 2000) {
      return this.$toast({ title: message, icon: 'success', duration })
    },
    $toastError(message, duration = 2000) {
      return this.$toast({ title: message, icon: 'error', duration })
    },
    $toastLoading(message = '加载中...') {
      return this.$toast({ title: message, icon: 'loading', duration: 0 })
    },
    $toastInfo(message, duration = 2000) {
      return this.$toast({ title: message, icon: 'none', duration })
    },
    $toastHide() {
      if (this.$refs.toast) {
        this.$refs.toast.hide()
      }
    },

    // Modal 方法
    $modal(options) {
      if (this.$refs.modal) {
        return this.$refs.modal.show(options)
      }
      // 降级到 uni.showModal
      return uni.showModal(options)
    },
    $modalConfirm(content, title = '提示') {
      return this.$modal({ title, content, showCancel: false })
    },
    $modalAlert(content, title = '提示') {
      return this.$modal({ title, content, showCancel: false, confirmText: '知道了' })
    }
  }
}
