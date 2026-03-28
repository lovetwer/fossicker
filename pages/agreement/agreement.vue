<template>
  <view class="agreement-page">
    <view class="header">
      <text class="title">用户协议</text>
    </view>
    
    <view class="content card">
      <view class="section">
        <text class="section-title">一、协议接受</text>
        <text class="section-text">
          欢迎使用"薅羊毛情报站"！在您使用本应用之前，请仔细阅读本用户协议。当您点击"同意"或开始使用本应用时，即表示您已阅读、理解并同意接受本协议的所有条款。
          
          如果您不同意本协议的任何内容，请立即停止使用本应用。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">二、服务说明</text>
        <text class="section-text">
          1. 本应用是一个优惠信息分享平台，为用户提供各类优惠活动的发布、浏览和分享服务。
          
          2. 我们保留随时修改、暂停或终止服务的权利，且无需事先通知。
          
          3. 我们不对服务的及时性、安全性、准确性做任何担保。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">三、账号注册与安全</text>
        <text class="section-text">
          1. 您需要提供真实、准确、完整的注册信息，并及时更新。
          
          2. 您有责任妥善保管账号和密码，对账号下的所有行为负责。
          
          3. 如发现账号被盗或异常，请立即联系我们。
          
          4. 我们有权对违反规定的账号进行封禁处理。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">四、用户行为规范</text>
        <text class="section-text">
          您在使用本应用时，不得从事以下行为：
          
          1. 发布虚假、欺诈、误导性的优惠信息
          2. 侵犯他人知识产权或其他合法权益
          3. 传播违法、违规、有害信息
          4. 从事任何商业广告行为（经授权除外）
          5. 干扰、破坏本应用的正常运行
          6. 其他任何违反法律法规的行为
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">五、内容发布</text>
        <text class="section-text">
          1. 您发布的内容应真实、合法、有效。
          
          2. 您对自己发布的内容承担全部法律责任。
          
          3. 我们有权对违规内容进行删除、屏蔽等处理。
          
          4. 您授予我们使用、复制、修改、发布您内容的权利。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">六、知识产权</text>
        <text class="section-text">
          1. 本应用的界面设计、代码、商标等知识产权归我们所有。
          
          2. 用户发布内容的知识产权归用户所有，但用户授予我们使用许可。
          
          3. 未经授权，不得复制、修改、传播本应用的任何内容。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">七、免责声明</text>
        <text class="section-text">
          1. 本应用仅作为信息平台，不对优惠信息的真实性、有效性负责。
          
          2. 用户应自行判断信息可靠性，谨慎参与活动。
          
          3. 因使用本应用导致的任何损失，我们不承担责任。
          
          4. 对于第三方链接，我们不对其内容和安全性负责。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">八、协议修改</text>
        <text class="section-text">
          我们有权随时修改本协议，修改后的协议将在应用内公布。如您继续使用本应用，即视为接受修改后的协议。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">九、法律适用</text>
        <text class="section-text">
          本协议的订立、执行和解释均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方均可向我们所在地人民法院提起诉讼。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">十、联系我们</text>
        <text class="section-text">
          如您对本协议有任何疑问，请通过应用内反馈功能联系我们。
        </text>
      </view>
    </view>
    
    <view class="footer">
      <text class="footer-text">最后更新：2026年3月</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AgreementPage'
}
</script>

<style scoped>
.agreement-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf8f9 0%, #f8f0f2 100%);
  padding: 24rpx;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1f2937;
}

.content {
  padding: 32rpx;
}

.section {
  margin-bottom: 48rpx;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #c93a5a;
  margin-bottom: 20rpx;
}

.section-text {
  display: block;
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.8;
  white-space: pre-wrap;
}

.footer {
  text-align: center;
  padding: 40rpx 0;
}

.footer-text {
  font-size: 24rpx;
  color: #9ca3af;
}
</style>
