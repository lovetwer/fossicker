<template>
  <view class="version-manage-page">
    <view class="filter-bar">
      <view
        v-for="item in statusOptions"
        :key="item.value"
        class="filter-item"
        :class="{ active: currentStatus === item.value }"
        @click="changeStatus(item.value)"
      >
        {{ item.label }}
      </view>
    </view>

    <view v-if="versionList.length > 0" class="version-list">
      <view
        v-for="item in versionList"
        :key="item.id"
        class="version-item card"
      >
        <view class="item-header">
          <view class="version-info">
            <text class="version-name">v{{ item.versionName }}</text>
            <text class="version-code">{{ item.versionCode }}</text>
            <text class="platform-tag" :class="item.platform">{{ item.platform === 'android' ? '安卓' : 'iOS' }}</text>
          </view>
          <text class="status-tag" :class="item.status">{{ getStatusLabel(item.status) }}</text>
        </view>

        <view class="update-content">
          <text class="content-label">更新内容：</text>
          <text class="content-text">{{ item.updateContent || '暂无描述' }}</text>
        </view>

        <view v-if="item.downloadUrl" class="download-url">
          <text class="url-label">下载地址：</text>
          <text class="url-text" @click="copyUrl(item.downloadUrl)">{{ item.downloadUrl }}</text>
        </view>

        <view class="item-footer">
          <text class="create-time">创建于 {{ formatTime(item.createTime) }}</text>
          <view v-if="item.publishTime" class="publish-time">
            发布于 {{ formatTime(item.publishTime) }}
          </view>
        </view>

        <view class="action-bar">
          <view v-if="item.status === 0" class="action-btn publish" @click="handlePublish(item)">
            发布
          </view>
          <view v-if="item.status === 1" class="action-btn unpublish" @click="handleUnpublish(item)">
            下架
          </view>
          <view v-if="item.status === 2" class="action-btn delete" @click="handleDelete(item)">
            删除
          </view>
        </view>
      </view>

      <view v-if="!hasMore && versionList.length > 0" class="no-more">
        没有更多版本了
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">📦</text>
      <text class="empty-text">暂无版本</text>
    </view>

    <view class="add-btn" @click="showAddModal">
      <text class="add-icon">+</text>
    </view>

    <view class="modal" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ editingVersion ? '编辑版本' : '创建新版本' }}</text>
          <text class="modal-close" @click="closeModal">×</text>
        </view>

        <view class="form-item">
          <text class="form-label">平台</text>
          <view class="platform-select">
            <view
              v-for="p in platformOptions"
              :key="p.value"
              class="platform-option"
              :class="{ active: formData.platform === p.value }"
              @click="formData.platform = p.value"
            >
              {{ p.label }}
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">版本号</text>
          <input
            v-model="formData.versionCode"
            class="form-input"
            placeholder="如 1.0.0"
          />
        </view>

        <view class="form-item">
          <text class="form-label">版本名称</text>
          <input
            v-model="formData.versionName"
            class="form-input"
            placeholder="如 1.0.0"
          />
        </view>

        <view class="form-item">
          <text class="form-label">更新内容</text>
          <textarea
            v-model="formData.updateContent"
            class="form-textarea"
            placeholder="请输入更新内容..."
            maxlength="500"
          />
        </view>

        <view class="form-item">
          <text class="form-label">下载地址</text>
          <input
            v-model="formData.downloadUrl"
            class="form-input"
            placeholder="请输入下载链接"
          />
        </view>

        <view class="form-item">
          <text class="form-label">强制更新</text>
          <switch
            :checked="formData.forceUpdate === 1"
            @change="formData.forceUpdate = formData.forceUpdate === 1 ? 0 : 1"
            color="#c93a5a"
          />
        </view>

        <button class="submit-btn" @click="handleSubmit">
          {{ editingVersion ? '保存' : '创建' }}
        </button>
      </view>
    </view>

    <toast ref="toast"></toast>
  </view>
</template>

<script>
import { getVersionList, createVersion, publishVersion, unpublishVersion, deleteVersion } from '@/api/version.js'
import Toast from '@/components/toast/toast.vue'
import toastMixin from '@/mixins/toast.js'

export default {
  components: { Toast },
  mixins: [toastMixin],
  data() {
    return {
      versionList: [],
      page: 0,
      size: 10,
      hasMore: true,
      loading: false,
      currentStatus: null,
      statusOptions: [
        { label: '全部', value: null },
        { label: '待发布', value: 0 },
        { label: '已发布', value: 1 },
        { label: '已下架', value: 2 }
      ],
      platformOptions: [
        { label: '安卓', value: 'android' },
        { label: 'iOS', value: 'ios' }
      ],
      showModal: false,
      editingVersion: null,
      formData: {
        platform: 'android',
        versionCode: '',
        versionName: '',
        updateContent: '',
        downloadUrl: '',
        forceUpdate: 0
      }
    }
  },
  onLoad() {
    this.loadVersions()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore()
    }
  },
  methods: {
    async loadVersions() {
      this.loading = true
      this.page = 0
      try {
        const params = {}
        if (this.currentStatus !== null) {
          params.status = this.currentStatus
        }
        const res = await getVersionList(params)
        if (res.code === 200) {
          const data = res.data
          if (Array.isArray(data)) {
            this.versionList = data
          } else if (data && Array.isArray(data.content)) {
            this.versionList = data.content
          } else {
            this.versionList = []
          }
          this.hasMore = false
        }
      } catch (e) {
        this.$toastError('加载失败')
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      if (!this.hasMore) return
      this.page++
      this.loading = true
      try {
        const params = { page: this.page, size: this.size }
        if (this.currentStatus !== null) {
          params.status = this.currentStatus
        }
        const res = await getVersionList(params)
        if (res.code === 200) {
          const data = res.data
          if (data && Array.isArray(data.content)) {
            this.versionList.push(...data.content)
            this.hasMore = (data.number || 0) < (data.totalPages - 1)
          } else {
            this.hasMore = false
          }
        }
      } catch (e) {
        this.page--
        this.$toastError('加载失败')
      } finally {
        this.loading = false
      }
    },
    changeStatus(status) {
      this.currentStatus = status
      this.loadVersions()
    },
    getStatusLabel(status) {
      const map = { 0: '待发布', 1: '已发布', 2: '已下架' }
      return map[status] || '未知'
    },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    copyUrl(url) {
      uni.setClipboardData({
        data: url,
        success: () => {
          this.$toastSuccess('链接已复制')
        }
      })
    },
    showAddModal() {
      this.editingVersion = null
      this.formData = {
        platform: 'android',
        versionCode: '',
        versionName: '',
        updateContent: '',
        downloadUrl: '',
        forceUpdate: 0
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async handleSubmit() {
      if (!this.formData.versionCode.trim()) {
        this.$toastInfo('请输入版本号')
        return
      }
      if (!this.formData.versionName.trim()) {
        this.$toastInfo('请输入版本名称')
        return
      }
      try {
        const data = {
          platform: this.formData.platform,
          versionCode: this.formData.versionCode.trim(),
          versionName: this.formData.versionName.trim(),
          updateContent: this.formData.updateContent.trim(),
          downloadUrl: this.formData.downloadUrl.trim(),
          forceUpdate: this.formData.forceUpdate
        }
        if (this.editingVersion) {
          await this.handleUpdate(data)
        } else {
          await createVersion(data)
          this.$toastSuccess('创建成功')
        }
        this.closeModal()
        this.loadVersions()
      } catch (e) {
        this.$toastError(this.editingVersion ? '保存失败' : '创建失败')
      }
    },
    async handlePublish(item) {
      try {
        await publishVersion(item.id)
        this.$toastSuccess('发布成功')
        this.loadVersions()
      } catch (e) {
        this.$toastError('发布失败')
      }
    },
    async handleUnpublish(item) {
      try {
        await unpublishVersion(item.id)
        this.$toastSuccess('下架成功')
        this.loadVersions()
      } catch (e) {
        this.$toastError('下架失败')
      }
    },
    async handleDelete(item) {
      const res = await new Promise((resolve) => {
        this.$modal({
          title: '确认删除',
          content: '确定要删除这个版本吗？',
          confirmText: '删除'
        }).then(resolve)
      })
      if (res.confirm) {
        try {
          await deleteVersion(item.id)
          this.$toastSuccess('删除成功')
          this.loadVersions()
        } catch (e) {
          this.$toastError('删除失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.version-manage-page {
  min-height: 100vh;
  background: #f8f6f8;
  padding-bottom: 120rpx;
}

.filter-bar {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #fff;
  margin-bottom: 20rpx;
  overflow-x: auto;
}

.filter-item {
  padding: 16rpx 32rpx;
  background: #f3f4f6;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #6b7280;
  white-space: nowrap;
}

.filter-item.active {
  background: #c93a5a;
  color: #fff;
}

.version-list {
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.version-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.version-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2937;
}

.version-code {
  font-size: 24rpx;
  color: #6b7280;
}

.platform-tag {
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.platform-tag.android {
  background: #dbeafe;
  color: #2563eb;
}

.platform-tag.ios {
  background: #f3e8ff;
  color: #9333ea;
}

.status-tag {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.status-tag.status_0 {
  background: #fef3c7;
  color: #d97706;
}

.status-tag.status_1 {
  background: #dcfce7;
  color: #16a34a;
}

.status-tag.status_2 {
  background: #f3f4f6;
  color: #6b7280;
}

.update-content {
  background: #f9fafb;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.content-label {
  font-size: 24rpx;
  color: #6b7280;
  display: block;
  margin-bottom: 8rpx;
}

.content-text {
  font-size: 26rpx;
  color: #374151;
  line-height: 1.5;
}

.download-url {
  margin-bottom: 16rpx;
}

.url-label {
  font-size: 24rpx;
  color: #6b7280;
}

.url-text {
  font-size: 24rpx;
  color: #2563eb;
  word-break: break-all;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.create-time,
.publish-time {
  font-size: 22rpx;
  color: #9ca3af;
}

.action-bar {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  padding: 12rpx 32rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.action-btn.publish {
  background: #c93a5a;
  color: #fff;
}

.action-btn.unpublish {
  background: #f59e0b;
  color: #fff;
}

.action-btn.delete {
  background: #ef4444;
  color: #fff;
}

.no-more {
  text-align: center;
  padding: 40rpx;
  font-size: 26rpx;
  color: #9ca3af;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #6b7280;
}

.add-btn {
  position: fixed;
  right: 40rpx;
  bottom: 60rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #c93a5a 0%, #e66584 100%);
  box-shadow: 0 12rpx 40rpx rgba(201, 58, 90, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.add-icon {
  font-size: 60rpx;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-height: 85vh;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  font-size: 60rpx;
  color: #9ca3af;
  line-height: 1;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: #6b7280;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background: #f9fafb;
  border: 1rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  background: #f9fafb;
  border: 1rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.platform-select {
  display: flex;
  gap: 20rpx;
}

.platform-option {
  padding: 16rpx 40rpx;
  background: #f3f4f6;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #6b7280;
}

.platform-option.active {
  background: #c93a5a;
  color: #fff;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #c93a5a;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
}
</style>