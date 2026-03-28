<template>
  <view class="send-page">
    <view class="form-section card">
      <view class="form-item">
        <text class="form-label">通知标题</text>
        <input
          v-model="form.title"
          placeholder="请输入通知标题"
          class="form-input"
          maxlength="50"
        />
      </view>
      <view class="form-item">
        <text class="form-label">通知内容</text>
        <textarea
          v-model="form.content"
          placeholder="请输入通知内容"
          class="form-textarea"
          maxlength="500"
        ></textarea>
        <text class="char-count">{{ form.content.length }}/500</text>
      </view>
      <view class="form-item">
        <text class="form-label">指定用户</text>
        <input
          v-model="searchKeyword"
          placeholder="搜索用户昵称，不填则发送给所有人"
          class="form-input"
          @input="handleSearch"
          @focus="showDropdown = true"
        />
        <view class="user-dropdown" v-if="showDropdown && searchResults.length > 0">
          <view
            class="user-item"
            v-for="user in searchResults"
            :key="user.id || user._id"
            @click="selectUser(user)"
          >
            <text class="user-name">{{ user.nickname || user.username }}</text>
          </view>
        </view>
        <view class="selected-user" v-if="selectedUser">
          <text>已选择: {{ selectedUser.nickname || selectedUser.username }}</text>
          <text class="clear-btn" @click="clearUser">清除</text>
        </view>
      </view>
    </view>

    <view class="submit-section">
      <button class="submit-btn" @click="handleSend" :disabled="submitting">
        {{ submitting ? '发送中...' : '发送通知' }}
      </button>
    </view>
    
    <!-- 自定义 Toast -->
    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { sendNotification, searchUsers } from '@/api/user.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      form: {
        title: '',
        content: '',
        userId: ''
      },
      searchKeyword: '',
      searchResults: [],
      selectedUser: null,
      showDropdown: false,
      submitting: false,
      searchTimer: null
    }
  },
  methods: {
    async handleSearch() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      if (!this.searchKeyword.trim()) {
        this.searchResults = []
        return
      }
      this.searchTimer = setTimeout(async () => {
        try {
          const res = await searchUsers(this.searchKeyword)
          if (res.code === 200) {
            this.searchResults = res.data?.content || res.data || []
          }
        } catch (e) {
          console.error('搜索用户失败', e)
        }
      }, 300)
    },
    selectUser(user) {
      this.selectedUser = user
      this.form.userId = user.id || user._id
      this.searchKeyword = ''
      this.searchResults = []
      this.showDropdown = false
    },
    clearUser() {
      this.selectedUser = null
      this.form.userId = ''
    },
    async handleSend() {
      if (!this.form.title.trim()) {
        this.$toastInfo('请输入标题')
        return
      }
      if (!this.form.content.trim()) {
        this.$toastInfo('请输入内容')
        return
      }

      this.submitting = true
      try {
        const res = await sendNotification(this.form)
        if (res.code === 200) {
          this.$toastSuccess('发送成功')
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          this.$toastError(res.message || '发送失败')
        }
      } catch (e) {
        this.$toastError('发送失败')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.send-page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f5f5;
}
.form-section {
  padding: 24rpx;
}
.form-item {
  margin-bottom: 32rpx;
  position: relative;
}
.form-item:last-child {
  margin-bottom: 0;
}
.form-label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}
.form-input {
  height: 88rpx;
  padding: 0 24rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  font-size: 28rpx;
}
.form-textarea {
  width: 100%;
  height: 240rpx;
  padding: 24rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}
.char-count {
  display: block;
  text-align: right;
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}
.user-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 400rpx;
  overflow-y: auto;
}
.user-item {
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-item:last-child {
  border-bottom: none;
}
.user-name {
  font-size: 28rpx;
  color: #1f2937;
}
.selected-user {
  margin-top: 16rpx;
  padding: 16rpx 24rpx;
  background: #e8f5e9;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #4caf50;
}
.clear-btn {
  color: #999;
}
.submit-section {
  margin-top: 48rpx;
  padding: 0 24rpx;
}
.submit-btn {
  height: 88rpx;
  border-radius: 12rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-btn[disabled] {
  opacity: 0.7;
}
</style>
