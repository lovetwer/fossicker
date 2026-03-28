if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const BASE_URL = "https://yeiviicucucv.ap-northeast-1.clawcloudrun.com";
  const request = (options) => {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync("token");
      uni.request({
        url: BASE_URL + options.url,
        method: options.method || "GET",
        data: options.data || {},
        header: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          ...options.header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
            uni.showToast({
              title: "登录已过期",
              icon: "none"
            });
            reject(res.data);
          } else {
            reject(res.data);
          }
        },
        fail: (err) => {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
          reject(err);
        }
      });
    });
  };
  const get = (url, params = {}) => {
    return request({
      url,
      method: "GET",
      data: params
    });
  };
  const post = (url, data = {}) => {
    return request({
      url,
      method: "POST",
      data
    });
  };
  const put = (url, data = {}) => {
    return request({
      url,
      method: "PUT",
      data
    });
  };
  const del = (url, data = {}) => {
    return request({
      url,
      method: "DELETE",
      data
    });
  };
  const postWithQuery = (url, data = {}) => {
    const queryString = Object.entries(data).filter(([_, v]) => v !== void 0 && v !== null && v !== "").map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return request({
      url: fullUrl,
      method: "POST"
    });
  };
  const putWithQuery = (url, data = {}) => {
    const queryString = Object.entries(data).filter(([_, v]) => v !== void 0 && v !== null && v !== "").map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return request({
      url: fullUrl,
      method: "PUT"
    });
  };
  const createVersion = (data) => {
    return post("/version/create", data);
  };
  const publishVersion = (id) => {
    return post(`/version/publish/${id}`);
  };
  const unpublishVersion = (id) => {
    return post(`/version/unpublish/${id}`);
  };
  const getVersionList = (params) => {
    return get("/version/list", params);
  };
  const getLatestVersion = (params) => {
    return get("/version/latest", params);
  };
  const checkVersionUpdate = (params) => {
    return postWithQuery("/version/check", params);
  };
  const deleteVersion = (id) => {
    return del(`/version/delete/${id}`);
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$t = {
    name: "SplashPage",
    data() {
      return {
        version: "1.0.0",
        canNavigate: false,
        minShowTime: null
      };
    },
    async onLoad() {
      await this.loadVersion();
    },
    onReady() {
      this.minShowTime = setTimeout(() => {
        this.canNavigate = true;
        this.tryNavigate();
      }, 2e3);
    },
    onUnload() {
      if (this.minShowTime) {
        clearTimeout(this.minShowTime);
      }
    },
    methods: {
      async loadVersion() {
        try {
          const platform = uni.getSystemInfoSync().platform.toLowerCase();
          const res = await getLatestVersion({
            platform: platform === "android" ? "android" : "ios"
          });
          if (res.code === 200 && res.data) {
            this.version = res.data.versionName || "1.0.0";
          }
        } catch (e) {
          formatAppLog("log", "at pages/splash/splash.vue:76", "获取版本失败", e);
        }
      },
      tryNavigate() {
        if (this.canNavigate) {
          uni.redirectTo({ url: "/pages/index/index" });
        }
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "splash-page" }, [
      vue.createElementVNode("view", { class: "sheep" }, [
        vue.createElementVNode("view", { class: "wool wool-1" }),
        vue.createElementVNode("view", { class: "wool wool-2" }),
        vue.createElementVNode("view", { class: "wool wool-3" }),
        vue.createElementVNode("view", { class: "wool wool-4" }),
        vue.createElementVNode("view", { class: "wool wool-5" }),
        vue.createElementVNode("view", { class: "wool wool-6" }),
        vue.createElementVNode("view", { class: "wool wool-7" }),
        vue.createElementVNode("view", { class: "face" }, [
          vue.createElementVNode("view", { class: "eye eye-left" }, [
            vue.createElementVNode("view", { class: "pupil" }),
            vue.createElementVNode("view", { class: "highlight" })
          ]),
          vue.createElementVNode("view", { class: "eye eye-right open" }, [
            vue.createElementVNode("view", { class: "pupil" }),
            vue.createElementVNode("view", { class: "highlight" })
          ]),
          vue.createElementVNode("view", { class: "eye eye-right closed" }),
          vue.createElementVNode("view", { class: "cheek cheek-left" }),
          vue.createElementVNode("view", { class: "cheek cheek-right" }),
          vue.createElementVNode("view", { class: "nose" }),
          vue.createElementVNode("view", { class: "mouth" })
        ]),
        vue.createElementVNode("view", { class: "horn horn-left" }),
        vue.createElementVNode("view", { class: "horn horn-right" })
      ]),
      vue.createElementVNode("text", { class: "app-name" }, "薅羊毛"),
      vue.createElementVNode("text", { class: "app-slogan" }, "优雅省钱 · 品质生活"),
      vue.createElementVNode(
        "text",
        { class: "version" },
        "v" + vue.toDisplayString($data.version),
        1
        /* TEXT */
      )
    ]);
  }
  const PagesSplashSplash = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-b5d3b004"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/splash/splash.vue"]]);
  const _sfc_main$s = {
    name: "CustomToast",
    data() {
      return {
        visible: false,
        message: "",
        type: "none",
        duration: 2e3,
        showIcon: true,
        timer: null
      };
    },
    methods: {
      show(options = {}) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.message = options.title || options.message || "";
        this.type = options.icon || options.type || "none";
        this.duration = options.duration || 2e3;
        this.showIcon = options.showIcon !== false;
        this.visible = true;
        if (this.type !== "loading") {
          this.timer = setTimeout(() => {
            this.hide();
          }, this.duration);
        }
        return this;
      },
      hide() {
        this.visible = false;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      },
      success(message, duration) {
        return this.show({ title: message, icon: "success", duration });
      },
      error(message, duration) {
        return this.show({ title: message, icon: "error", duration });
      },
      loading(message) {
        return this.show({ title: message, icon: "loading", duration: 0 });
      },
      info(message, duration) {
        return this.show({ title: message, icon: "none", duration });
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.visible ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "toast-container",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.hide && $options.hide(...args))
    }, [
      vue.createElementVNode("view", { class: "toast-mask" }),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["toast-content", $data.type])
        },
        [
          $data.showIcon ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "toast-icon"
          }, [
            $data.type === "success" ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "✓")) : $data.type === "error" ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "✗")) : $data.type === "loading" ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 2,
              class: "loading"
            })) : (vue.openBlock(), vue.createElementBlock("text", { key: 3 }, "ℹ"))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "text",
            { class: "toast-text" },
            vue.toDisplayString($data.message),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      )
    ])) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-001f1a33"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/components/toast/toast.vue"]]);
  const _sfc_main$r = {
    name: "CustomTabbar",
    props: {
      current: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isPressing: false
      };
    },
    methods: {
      onPressStart() {
        this.isPressing = true;
      },
      onPressEnd() {
        setTimeout(() => {
          this.isPressing = false;
        }, 150);
      },
      switchTab(index) {
        if (index === this.current)
          return;
        const pages = ["/pages/index/index", "/pages/publish/publish", "/pages/mine/mine"];
        if (index === 1) {
          uni.navigateTo({
            url: pages[index]
          });
        } else {
          uni.redirectTo({
            url: pages[index]
          });
        }
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "custom-tabbar" }, [
      vue.createElementVNode("view", { class: "tabbar-bg" }, [
        vue.createElementVNode("view", { class: "tabbar-left" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["tab-item", { active: $props.current === 0 }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $options.switchTab(0))
            },
            [
              vue.createElementVNode("image", {
                class: "tab-icon-img",
                src: $props.current === 0 ? "/static/tab-home-active.png" : "/static/tab-home.png",
                mode: "aspectFit"
              }, null, 8, ["src"]),
              vue.createElementVNode("text", { class: "tab-text" }, "首页")
            ],
            2
            /* CLASS */
          )
        ]),
        vue.createElementVNode("view", { class: "tabbar-center" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["center-btn", { active: $props.current === 1, pressing: $data.isPressing }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $options.switchTab(1)),
              onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.onPressStart && $options.onPressStart(...args)),
              onTouchend: _cache[3] || (_cache[3] = (...args) => $options.onPressEnd && $options.onPressEnd(...args))
            },
            [
              vue.createElementVNode("text", { class: "center-icon" }, "+")
            ],
            34
            /* CLASS, NEED_HYDRATION */
          )
        ]),
        vue.createElementVNode("view", { class: "tabbar-right" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["tab-item", { active: $props.current === 2 }]),
              onClick: _cache[4] || (_cache[4] = ($event) => $options.switchTab(2))
            },
            [
              vue.createElementVNode("image", {
                class: "tab-icon-img",
                src: $props.current === 2 ? "/static/tab-mine-active.png" : "/static/tab-mine.png",
                mode: "aspectFit"
              }, null, 8, ["src"]),
              vue.createElementVNode("text", { class: "tab-text" }, "我的")
            ],
            2
            /* CLASS */
          )
        ])
      ])
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-51c48e3c"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/components/custom-tabbar/custom-tabbar.vue"]]);
  function formatTime(date) {
    if (!date)
      return "";
    const d = new Date(date);
    const time = d.getTime();
    if (Number.isNaN(time))
      return "";
    const now = Date.now();
    const diff = now - time;
    if (diff < 60 * 1e3)
      return "刚刚";
    if (diff < 60 * 60 * 1e3)
      return `${Math.floor(diff / (60 * 1e3))}分钟前`;
    if (diff < 24 * 60 * 60 * 1e3)
      return `${Math.floor(diff / (60 * 60 * 1e3))}小时前`;
    if (diff < 7 * 24 * 60 * 60 * 1e3)
      return `${Math.floor(diff / (24 * 60 * 60 * 1e3))}天前`;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function formatCountdown(endTime) {
    if (!endTime)
      return "";
    const end = new Date(endTime).getTime();
    if (Number.isNaN(end))
      return "";
    const diff = end - Date.now();
    if (diff <= 0)
      return "已结束";
    const days = Math.floor(diff / 864e5);
    const hours = Math.floor(diff % 864e5 / 36e5);
    const minutes = Math.floor(diff % 36e5 / 6e4);
    if (days > 0)
      return `${days}天${hours}小时后结束`;
    if (hours > 0)
      return `${hours}小时${minutes}分钟后结束`;
    return `${Math.max(minutes, 1)}分钟后结束`;
  }
  function copyText(text) {
    return new Promise((resolve, reject) => {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({ title: "已复制", icon: "success" });
          resolve();
        },
        fail: (err) => {
          uni.showToast({ title: "复制失败", icon: "none" });
          reject(err);
        }
      });
    });
  }
  const _sfc_main$q = {
    name: "DealCard",
    props: {
      deal: {
        type: Object,
        required: true
      }
    },
    computed: {
      categoryName() {
        return this.deal.categoryName || this.deal.category || "其他";
      },
      displayImages() {
        return Array.isArray(this.deal.images) ? this.deal.images.slice(0, 1) : [];
      },
      shortContent() {
        const content = this.deal.content || "";
        return content.length > 20 ? `${content.slice(0, 20)}...` : content;
      }
    },
    methods: {
      formatTime,
      goDetail() {
        const id = this.deal.id || this.deal._id;
        if (!id)
          return;
        uni.navigateTo({
          url: `/pages/detail/detail?id=${id}`
        });
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "deal-card",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.goDetail && $options.goDetail(...args))
    }, [
      vue.createElementVNode("view", { class: "card-inner" }, [
        vue.createElementVNode("view", { class: "card-header" }, [
          vue.createElementVNode("view", { class: "header-left" }, [
            vue.createElementVNode("text", { class: "platform-dot" }),
            vue.createElementVNode(
              "text",
              { class: "platform-text" },
              vue.toDisplayString($props.deal.platform || "全网"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode(
            "text",
            { class: "category-text" },
            vue.toDisplayString($options.categoryName),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode(
          "text",
          { class: "card-title" },
          vue.toDisplayString($props.deal.title || "发现一条值得关注的优惠情报"),
          1
          /* TEXT */
        ),
        $props.deal.content ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "card-content"
          },
          vue.toDisplayString($options.shortContent),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        $options.displayImages.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "image-wrapper"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.displayImages, (img, index) => {
              return vue.openBlock(), vue.createElementBlock("image", {
                key: index,
                src: img,
                mode: "aspectFill",
                class: "deal-image",
                "lazy-load": ""
              }, null, 8, ["src"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "card-footer" }, [
          $props.deal.profit !== void 0 && $props.deal.profit !== null && $props.deal.profit !== "" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "profit-tag"
          }, [
            vue.createElementVNode(
              "text",
              { class: "profit-value" },
              "+" + vue.toDisplayString($props.deal.profit),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "profit-unit" }, "元")
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "text",
            { class: "time-text" },
            vue.toDisplayString($options.formatTime($props.deal.publishTime || $props.deal.createTime) || "刚刚"),
            1
            /* TEXT */
          )
        ])
      ])
    ]);
  }
  const DealCard = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-32ba6a24"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/components/deal-card/deal-card.vue"]]);
  const _sfc_main$p = {
    name: "Empty",
    props: {
      text: {
        type: String,
        default: "暂时还没有内容"
      },
      subText: {
        type: String,
        default: ""
      },
      icon: {
        type: String,
        default: "🪄"
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "empty-container" }, [
      vue.createElementVNode(
        "view",
        { class: "empty-orb" },
        vue.toDisplayString($props.icon),
        1
        /* TEXT */
      ),
      vue.createElementVNode(
        "text",
        { class: "empty-text" },
        vue.toDisplayString($props.text),
        1
        /* TEXT */
      ),
      $props.subText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          class: "empty-subtext"
        },
        vue.toDisplayString($props.subText),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const Empty = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-e2280098"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/components/empty/empty.vue"]]);
  const toastMixin = {
    methods: {
      // Toast 方法
      $toast(options) {
        if (this.$refs.toast) {
          return this.$refs.toast.show(options);
        }
        return uni.showToast(options);
      },
      $toastSuccess(message, duration = 2e3) {
        return this.$toast({ title: message, icon: "success", duration });
      },
      $toastError(message, duration = 2e3) {
        return this.$toast({ title: message, icon: "error", duration });
      },
      $toastLoading(message = "加载中...") {
        return this.$toast({ title: message, icon: "loading", duration: 0 });
      },
      $toastInfo(message, duration = 2e3) {
        return this.$toast({ title: message, icon: "none", duration });
      },
      $toastHide() {
        if (this.$refs.toast) {
          this.$refs.toast.hide();
        }
      },
      // Modal 方法
      $modal(options) {
        if (this.$refs.modal) {
          return this.$refs.modal.show(options);
        }
        return uni.showModal(options);
      },
      $modalConfirm(content, title = "提示") {
        return this.$modal({ title, content, showCancel: false });
      },
      $modalAlert(content, title = "提示") {
        return this.$modal({ title, content, showCancel: false, confirmText: "知道了" });
      }
    }
  };
  const CATEGORIES = [
    { id: "all", name: "全部", emoji: "✨", description: "所有可用优惠" },
    { id: "ecommerce", name: "电商", emoji: "🛍", description: "平台大促与下单返利" },
    { id: "food", name: "外卖", emoji: "🍔", description: "吃喝券包与拼单福利" },
    { id: "finance", name: "金融", emoji: "💳", description: "支付立减与开卡奖励" },
    { id: "video", name: "影音", emoji: "🎬", description: "会员充值与内容礼包" },
    { id: "travel", name: "出行", emoji: "✈️", description: "打车机酒和通勤优惠" },
    { id: "game", name: "游戏", emoji: "🎮", description: "充值特惠与限时礼包" },
    { id: "other", name: "其他", emoji: "🧩", description: "值得关注的零散福利" }
  ];
  const SORT_OPTIONS = [
    { value: "newest", label: "最新发布" },
    { value: "hottest", label: "热度优先" },
    { value: "ending", label: "即将结束" }
  ];
  const HOT_KEYWORDS = ["京东", "淘宝", "美团", "饿了么", "爱奇艺", "腾讯视频", "会员", "红包"];
  const HOT_PLATFORMS = ["淘宝", "京东", "拼多多", "美团", "饿了么", "支付宝", "爱奇艺", "腾讯视频"];
  const getDealList = (params) => {
    return get("/deals", params);
  };
  const getDealDetail = (id) => {
    return get(`/deals/${id}`);
  };
  const publishDeal = (data) => {
    return post("/deals", data);
  };
  const getCategories = () => {
    return get("/categories");
  };
  const searchDeals = (params) => {
    return get("/deals/search", params);
  };
  const getPendingDeals = (params) => {
    return get("/admin/deals/pending", params);
  };
  const approveDeal = (id) => {
    return put(`/admin/deals/${id}/approve`);
  };
  const rejectDeal = (id) => {
    return put(`/admin/deals/${id}/reject`);
  };
  const offlineDeal = (id) => {
    return put(`/admin/deals/${id}/offline`);
  };
  const _sfc_main$o = {
    components: {
      DealCard,
      Empty,
      Toast: __easycom_0,
      CustomTabbar: __easycom_2
    },
    mixins: [toastMixin],
    data() {
      return {
        currentSort: "newest",
        currentCategory: "全部",
        categories: [{ name: "全部", emoji: "📋" }],
        sortOptions: SORT_OPTIONS,
        dealList: [],
        page: 1,
        pageSize: 10,
        loading: false,
        refreshing: false,
        hasMore: true
      };
    },
    computed: {
      filteredDealList() {
        if (this.currentCategory === "全部")
          return this.dealList;
        return this.dealList.filter((item) => item.categoryName === this.currentCategory);
      },
      columns() {
        const cols = [[], []];
        const heights = [0, 0];
        this.filteredDealList.forEach((deal) => {
          const targetIndex = heights[0] <= heights[1] ? 0 : 1;
          cols[targetIndex].push(deal);
          heights[targetIndex] += this.estimateDealHeight(deal);
        });
        return cols;
      },
      expiringCount() {
        return this.filteredDealList.filter((item) => item.expireTime && new Date(item.expireTime).getTime() > Date.now()).length;
      }
    },
    onLoad() {
      this.syncSelectedCategory();
      this.loadCategories();
      this.loadData();
    },
    onShow() {
      this.syncSelectedCategory();
      this.page = 1;
      this.loadData();
    },
    onReachBottom() {
      this.loadMore();
    },
    onPullDownRefresh() {
      this.onRefresh();
    },
    methods: {
      async loadCategories() {
        try {
          const res = await getCategories();
          let list = [];
          if (res.data && Array.isArray(res.data)) {
            list = res.data;
          } else if (Array.isArray(res)) {
            list = res;
          }
          this.categories = [
            { name: "全部", emoji: "📋" },
            ...list.map((item) => ({
              name: item.name || item.categoryName || "其他",
              emoji: item.emoji || "📦"
            }))
          ];
        } catch (e) {
          formatAppLog("error", "at pages/index/index.vue:182", "获取分类失败", e);
        }
      },
      syncSelectedCategory() {
        const selectedCategory = uni.getStorageSync("selectedCategory");
        if (selectedCategory) {
          this.currentCategory = selectedCategory;
          uni.removeStorageSync("selectedCategory");
        }
      },
      normalizeList(res) {
        if (res.data && Array.isArray(res.data.content))
          return res.data.content;
        if (res.data && Array.isArray(res.data.list))
          return res.data.list;
        if (res.data && Array.isArray(res.data.data))
          return res.data.data;
        if (Array.isArray(res.data))
          return res.data;
        if (Array.isArray(res.list))
          return res.list;
        return [];
      },
      async loadData() {
        if (this.loading)
          return;
        this.loading = true;
        try {
          const params = {
            sort: this.currentSort,
            page: this.page - 1,
            pageSize: this.pageSize
          };
          if (this.currentCategory !== "全部") {
            params.categoryName = this.currentCategory;
          }
          const res = await getDealList(params);
          const list = this.normalizeList(res);
          if (this.page === 1) {
            this.dealList = list;
          } else {
            this.dealList = [...this.dealList, ...list];
          }
          this.hasMore = list.length === this.pageSize;
        } catch (e) {
          this.$toastError(`加载失败${e && e.message ? `: ${e.message}` : ""}`);
        } finally {
          this.loading = false;
          this.refreshing = false;
          uni.stopPullDownRefresh();
        }
      },
      onSortChange(sort) {
        if (this.currentSort === sort)
          return;
        this.currentSort = sort;
        this.page = 1;
        this.loadData();
      },
      onCategoryChange(category) {
        this.currentCategory = category;
        this.page = 1;
        this.loadData();
      },
      estimateDealHeight(deal) {
        let height = 220;
        const titleLength = (deal.title || "").length;
        const contentLength = (deal.content || "").length;
        const imageCount = Array.isArray(deal.images) ? deal.images.length : 0;
        height += Math.min(titleLength, 28) * 1.4;
        height += Math.min(contentLength, 42) * 0.8;
        if (imageCount > 0)
          height += 132 + this.getDealSeed(deal) % 3 * 28;
        if (deal.profit !== void 0 && deal.profit !== null && deal.profit !== "")
          height += 46;
        return height;
      },
      getDealSeed(deal) {
        const source = String(deal.id || deal._id || deal.title || "");
        return source.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      },
      loadMore() {
        if (!this.hasMore || this.loading)
          return;
        this.page += 1;
        this.loadData();
      },
      onRefresh() {
        this.refreshing = true;
        this.page = 1;
        this.loadData();
      },
      goSearch() {
        uni.navigateTo({
          url: "/pages/search/search"
        });
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_DealCard = vue.resolveComponent("DealCard");
    const _component_Empty = vue.resolveComponent("Empty");
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_custom_tabbar = resolveEasycom(vue.resolveDynamicComponent("custom-tabbar"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "index-page" }, [
      vue.createElementVNode("view", { class: "hero card" }, [
        vue.createElementVNode("view", {
          class: "hero-visual",
          "aria-hidden": "true"
        }, [
          vue.createElementVNode("view", { class: "visual-orb orb-left" }),
          vue.createElementVNode("view", { class: "visual-orb orb-right" }),
          vue.createElementVNode("view", { class: "visual-stack" }, [
            vue.createElementVNode("view", { class: "stack-card stack-back" }),
            vue.createElementVNode("view", { class: "stack-card stack-middle" }),
            vue.createElementVNode("view", { class: "stack-card stack-front" }, [
              vue.createElementVNode("view", { class: "stack-chip chip-red" }),
              vue.createElementVNode("view", { class: "stack-chip chip-soft" }),
              vue.createElementVNode("view", { class: "stack-line line-strong" }),
              vue.createElementVNode("view", { class: "stack-line" }),
              vue.createElementVNode("view", { class: "stack-line line-short" })
            ])
          ]),
          vue.createElementVNode("view", { class: "floating-pill pill-main" }, "红包"),
          vue.createElementVNode("view", { class: "floating-pill pill-side" }, "会员")
        ]),
        vue.createElementVNode("view", { class: "hero-info" }, [
          vue.createElementVNode("text", { class: "hero-title" }, "今日灵感"),
          vue.createElementVNode("view", { class: "hero-badges" }, [
            vue.createElementVNode(
              "text",
              { class: "hero-badge" },
              vue.toDisplayString($options.filteredDealList.length) + " 条在更",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "hero-badge accent" },
              vue.toDisplayString($options.expiringCount) + " 条即将结束",
              1
              /* TEXT */
            )
          ])
        ]),
        vue.createElementVNode("view", {
          class: "search-entry",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goSearch && $options.goSearch(...args))
        }, [
          vue.createElementVNode("text", { class: "search-label" }, "搜索淘宝、京东、会员、红包..."),
          vue.createElementVNode("text", { class: "search-action" }, "去看看")
        ])
      ]),
      vue.createElementVNode("view", { class: "toolbar card" }, [
        vue.createElementVNode("scroll-view", {
          class: "category-scroll",
          "scroll-x": "",
          "show-scrollbar": "false"
        }, [
          vue.createElementVNode("view", { class: "category-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.categories, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.name,
                  class: vue.normalizeClass(["category-pill", { active: $data.currentCategory === item.name }]),
                  onClick: ($event) => $options.onCategoryChange(item.name)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "category-text" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "category-line" })
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "sort-bar" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.sortOptions, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.value,
                class: vue.normalizeClass(["sort-item", { active: $data.currentSort === item.value }]),
                onClick: ($event) => $options.onSortChange(item.value)
              }, vue.toDisplayString(item.label), 11, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "deal-list" }, [
        $options.filteredDealList.length ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "waterfall-container"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.columns, (column, colIndex) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "waterfall-column",
                key: colIndex
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(column, (deal) => {
                    return vue.openBlock(), vue.createBlock(_component_DealCard, {
                      key: deal._id || deal.id,
                      deal,
                      class: "waterfall-item"
                    }, null, 8, ["deal"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true),
        $options.filteredDealList.length === 0 && !$data.loading ? (vue.openBlock(), vue.createBlock(_component_Empty, {
          key: 1,
          text: "还没有符合条件的线报",
          subText: "换个分类看看，或者发布你刚发现的新福利。",
          icon: "📭"
        })) : vue.createCommentVNode("v-if", true),
        $options.filteredDealList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "load-more"
        }, [
          $data.loading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "正在刷新优惠情报...")) : !$data.hasMore ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "已经到底了")) : (vue.openBlock(), vue.createElementBlock("text", { key: 2 }, "上滑加载更多线报"))
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(_component_custom_tabbar, { current: 0 })
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/index/index.vue"]]);
  const _sfc_main$n = {
    data() {
      return {
        categories: CATEGORIES.filter((item) => item.id !== "all"),
        hotPlatforms: HOT_PLATFORMS
      };
    },
    methods: {
      getCardGradient(id) {
        const colors = {
          ecommerce: "linear-gradient(135deg, rgba(255, 140, 102, 0.22) 0%, rgba(201, 58, 90, 0.06) 100%)",
          food: "linear-gradient(135deg, rgba(255, 204, 102, 0.24) 0%, rgba(255, 160, 92, 0.12) 100%)",
          finance: "linear-gradient(135deg, rgba(70, 184, 130, 0.2) 0%, rgba(33, 158, 188, 0.12) 100%)",
          video: "linear-gradient(135deg, rgba(108, 99, 255, 0.18) 0%, rgba(79, 70, 229, 0.12) 100%)",
          travel: "linear-gradient(135deg, rgba(41, 173, 255, 0.18) 0%, rgba(27, 78, 163, 0.12) 100%)",
          game: "linear-gradient(135deg, rgba(255, 89, 94, 0.18) 0%, rgba(106, 13, 173, 0.12) 100%)",
          other: "linear-gradient(135deg, rgba(122, 136, 158, 0.18) 0%, rgba(59, 72, 91, 0.12) 100%)"
        };
        return colors[id] || colors.other;
      },
      goCategory(categoryId) {
        uni.setStorageSync("selectedCategory", categoryId);
        uni.switchTab({
          url: "/pages/index/index"
        });
      },
      goPlatform(platform) {
        uni.navigateTo({
          url: `/pages/search/search?keyword=${platform}`
        });
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "category-page" }, [
      vue.createElementVNode("view", { class: "hero card" }, [
        vue.createElementVNode("text", { class: "hero-kicker" }, "探索频道"),
        vue.createElementVNode("text", { class: "hero-title" }, "按场景找福利，比按平台翻更快"),
        vue.createElementVNode("text", { class: "hero-subtitle" }, "挑一个你最近最常用的消费场景，我们把入口帮你提前整理好。")
      ]),
      vue.createElementVNode("view", { class: "category-grid card" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.categories, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "category-item",
              onClick: ($event) => $options.goCategory(item.id)
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: "icon-wrapper",
                  style: vue.normalizeStyle({ background: $options.getCardGradient(item.id) })
                },
                [
                  vue.createElementVNode(
                    "text",
                    { class: "category-emoji" },
                    vue.toDisplayString(item.emoji),
                    1
                    /* TEXT */
                  )
                ],
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "text",
                { class: "category-name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "category-desc" },
                vue.toDisplayString(item.description),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "hot-section card" }, [
        vue.createElementVNode("view", { class: "section-head" }, [
          vue.createElementVNode("text", { class: "section-title" }, "热门平台雷达"),
          vue.createElementVNode("text", { class: "section-subtitle" }, "点一下直接带着关键词去搜")
        ]),
        vue.createElementVNode("view", { class: "platform-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.hotPlatforms, (platform) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: platform,
                class: "platform-tag",
                onClick: ($event) => $options.goPlatform(platform)
              }, vue.toDisplayString(platform), 9, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesCategoryCategory = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-8145b772"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/category/category.vue"]]);
  const _sfc_main$m = {
    name: "CustomModal",
    data() {
      return {
        visible: false,
        title: "",
        content: "",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        cancelColor: "",
        confirmColor: "",
        resolve: null,
        reject: null
      };
    },
    computed: {
      cancelStyle() {
        return this.cancelColor ? { color: this.cancelColor } : {};
      },
      confirmStyle() {
        return this.confirmColor ? { color: this.confirmColor } : {};
      }
    },
    methods: {
      show(options = {}) {
        this.title = options.title || "";
        this.content = options.content || "";
        this.showCancel = options.showCancel !== false;
        this.cancelText = options.cancelText || "取消";
        this.confirmText = options.confirmText || "确定";
        this.cancelColor = options.cancelColor || "";
        this.confirmColor = options.confirmColor || "";
        this.visible = true;
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      },
      hide() {
        this.visible = false;
        this.resolve = null;
        this.reject = null;
      },
      handleMaskClick() {
        if (this.showCancel) {
          this.handleCancel();
        }
      },
      handleCancel() {
        this.visible = false;
        if (this.resolve) {
          this.resolve({ confirm: false, cancel: true });
        }
      },
      handleConfirm() {
        this.visible = false;
        if (this.resolve) {
          this.resolve({ confirm: true, cancel: false });
        }
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.visible ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "modal-container",
      onClick: _cache[3] || (_cache[3] = (...args) => $options.handleMaskClick && $options.handleMaskClick(...args))
    }, [
      vue.createElementVNode("view", { class: "modal-mask" }),
      vue.createElementVNode("view", {
        class: "modal-content",
        onClick: _cache[2] || (_cache[2] = vue.withModifiers(() => {
        }, ["stop"]))
      }, [
        $data.title ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "modal-header"
        }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.title),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "modal-body" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-message" },
            vue.toDisplayString($data.content),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["modal-footer", { "single-btn": !$data.showCancel }])
          },
          [
            $data.showCancel ? (vue.openBlock(), vue.createElementBlock(
              "button",
              {
                key: 0,
                class: "modal-btn cancel",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleCancel && $options.handleCancel(...args)),
                style: vue.normalizeStyle($options.cancelStyle)
              },
              vue.toDisplayString($data.cancelText),
              5
              /* TEXT, STYLE */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "button",
              {
                class: "modal-btn confirm",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleConfirm && $options.handleConfirm(...args)),
                style: vue.normalizeStyle($options.confirmStyle)
              },
              vue.toDisplayString($data.confirmText),
              5
              /* TEXT, STYLE */
            )
          ],
          2
          /* CLASS */
        )
      ])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-ef206254"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/components/modal/modal.vue"]]);
  const uploadImage = (filePath) => {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync("token");
      uni.uploadFile({
        url: "http://192.168.31.86:8080/upload/image",
        filePath,
        name: "file",
        header: {
          "Authorization": token ? `Bearer ${token}` : ""
        },
        success: (res) => {
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data);
            resolve(data);
          } else {
            reject(new Error("上传失败"));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  };
  const _sfc_main$l = {
    components: { Toast: __easycom_0, Modal: __easycom_1 },
    mixins: [toastMixin],
    data() {
      return {
        submitting: false,
        categories: [],
        categoryIndex: -1,
        form: {
          title: "",
          platform: "",
          categoryId: "",
          profit: "",
          link: "",
          expireDate: "",
          content: "",
          images: []
        }
      };
    },
    computed: {
      selectedCategoryName() {
        if (this.categoryIndex >= 0 && this.categories[this.categoryIndex]) {
          return this.categories[this.categoryIndex].name;
        }
        return "";
      }
    },
    onLoad() {
      this.loadCategories();
    },
    methods: {
      async loadCategories() {
        try {
          const res = await getCategories();
          if (res.data && Array.isArray(res.data)) {
            this.categories = res.data;
          } else if (Array.isArray(res)) {
            this.categories = res;
          }
        } catch (e) {
          formatAppLog("error", "at pages/publish/publish.vue:196", "获取分类失败", e);
        }
      },
      onCategoryChange(e) {
        var _a;
        this.categoryIndex = e.detail.value;
        this.form.categoryId = ((_a = this.categories[this.categoryIndex]) == null ? void 0 : _a.id) || "";
      },
      onDateChange(e) {
        this.form.expireDate = e.detail.value;
      },
      chooseImage() {
        uni.chooseImage({
          count: 6 - this.form.images.length,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: async (res) => {
            uni.showLoading({ title: "上传中..." });
            try {
              const uploadPromises = res.tempFilePaths.map((path) => uploadImage(path));
              const results = await Promise.all(uploadPromises);
              formatAppLog("log", "at pages/publish/publish.vue:217", "涓婁紶缁撴灉:", results);
              const imageUrls = results.map((r) => {
                if (r.code === 200 && r.data) {
                  return r.data;
                }
                return null;
              }).filter((url) => url);
              formatAppLog("log", "at pages/publish/publish.vue:225", "鍥剧墖URLs:", imageUrls);
              this.form.images = [...this.form.images, ...imageUrls];
            } catch (e) {
              formatAppLog("error", "at pages/publish/publish.vue:228", "上传失败:", e);
              this.$toastError("上传失败");
            } finally {
              uni.hideLoading();
            }
          }
        });
      },
      deleteImage(index) {
        this.form.images.splice(index, 1);
      },
      validate() {
        if (!this.form.title.trim()) {
          this.$toastInfo("请输入标题");
          return false;
        }
        if (!this.form.platform.trim()) {
          this.$toastInfo("请输入平台");
          return false;
        }
        if (!this.form.categoryId) {
          this.$toastInfo("请选择分类");
          return false;
        }
        if (!this.form.content.trim()) {
          this.$toastInfo("请补充详细说明");
          return false;
        }
        return true;
      },
      async submit() {
        if (!this.validate())
          return;
        const token = uni.getStorageSync("token");
        if (!token) {
          const res = await this.$modal({
            title: "需要先登录",
            content: "登录后才可以发布线报，是否现在去登录？"
          });
          if (res.confirm) {
            uni.navigateTo({ url: "/pages/login/login" });
          }
          return;
        }
        this.submitting = true;
        try {
          const selectedCategory = this.categories[this.categoryIndex];
          const categoryName = selectedCategory ? selectedCategory.name : "";
          const data = {
            ...this.form,
            categoryName,
            profit: parseFloat(this.form.profit) || 0,
            expireTime: this.form.expireDate ? new Date(this.form.expireDate).toISOString() : null
          };
          await publishDeal(data);
          this.$toastSuccess("发布成功");
          this.form = {
            title: "",
            platform: "",
            categoryId: "",
            profit: "",
            expireDate: "",
            content: "",
            images: []
          };
          setTimeout(() => {
            uni.switchTab({ url: "/pages/index/index" });
          }, 1200);
        } catch (e) {
          this.$toastError("发布失败，请稍后再试");
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "publish-page" }, [
      vue.createElementVNode("scroll-view", {
        class: "form-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "form-container card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("view", {
              class: "paint-visual",
              "aria-hidden": "true"
            }, [
              vue.createElementVNode("view", { class: "paint-shadow" }),
              vue.createElementVNode("view", { class: "paint-handle" }),
              vue.createElementVNode("view", { class: "paint-ring" }),
              vue.createElementVNode("view", { class: "paint-ferrule" }),
              vue.createElementVNode("view", { class: "paint-tip" }),
              vue.createElementVNode("view", { class: "paint-drop drop-main" }),
              vue.createElementVNode("view", { class: "paint-drop drop-small" })
            ]),
            vue.createElementVNode("text", { class: "section-title" }, "基础信息"),
            vue.createElementVNode("text", { class: "section-tip" }, "先把能快速判断价值的信息补完整。")
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "label-row" }, [
              vue.createElementVNode("text", { class: "label" }, "标题"),
              vue.createElementVNode("text", { class: "required" }, "*")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.title = $event),
                placeholder: "例如：京东 PLUS 年卡限时返 25 元红包",
                class: "input",
                maxlength: "50"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.title]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "label-row" }, [
              vue.createElementVNode("text", { class: "label" }, "平台"),
              vue.createElementVNode("text", { class: "required" }, "*")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.platform = $event),
                placeholder: "例如：淘宝、京东、美团、支付宝",
                class: "input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.platform]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("view", { class: "label-row" }, [
              vue.createElementVNode("text", { class: "label" }, "分类"),
              vue.createElementVNode("text", { class: "required" }, "*")
            ]),
            vue.createElementVNode("picker", {
              mode: "selector",
              range: $data.categories,
              "range-key": "name",
              value: $data.categoryIndex,
              onChange: _cache[2] || (_cache[2] = (...args) => $options.onCategoryChange && $options.onCategoryChange(...args))
            }, [
              vue.createElementVNode("view", { class: "picker-wrapper" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["picker-text", $data.form.categoryId ? "active" : ""])
                  },
                  vue.toDisplayString($options.selectedCategoryName || "选择分类，帮助大家更快找到"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, "选择")
              ])
            ], 40, ["range", "value"])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "预计收益"),
            vue.createElementVNode("view", { class: "profit-input-wrapper" }, [
              vue.createElementVNode("text", { class: "profit-symbol" }, "+"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.profit = $event),
                  type: "digit",
                  placeholder: "0.00",
                  class: "input profit-input"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.form.profit]
              ]),
              vue.createElementVNode("text", { class: "profit-unit" }, "元")
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "活动链接"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.link = $event),
                placeholder: "https://...",
                class: "input"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.link]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "label" }, "过期时间"),
            vue.createElementVNode("picker", {
              mode: "date",
              value: $data.form.expireDate,
              onChange: _cache[5] || (_cache[5] = (...args) => $options.onDateChange && $options.onDateChange(...args))
            }, [
              vue.createElementVNode("view", { class: "picker-wrapper" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["picker-text", $data.form.expireDate ? "active" : ""])
                  },
                  vue.toDisplayString($data.form.expireDate || "选择结束日期，方便大家安排领取顺序"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode("text", { class: "arrow" }, "选择")
              ])
            ], 40, ["value"])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-container card" }, [
          vue.createElementVNode("view", { class: "section-head" }, [
            vue.createElementVNode("text", { class: "section-title" }, "详细说明"),
            vue.createElementVNode("text", { class: "section-tip" }, "建议写清领取步骤、使用门槛和注意事项。")
          ]),
          vue.createElementVNode("view", { class: "form-item no-gap" }, [
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.form.content = $event),
                placeholder: "示例：1. 先领券；2. 再下单；3. 叠加会员红包后预计实付 xx 元。",
                class: "textarea",
                maxlength: "500"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.content]
            ]),
            vue.createElementVNode(
              "text",
              { class: "word-count" },
              vue.toDisplayString($data.form.content.length) + "/500",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "form-item no-gap" }, [
            vue.createElementVNode("text", { class: "label" }, "活动截图"),
            vue.createElementVNode("view", { class: "image-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.form.images, (img, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "image-item"
                  }, [
                    vue.createElementVNode("image", {
                      src: img,
                      mode: "aspectFill",
                      class: "uploaded-img"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("text", {
                      class: "delete-btn",
                      onClick: ($event) => $options.deleteImage(index)
                    }, "×", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $data.form.images.length < 6 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "upload-btn",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.chooseImage && $options.chooseImage(...args))
              }, [
                vue.createElementVNode("text", { class: "plus" }, "+"),
                vue.createElementVNode(
                  "text",
                  { class: "upload-tip" },
                  "上传截图 " + vue.toDisplayString($data.form.images.length) + "/6",
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "bottom-space" })
      ]),
      vue.createElementVNode("view", { class: "submit-section" }, [
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.submit && $options.submit(...args)),
          disabled: $data.submitting
        }, vue.toDisplayString($data.submitting ? "正在发布..." : "发布这条线报"), 9, ["disabled"])
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesPublishPublish = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-bfce3555"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/publish/publish.vue"]]);
  const login = (data) => {
    return post("/auth/login", data);
  };
  const register = (data) => {
    return post("/auth/register", data);
  };
  const getUserInfo = () => {
    return get("/user/info");
  };
  const updateUserInfo = (data) => {
    return put("/user/info", data);
  };
  const getMyDeals = (params) => {
    return get("/user/deals", params);
  };
  const getNotifications = (params) => {
    return get("/user/notifications", params);
  };
  const getUnreadCount = () => {
    return get("/user/notifications/count");
  };
  const markNotificationRead = (id) => {
    return put(`/user/notifications/${id}/read`);
  };
  const markAllNotificationsRead = () => {
    return put("/user/notifications/read-all");
  };
  const deleteNotification = (id) => {
    return del(`/user/notifications/${id}`);
  };
  const sendNotification = (data) => {
    return postWithQuery("/admin/notifications", data);
  };
  const searchUsers = (keyword, params) => {
    return get("/admin/users/search", { keyword, ...params });
  };
  const getHistory = (params) => {
    return get("/user/history", params);
  };
  const deleteHistory = (dealId) => {
    return del(`/user/history/${dealId}`);
  };
  const clearHistory = () => {
    return del("/user/history/clear");
  };
  const _imports_0 = "/static/app-icon.svg";
  const _sfc_main$k = {
    components: { Toast: __easycom_0, Modal: __easycom_1, CustomTabbar: __easycom_2 },
    mixins: [toastMixin],
    data() {
      return {
        isLogin: false,
        userInfo: {},
        unreadCount: 0,
        auditCount: 0
      };
    },
    computed: {
      isAdmin() {
        return this.userInfo.role === "admin" || this.userInfo.isAdmin === true;
      },
      displayName() {
        if (this.userInfo.nickname)
          return this.userInfo.nickname;
        const id = this.userInfo._id || this.userInfo.id || "";
        return id ? `用户${String(id).slice(-6)}` : "情报站用户";
      },
      userInitial() {
        return this.isLogin && this.displayName ? this.displayName.slice(0, 1) : "绵";
      },
      approvedCount() {
        return this.userInfo.approvedCount || this.userInfo.publishCount || 0;
      },
      level() {
        const count = this.approvedCount;
        return Math.max(1, count);
      }
    },
    onShow() {
      this.checkLogin();
      this.loadUnreadCount();
    },
    methods: {
      checkLogin() {
        const token = uni.getStorageSync("token");
        const userInfo = uni.getStorageSync("userInfo");
        if (token && userInfo) {
          this.isLogin = true;
          this.userInfo = userInfo;
          this.loadUserInfo();
        } else {
          this.isLogin = false;
          this.userInfo = {};
        }
      },
      async loadUserInfo() {
        try {
          const res = await getUserInfo();
          this.userInfo = res.data || res;
          await this.loadPublishCount();
          uni.setStorageSync("userInfo", this.userInfo);
        } catch (e) {
          formatAppLog("error", "at pages/mine/mine.vue:163", "获取用户信息失败", e);
        }
      },
      async loadPublishCount() {
        try {
          const res = await getMyDeals({ page: 0, size: 1e3 });
          let list = [];
          if (res.data && Array.isArray(res.data.content)) {
            list = res.data.content;
          } else if (res.data && Array.isArray(res.data.list)) {
            list = res.data.list;
          } else if (Array.isArray(res.data)) {
            list = res.data;
          }
          const total = list.length;
          formatAppLog("log", "at pages/mine/mine.vue:179", "发布数量:", total, res);
          this.userInfo = { ...this.userInfo, approvedCount: total };
        } catch (e) {
          formatAppLog("error", "at pages/mine/mine.vue:182", "获取发布数量失败", e);
        }
      },
      async loadUnreadCount() {
        var _a, _b;
        try {
          const res = await getUnreadCount();
          formatAppLog("log", "at pages/mine/mine.vue:188", "未读数量响应:", res);
          if (res.code === 200) {
            this.unreadCount = ((_a = res.data) == null ? void 0 : _a.unreadCount) ?? ((_b = res.data) == null ? void 0 : _b.count) ?? res.unreadCount ?? res.count ?? 0;
          } else {
            this.unreadCount = res.unreadCount ?? res.count ?? 0;
          }
        } catch (e) {
          formatAppLog("error", "at pages/mine/mine.vue:196", "获取未读数量失败", e);
        }
      },
      goLogin() {
        uni.navigateTo({ url: "/pages/login/login" });
      },
      goSetting() {
        uni.navigateTo({ url: "/pages/settings/settings" });
      },
      goMyDeals() {
        if (!this.checkAuth())
          return;
        uni.navigateTo({ url: "/pages/my-deals/my-deals" });
      },
      goHistory() {
        if (!this.checkAuth())
          return;
        uni.navigateTo({ url: "/pages/history/history" });
      },
      goMessages() {
        uni.navigateTo({ url: "/pages/messages/messages" });
      },
      goAbout() {
        this.$modal({
          title: "关于情报站",
          content: "薅羊毛情报站 v1.0.0\n\n把全网优惠整理成更好逛、更好读的福利情报流。",
          showCancel: false
        });
      },
      goFeedback() {
        uni.navigateTo({ url: "/pages/feedback/feedback" });
      },
      goAudit() {
        uni.navigateTo({ url: "/pages/audit/audit" });
      },
      async checkAuth() {
        if (!this.isLogin) {
          const res = await this.$modal({
            title: "需要先登录",
            content: "登录后才能查看个人内容，是否现在去登录？"
          });
          if (res.confirm) {
            uni.navigateTo({ url: "/pages/login/login" });
          }
          return false;
        }
        return true;
      },
      async logout() {
        const res = await this.$modal({
          title: "确认退出",
          content: "退出后将清除当前账号的本地登录状态。"
        });
        if (res.confirm) {
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          this.isLogin = false;
          this.userInfo = {};
          this.$toastSuccess("已退出登录");
        }
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    const _component_custom_tabbar = resolveEasycom(vue.resolveDynamicComponent("custom-tabbar"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "mine-page" }, [
      vue.createElementVNode("view", { class: "hero" }, [
        vue.createElementVNode("view", { class: "hero-bg" }, [
          vue.createElementVNode("view", { class: "decoration circle-1" }),
          vue.createElementVNode("view", { class: "decoration circle-2" }),
          vue.createElementVNode("view", { class: "decoration circle-3" })
        ]),
        vue.createElementVNode("view", { class: "hero-content" }, [
          vue.createElementVNode("view", {
            class: "avatar-ring",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goLogin && $options.goLogin(...args))
          }, [
            vue.createElementVNode("view", { class: "avatar-circle" }, [
              !$data.isLogin ? (vue.openBlock(), vue.createElementBlock("image", {
                key: 0,
                src: _imports_0,
                mode: "aspectFit",
                class: "sheep-icon"
              })) : (vue.openBlock(), vue.createElementBlock(
                "text",
                { key: 1 },
                vue.toDisplayString($options.userInitial),
                1
                /* TEXT */
              ))
            ])
          ]),
          $data.isLogin ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "user-info"
          }, [
            vue.createElementVNode(
              "text",
              { class: "user-name" },
              vue.toDisplayString($options.displayName),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "user-level" },
              "LV" + vue.toDisplayString($options.level) + " · 省钱行动派",
              1
              /* TEXT */
            )
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "user-info",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.goLogin && $options.goLogin(...args))
          }, [
            vue.createElementVNode("text", { class: "user-name" }, "点击登录"),
            vue.createElementVNode("text", { class: "user-level" }, "同步你的发布、收藏和消息提醒")
          ]))
        ]),
        vue.createElementVNode("text", {
          class: "setting-btn",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.goSetting && $options.goSetting(...args))
        }, "设置")
      ]),
      vue.createElementVNode("view", { class: "menu-list card" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.goMyDeals && $options.goMyDeals(...args))
        }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "menu-title" }, "我的发布"),
            vue.createElementVNode("text", { class: "menu-subtitle" }, "回看你发过的所有线报")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.goHistory && $options.goHistory(...args))
        }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "menu-title" }, "浏览历史"),
            vue.createElementVNode("text", { class: "menu-subtitle" }, "你最近看过哪些福利")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.goMessages && $options.goMessages(...args))
        }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "menu-title" }, "消息通知")
          ]),
          vue.createElementVNode("view", { class: "trailing" }, [
            $data.unreadCount > 0 ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "badge"
              },
              vue.toDisplayString($data.unreadCount > 99 ? "99+" : $data.unreadCount),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ]),
      $options.isAdmin ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "menu-list card"
      }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.goAudit && $options.goAudit(...args))
        }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "menu-title" }, "审核管理"),
            vue.createElementVNode("text", { class: "menu-subtitle" }, "快速处理待审核线报")
          ]),
          vue.createElementVNode("view", { class: "trailing" }, [
            $data.auditCount > 0 ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "badge warm"
              },
              vue.toDisplayString($data.auditCount),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "menu-list card" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[7] || (_cache[7] = (...args) => $options.goAbout && $options.goAbout(...args))
        }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "menu-title" }, "关于我们"),
            vue.createElementVNode("text", { class: "menu-subtitle" }, "看看这款应用的初衷和版本信息")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.goFeedback && $options.goFeedback(...args))
        }, [
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "menu-title" }, "意见反馈"),
            vue.createElementVNode("text", { class: "menu-subtitle" }, "告诉我们你还想加什么功能")
          ]),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ])
      ]),
      $data.isLogin ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "logout-btn card",
        onClick: _cache[9] || (_cache[9] = (...args) => $options.logout && $options.logout(...args))
      }, [
        vue.createElementVNode("text", null, "退出登录")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(_component_custom_tabbar, { current: 2 })
    ]);
  }
  const PagesMineMine = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-7c2ebfa5"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/mine/mine.vue"]]);
  const _sfc_main$j = {
    components: { Empty, Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        dealId: "",
        deal: {},
        loading: false
      };
    },
    computed: {
      categoryKey() {
        return this.deal.categoryId || this.deal.category || this.deal.categoryName || "";
      },
      categoryInfo() {
        return CATEGORIES.find((item) => item.id === this.categoryKey || item.name === this.categoryKey) || CATEGORIES.find((item) => item.id === "other");
      },
      categoryName() {
        return this.categoryInfo ? this.categoryInfo.name : "其他";
      },
      categoryEmoji() {
        return this.categoryInfo ? this.categoryInfo.emoji : "🧩";
      }
    },
    onLoad(options) {
      this.dealId = options.id;
      this.loadDetail();
    },
    methods: {
      formatTime,
      formatCountdown,
      async loadDetail() {
        this.loading = true;
        try {
          const res = await getDealDetail(this.dealId);
          const data = res.data || res || {};
          this.deal = {
            ...data,
            _id: data.id || data._id,
            images: Array.isArray(data.images) ? data.images : []
          };
        } catch (e) {
          this.$toastError("详情加载失败");
        } finally {
          this.loading = false;
        }
      },
      copyLink() {
        copyText(this.deal.link);
      },
      previewImage(index) {
        uni.previewImage({
          current: this.deal.images[index],
          urls: this.deal.images
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Empty = vue.resolveComponent("Empty");
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      class: "detail-page",
      "scroll-y": ""
    }, [
      $data.deal._id || $data.deal.id ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "hero card"
      }, [
        vue.createElementVNode("view", { class: "hero-top" }, [
          vue.createElementVNode("view", { class: "hero-tags" }, [
            vue.createElementVNode(
              "text",
              { class: "platform-tag" },
              vue.toDisplayString($data.deal.platform || "全网"),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "category-tag" },
              vue.toDisplayString($options.categoryEmoji) + " " + vue.toDisplayString($options.categoryName),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode(
            "text",
            { class: "publish-time" },
            vue.toDisplayString($options.formatTime($data.deal.publishTime || $data.deal.createTime) || "刚刚发布"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode(
          "text",
          { class: "detail-title" },
          vue.toDisplayString($data.deal.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("text", { class: "detail-subtitle" }, "把关键信息先看清，再决定要不要马上冲。"),
        vue.createElementVNode("view", { class: "summary-grid" }, [
          $data.deal.profit !== void 0 && $data.deal.profit !== null && $data.deal.profit !== "" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "summary-card emphasis"
          }, [
            vue.createElementVNode("text", { class: "summary-label" }, "预计收益"),
            vue.createElementVNode(
              "text",
              { class: "summary-value" },
              "+" + vue.toDisplayString($data.deal.profit) + " 元",
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          $data.deal.expireTime ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "summary-card"
          }, [
            vue.createElementVNode("text", { class: "summary-label" }, "结束倒计时"),
            vue.createElementVNode(
              "text",
              { class: "summary-value small" },
              vue.toDisplayString($options.formatCountdown($data.deal.expireTime)),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.deal._id || $data.deal.id ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "content-card card"
      }, [
        vue.createElementVNode("view", { class: "section-head" }, [
          vue.createElementVNode("text", { class: "section-title" }, "玩法说明"),
          vue.createElementVNode("text", { class: "section-tip" }, "建议先看使用门槛和领取方式")
        ]),
        vue.createElementVNode(
          "text",
          { class: "content-text" },
          vue.toDisplayString($data.deal.content || "发布者还没有补充更多说明。"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      $data.deal.images && $data.deal.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "images-card card"
      }, [
        vue.createElementVNode("view", { class: "section-head" }, [
          vue.createElementVNode("text", { class: "section-title" }, "活动截图"),
          vue.createElementVNode("text", { class: "section-tip" }, "点击可查看大图")
        ]),
        vue.createElementVNode("view", { class: "image-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.deal.images, (img, index) => {
              return vue.openBlock(), vue.createElementBlock("image", {
                key: index,
                src: img,
                mode: "aspectFill",
                class: "content-image",
                "lazy-load": "",
                onClick: ($event) => $options.previewImage(index)
              }, null, 8, ["src", "onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.deal.link ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "link-card card"
      }, [
        vue.createElementVNode("view", { class: "section-head" }, [
          vue.createElementVNode("text", { class: "section-title" }, "活动链接"),
          vue.createElementVNode("text", { class: "section-tip" }, "复制后可到浏览器或 App 打开")
        ]),
        vue.createElementVNode("view", {
          class: "link-box",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.copyLink && $options.copyLink(...args))
        }, [
          vue.createElementVNode(
            "text",
            { class: "link-text" },
            vue.toDisplayString($data.deal.link),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "copy-btn" }, "复制")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      !$data.loading && !($data.deal._id || $data.deal.id) ? (vue.openBlock(), vue.createBlock(_component_Empty, {
        key: 4,
        text: "这条线报暂时无法查看",
        subText: "你可以返回列表刷新后再试。",
        icon: "📭"
      })) : vue.createCommentVNode("v-if", true),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesDetailDetail = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-eca06f3c"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/detail/detail.vue"]]);
  const _sfc_main$i = {
    components: { DealCard, Empty, Toast: __easycom_0, Modal: __easycom_1 },
    mixins: [toastMixin],
    data() {
      return {
        keyword: "",
        history: [],
        hotKeywords: HOT_KEYWORDS,
        hasSearch: false,
        resultList: [],
        page: 1,
        pageSize: 10,
        loading: false,
        hasMore: true
      };
    },
    onLoad(options) {
      if (options.keyword) {
        this.keyword = options.keyword;
        this.doSearch();
      }
      this.loadHistory();
    },
    methods: {
      loadHistory() {
        const history = uni.getStorageSync("searchHistory");
        this.history = history ? JSON.parse(history) : [];
      },
      saveHistory() {
        let history = this.history.filter((item) => item !== this.keyword);
        history.unshift(this.keyword);
        history = history.slice(0, 10);
        this.history = history;
        uni.setStorageSync("searchHistory", JSON.stringify(history));
      },
      async clearHistory() {
        const res = await this.$modal({
          title: "清空搜索记录",
          content: "确认删除本地搜索历史吗？"
        });
        if (res.confirm) {
          this.history = [];
          uni.removeStorageSync("searchHistory");
        }
      },
      clearKeyword() {
        this.keyword = "";
        this.hasSearch = false;
        this.resultList = [];
      },
      quickSearch(keyword) {
        this.keyword = keyword;
        this.doSearch();
      },
      normalizeList(res) {
        if (res.data && Array.isArray(res.data.content))
          return res.data.content;
        if (res.data && Array.isArray(res.data.list))
          return res.data.list;
        if (res.data && Array.isArray(res.data.data))
          return res.data.data;
        if (Array.isArray(res.data))
          return res.data;
        return [];
      },
      doSearch() {
        if (!this.keyword.trim()) {
          this.$toastInfo("请输入搜索内容");
          return;
        }
        this.hasSearch = true;
        this.page = 1;
        this.saveHistory();
        this.loadData();
      },
      async loadData() {
        if (this.loading)
          return;
        this.loading = true;
        try {
          const res = await searchDeals({
            keyword: this.keyword,
            page: this.page - 1,
            size: this.pageSize
          });
          const list = this.normalizeList(res);
          if (this.page === 1) {
            this.resultList = list;
          } else {
            this.resultList = [...this.resultList, ...list];
          }
          this.hasMore = list.length === this.pageSize;
        } catch (e) {
          this.resultList = [];
        } finally {
          this.loading = false;
        }
      },
      loadMore() {
        if (!this.hasMore || this.loading)
          return;
        this.page += 1;
        this.loadData();
      },
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_DealCard = vue.resolveComponent("DealCard");
    const _component_Empty = vue.resolveComponent("Empty");
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "search-page" }, [
      vue.createElementVNode("view", { class: "search-header card" }, [
        vue.createElementVNode("view", { class: "search-box" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "⌕"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.keyword = $event),
              placeholder: "搜索平台、会员、红包、返利...",
              class: "search-input",
              "confirm-type": "search",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.doSearch && $options.doSearch(...args)),
              focus: true
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.keyword]
          ]),
          $data.keyword ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "clear-icon",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.clearKeyword && $options.clearKeyword(...args))
          }, "×")) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("text", {
          class: "cancel-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.goBack && $options.goBack(...args))
        }, "取消")
      ]),
      !$data.hasSearch && $data.history.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "search-history card"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "最近搜索"),
          vue.createElementVNode("text", {
            class: "clear-btn",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.clearHistory && $options.clearHistory(...args))
          }, "清空")
        ]),
        vue.createElementVNode("view", { class: "tag-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.history, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("text", {
                key: index,
                class: "tag-item",
                onClick: ($event) => $options.quickSearch(item)
              }, vue.toDisplayString(item), 9, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      !$data.hasSearch ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "hot-search card"
      }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "热门搜索")
        ]),
        vue.createElementVNode("view", { class: "tag-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.hotKeywords, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("text", {
                key: index,
                class: "tag-item hot",
                onClick: ($event) => $options.quickSearch(item)
              }, vue.toDisplayString(item), 9, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.hasSearch ? (vue.openBlock(), vue.createElementBlock(
        "scroll-view",
        {
          key: 2,
          class: "search-result",
          "scroll-y": "",
          onScrolltolower: _cache[5] || (_cache[5] = (...args) => $options.loadMore && $options.loadMore(...args))
        },
        [
          vue.createElementVNode("view", { class: "result-head" }, [
            vue.createElementVNode(
              "text",
              { class: "result-title" },
              "“" + vue.toDisplayString($data.keyword) + "” 的搜索结果",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "result-count" },
              "共 " + vue.toDisplayString($data.resultList.length) + " 条",
              1
              /* TEXT */
            )
          ]),
          $data.resultList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "result-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.resultList, (deal) => {
                return vue.openBlock(), vue.createBlock(_component_DealCard, {
                  key: deal._id || deal.id,
                  deal
                }, null, 8, ["deal"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          $data.resultList.length === 0 && !$data.loading ? (vue.openBlock(), vue.createBlock(_component_Empty, {
            key: 1,
            text: "没有找到匹配结果",
            subText: "试试更短的关键词，或者换平台名称搜索。",
            icon: "🧭"
          })) : vue.createCommentVNode("v-if", true),
          $data.resultList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "load-more"
          }, [
            $data.loading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "搜索中...")) : !$data.hasMore ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "没有更多结果了")) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true)
        ],
        32
        /* NEED_HYDRATION */
      )) : vue.createCommentVNode("v-if", true),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesSearchSearch = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-c10c040c"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/search/search.vue"]]);
  const _sfc_main$h = {
    components: { DealCard, Empty },
    data() {
      return {
        deals: [],
        page: 1,
        pageSize: 10,
        loading: false,
        hasMore: true
      };
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      normalizeList(res) {
        if (res.data && Array.isArray(res.data.content))
          return res.data.content;
        if (res.data && Array.isArray(res.data.list))
          return res.data.list;
        if (Array.isArray(res.data))
          return res.data;
        return [];
      },
      async loadData() {
        if (this.loading)
          return;
        this.loading = true;
        try {
          const res = await getMyDeals({ page: this.page, pageSize: this.pageSize });
          const list = this.normalizeList(res);
          if (this.page === 1) {
            this.deals = list;
          } else {
            this.deals = [...this.deals, ...list];
          }
          this.hasMore = list.length === this.pageSize;
        } catch (e) {
          this.deals = [];
        } finally {
          this.loading = false;
        }
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_DealCard = vue.resolveComponent("DealCard");
    return vue.openBlock(), vue.createElementBlock("view", { class: "my-deals-page" }, [
      vue.createElementVNode("view", { class: "hero card" }, [
        vue.createElementVNode("text", { class: "hero-title" }, "我的发布"),
        vue.createElementVNode("text", { class: "hero-subtitle" }, "这里收纳了你发过的每一条优惠线报，方便你回看和复盘。")
      ]),
      $data.deals.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "deal-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.deals, (deal) => {
            return vue.openBlock(), vue.createBlock(_component_DealCard, {
              key: deal._id || deal.id,
              deal
            }, null, 8, ["deal"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-text" }, "你还没有发布过线报"),
        vue.createElementVNode("text", { class: "empty-sub" }, "把刚发现的优惠整理一下发出来，很快这里就会丰富起来。")
      ]))
    ]);
  }
  const PagesMyDealsMyDeals = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-85ee2e13"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/my-deals/my-deals.vue"]]);
  const _sfc_main$g = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        loading: false,
        showAccountLogin: false,
        deviceId: "",
        deviceModel: "",
        agreeAgreement: false,
        accountForm: {
          username: "",
          password: ""
        }
      };
    },
    onLoad() {
      this.getDeviceInfo();
    },
    methods: {
      getDeviceInfo() {
        uni.getSystemInfo({
          success: (res) => {
            this.deviceId = res.deviceId;
            this.deviceModel = res.deviceModel;
          }
        });
      },
      async deviceLogin() {
        if (!this.agreeAgreement) {
          this.$toastInfo("请先同意用户协议和隐私政策");
          return;
        }
        if (!this.deviceId) {
          this.$toastError("获取设备信息失败");
          return;
        }
        this.loading = true;
        try {
          const res = await login({
            openId: this.deviceId,
            deviceModel: this.deviceModel,
            loginType: "device"
          });
          if (res.code === 200) {
            this.handleLoginSuccess(res.data);
          } else {
            throw res;
          }
        } catch (e) {
          if (e && e.code === 404) {
            uni.navigateTo({ url: `/pages/edit-profile/edit-profile?deviceId=${this.deviceId}&deviceModel=${this.deviceModel}` });
          } else {
            this.$toastError(e && e.message ? e.message : "登录失败");
          }
        } finally {
          this.loading = false;
        }
      },
      async accountLogin() {
        if (!this.agreeAgreement) {
          this.$toastInfo("请先同意用户协议和隐私政策");
          return;
        }
        if (!this.accountForm.username.trim()) {
          this.$toastInfo("请输入账号");
          return;
        }
        if (!this.accountForm.password.trim()) {
          this.$toastInfo("请输入密码");
          return;
        }
        this.loading = true;
        try {
          const res = await login({
            username: this.accountForm.username,
            password: this.accountForm.password,
            loginType: "account"
          });
          if (res.code === 200) {
            this.handleLoginSuccess(res.data);
          } else {
            throw res;
          }
        } catch (e) {
          this.$toastError(e && e.message ? e.message : "账号或密码错误");
        } finally {
          this.loading = false;
        }
      },
      handleLoginSuccess(data) {
        uni.setStorageSync("token", data.token);
        uni.setStorageSync("userInfo", data.user);
        this.$toastSuccess("登录成功");
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/index/index"
          });
        }, 1e3);
      },
      goAgreement() {
        uni.navigateTo({ url: "/pages/agreement/agreement" });
      },
      goPrivacy() {
        uni.navigateTo({ url: "/pages/privacy/privacy" });
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-page" }, [
      vue.createElementVNode("view", { class: "logo-section" }, [
        vue.createElementVNode("view", { class: "sheep" }, [
          vue.createElementVNode("view", { class: "wool wool-1" }),
          vue.createElementVNode("view", { class: "wool wool-2" }),
          vue.createElementVNode("view", { class: "wool wool-3" }),
          vue.createElementVNode("view", { class: "wool wool-4" }),
          vue.createElementVNode("view", { class: "wool wool-5" }),
          vue.createElementVNode("view", { class: "wool wool-6" }),
          vue.createElementVNode("view", { class: "wool wool-7" }),
          vue.createElementVNode("view", { class: "face" }, [
            vue.createElementVNode("view", { class: "eye eye-left" }, [
              vue.createElementVNode("view", { class: "pupil" }),
              vue.createElementVNode("view", { class: "highlight" })
            ]),
            vue.createElementVNode("view", { class: "eye eye-right open" }, [
              vue.createElementVNode("view", { class: "pupil" }),
              vue.createElementVNode("view", { class: "highlight" })
            ]),
            vue.createElementVNode("view", { class: "eye eye-right closed" }),
            vue.createElementVNode("view", { class: "cheek cheek-left" }),
            vue.createElementVNode("view", { class: "cheek cheek-right" }),
            vue.createElementVNode("view", { class: "nose" }),
            vue.createElementVNode("view", { class: "mouth" })
          ]),
          vue.createElementVNode("view", { class: "horn horn-left" }),
          vue.createElementVNode("view", { class: "horn horn-right" })
        ]),
        vue.createElementVNode("text", { class: "app-name" }, "薅羊毛"),
        vue.createElementVNode("text", { class: "app-slogan" }, "优雅省钱 · 品质生活")
      ]),
      vue.createElementVNode("view", { class: "login-form card" }, [
        vue.createElementVNode("view", { class: "form-header" }, [
          vue.createElementVNode("text", { class: "form-title" }, "欢迎回来"),
          vue.createElementVNode("text", { class: "form-subtitle" }, "登录后查看你的优惠情报")
        ]),
        vue.createElementVNode("button", {
          class: "primary-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.deviceLogin && $options.deviceLogin(...args)),
          disabled: $data.loading
        }, vue.toDisplayString($data.loading ? "登录中..." : "设备一键登录"), 9, ["disabled"]),
        vue.createElementVNode("view", { class: "divider" }, [
          vue.createElementVNode("view", { class: "divider-line" }),
          vue.createElementVNode("text", { class: "divider-text" }, "或"),
          vue.createElementVNode("view", { class: "divider-line" })
        ]),
        $data.showAccountLogin ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "account-form"
        }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.accountForm.username = $event),
              placeholder: "请输入账号",
              class: "account-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.accountForm.username]
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.accountForm.password = $event),
              type: "password",
              placeholder: "请输入密码",
              class: "account-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.accountForm.password]
          ]),
          vue.createElementVNode("button", {
            class: "primary-btn account-btn",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.accountLogin && $options.accountLogin(...args)),
            disabled: $data.loading
          }, vue.toDisplayString($data.loading ? "登录中..." : "立即登录"), 9, ["disabled"]),
          vue.createElementVNode("view", {
            class: "other-login",
            onClick: _cache[4] || (_cache[4] = ($event) => $data.showAccountLogin = false)
          }, [
            vue.createElementVNode("text", { class: "other-text" }, "收起")
          ])
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "other-login",
          onClick: _cache[5] || (_cache[5] = ($event) => $data.showAccountLogin = true)
        }, [
          vue.createElementVNode("text", { class: "other-text" }, "使用账号密码登录")
        ])),
        vue.createElementVNode("view", { class: "agreement-section" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["checkbox", { checked: $data.agreeAgreement }]),
              onClick: _cache[6] || (_cache[6] = ($event) => $data.agreeAgreement = !$data.agreeAgreement)
            },
            [
              $data.agreeAgreement ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "✓")) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode("view", { class: "agreement-text" }, [
            vue.createElementVNode("text", null, "我已阅读并同意"),
            vue.createElementVNode("text", {
              class: "link",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.goAgreement && $options.goAgreement(...args))
            }, "《用户协议》"),
            vue.createElementVNode("text", null, "和"),
            vue.createElementVNode("text", {
              class: "link",
              onClick: _cache[8] || (_cache[8] = (...args) => $options.goPrivacy && $options.goPrivacy(...args))
            }, "《隐私政策》")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "bottom-tips" }, [
        vue.createElementVNode("text", { class: "tip-item" }, "• 保存你的发布记录"),
        vue.createElementVNode("text", { class: "tip-item" }, "• 查看审核与提醒通知"),
        vue.createElementVNode("text", { class: "tip-item" }, "• 建立自己的优惠情报档案")
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-e4e4508d"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/login/login.vue"]]);
  const _sfc_main$f = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        deviceId: "",
        deviceModel: "",
        submitting: false,
        form: {
          nickname: "",
          password: "",
          confirmPassword: ""
        }
      };
    },
    onLoad(options) {
      this.deviceId = options.deviceId;
      this.deviceModel = options.deviceModel;
      this.generateDefaultNickname();
    },
    methods: {
      generateDefaultNickname() {
        const cleanModel = this.deviceModel ? this.deviceModel.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10) : "Device";
        const timestamp = Date.now().toString().slice(-6);
        this.form.nickname = cleanModel + timestamp;
      },
      randomNickname() {
        const cleanModel = this.deviceModel ? this.deviceModel.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10) : "Device";
        const randomNum = Math.floor(Math.random() * 1e6).toString().padStart(6, "0");
        this.form.nickname = cleanModel + randomNum;
      },
      onNicknameInput(e) {
        const value = e.detail.value;
        const filtered = value.replace(/[^a-zA-Z0-9]/g, "");
        if (value !== filtered)
          this.form.nickname = filtered;
      },
      async submit() {
        if (!this.form.nickname.trim()) {
          this.$toastInfo("请输入昵称");
          return;
        }
        if (!/^[a-zA-Z0-9]+$/.test(this.form.nickname)) {
          this.$toastInfo("昵称只能包含英文和数字");
          return;
        }
        if (!this.form.password.trim()) {
          this.$toastInfo("请设置密码");
          return;
        }
        if (this.form.password.length < 6) {
          this.$toastInfo("密码至少 6 位");
          return;
        }
        if (this.form.password !== this.form.confirmPassword) {
          this.$toastInfo("两次输入的密码不一致");
          return;
        }
        this.submitting = true;
        try {
          const res = await register({
            openId: this.deviceId,
            nickname: this.form.nickname,
            password: this.form.password,
            deviceModel: this.deviceModel
          });
          uni.setStorageSync("token", res.data.token);
          uni.setStorageSync("userInfo", res.data.user);
          this.$toastSuccess("注册成功");
          setTimeout(() => {
            uni.switchTab({ url: "/pages/index/index" });
          }, 1500);
        } catch (e) {
          if (e.code === 409) {
            this.$toastError("昵称已被使用");
          } else {
            this.$toastError("注册失败，请稍后再试");
          }
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "edit-profile-page" }, [
      vue.createElementVNode("view", { class: "hero card" }, [
        vue.createElementVNode("text", { class: "hero-title" }, "首次登录，先完成你的情报站身份"),
        vue.createElementVNode("text", { class: "hero-subtitle" }, "昵称只支持英文和数字，方便我们避免特殊字符带来的兼容问题。")
      ]),
      vue.createElementVNode("view", { class: "form-container card" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, [
            vue.createTextVNode("昵称 "),
            vue.createElementVNode("text", { class: "required" }, "*")
          ]),
          vue.createElementVNode("view", { class: "nickname-row" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.nickname = $event),
                placeholder: "请输入昵称（英文和数字）",
                class: "input",
                maxlength: "20",
                onInput: _cache[1] || (_cache[1] = (...args) => $options.onNicknameInput && $options.onNicknameInput(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.form.nickname]
            ]),
            vue.createElementVNode("text", {
              class: "random-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.randomNickname && $options.randomNickname(...args))
            }, "换一个")
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, [
            vue.createTextVNode("密码 "),
            vue.createElementVNode("text", { class: "required" }, "*")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.password = $event),
              type: "password",
              placeholder: "请设置密码（至少 6 位）",
              class: "input",
              maxlength: "20"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.password]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, [
            vue.createTextVNode("确认密码 "),
            vue.createElementVNode("text", { class: "required" }, "*")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.confirmPassword = $event),
              type: "password",
              placeholder: "请再次输入密码",
              class: "input",
              maxlength: "20"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.confirmPassword]
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "submit-bar" }, [
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.submit && $options.submit(...args)),
          disabled: $data.submitting
        }, vue.toDisplayString($data.submitting ? "注册中..." : "完成注册"), 9, ["disabled"])
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesEditProfileEditProfile = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-c0f45e44"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/edit-profile/edit-profile.vue"]]);
  const _sfc_main$e = {
    components: { Empty, Toast: __easycom_0, Modal: __easycom_1 },
    mixins: [toastMixin],
    data() {
      return {
        tabs: [
          { label: "待审核", value: "pending", count: 0 },
          { label: "已通过", value: "approved", count: 0 },
          { label: "已驳回/已下架", value: "rejected", count: 0 }
        ],
        currentTab: "pending",
        auditList: [],
        page: 1,
        pageSize: 10,
        loading: false,
        refreshing: false,
        hasMore: true
      };
    },
    computed: {
      emptyText() {
        const texts = { pending: "没有待审核内容", approved: "还没有通过的记录", rejected: "还没有驳回或下架的记录" };
        return texts[this.currentTab];
      }
    },
    onLoad() {
      this.loadData();
    },
    methods: {
      formatTime,
      getStatusText(status) {
        const texts = { pending: "待审核", approved: "已通过", rejected: "已驳回" };
        return texts[status] || status;
      },
      normalizeList(res) {
        if (res.data && Array.isArray(res.data.content))
          return res.data.content;
        if (res.data && Array.isArray(res.data.list))
          return res.data.list;
        if (Array.isArray(res.data))
          return res.data;
        return [];
      },
      switchTab(tab) {
        if (this.currentTab === tab)
          return;
        this.currentTab = tab;
        this.page = 1;
        this.auditList = [];
        this.loadData();
      },
      async loadData() {
        if (this.loading)
          return;
        this.loading = true;
        try {
          let res;
          if (this.currentTab === "pending") {
            res = await getPendingDeals({ page: this.page - 1, pageSize: this.pageSize });
          } else {
            res = await getDealList({ status: this.currentTab === "approved" ? 1 : 2, page: this.page - 1, pageSize: this.pageSize });
          }
          let list = this.normalizeList(res);
          formatAppLog("log", "at pages/audit/audit.vue:147", "审核列表数据:", this.currentTab, list);
          if (this.page === 1) {
            this.auditList = list;
          } else {
            this.auditList = [...this.auditList, ...list];
          }
          this.hasMore = list.length === this.pageSize;
        } catch (e) {
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
          this.refreshing = false;
        }
      },
      loadMore() {
        if (!this.hasMore || this.loading)
          return;
        this.page += 1;
        this.loadData();
      },
      onRefresh() {
        this.refreshing = true;
        this.page = 1;
        this.loadData();
      },
      async handleApprove(deal) {
        const res = await this.$modal({
          title: "确认通过",
          content: "确认通过这条发布吗？"
        });
        if (res.confirm) {
          try {
            await approveDeal(deal.id || deal._id);
            this.$toastSuccess("已通过");
            this.onRefresh();
          } catch (e) {
            this.$toastError("操作失败");
          }
        }
      },
      previewImage(images, current) {
        uni.previewImage({
          urls: images,
          current: images[current]
        });
      },
      async handleOffline(deal) {
        const res = await this.$modal({
          title: "确认下架",
          content: "确定要下架这条发布吗？下架后将移动到已驳回列表。"
        });
        if (res.confirm) {
          try {
            await offlineDeal(deal.id || deal._id);
            this.$toastSuccess("已下架");
            this.onRefresh();
          } catch (e) {
            this.$toastError("操作失败");
          }
        }
      },
      async handleReject(deal) {
        const res = await this.$modal({
          title: "确认驳回",
          content: "确认驳回这条发布吗？"
        });
        if (res.confirm) {
          try {
            await rejectDeal(deal.id || deal._id);
            this.$toastSuccess("已驳回");
            this.onRefresh();
          } catch (e) {
            this.$toastError("操作失败");
          }
        }
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Empty = vue.resolveComponent("Empty");
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "audit-page" }, [
      vue.createElementVNode("view", { class: "hero card" }, [
        vue.createElementVNode("text", { class: "hero-title" }, "审核工作台"),
        vue.createElementVNode("text", { class: "hero-subtitle" }, "把待处理内容集中在一个清晰的队列里，降低判断成本。")
      ]),
      vue.createElementVNode("view", { class: "tab-bar card" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.tabs, (tab) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: tab.value,
              class: vue.normalizeClass(["tab-item", { active: $data.currentTab === tab.value }]),
              onClick: ($event) => $options.switchTab(tab.value)
            }, [
              vue.createTextVNode(
                vue.toDisplayString(tab.label) + " ",
                1
                /* TEXT */
              ),
              tab.count > 0 ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "tab-badge"
                },
                vue.toDisplayString(tab.count),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("scroll-view", {
        class: "audit-list",
        "scroll-y": "",
        onScrolltolower: _cache[0] || (_cache[0] = (...args) => $options.loadMore && $options.loadMore(...args)),
        "refresher-enabled": true,
        "refresher-triggered": $data.refreshing,
        onRefresherrefresh: _cache[1] || (_cache[1] = (...args) => $options.onRefresh && $options.onRefresh(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.auditList, (deal) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "deal-item card",
              key: deal.id || deal._id
            }, [
              vue.createElementVNode("view", { class: "deal-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "platform-tag" },
                  vue.toDisplayString(deal.platform || "全网"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["status-tag", deal.status])
                  },
                  vue.toDisplayString($options.getStatusText(deal.status)),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "deal-title" },
                vue.toDisplayString(deal.title),
                1
                /* TEXT */
              ),
              deal.content ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "deal-content"
                },
                vue.toDisplayString(deal.content.substring(0, 100)) + vue.toDisplayString(deal.content.length > 100 ? "..." : ""),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              deal.images && deal.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "deal-images"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(deal.images, (img, index) => {
                    return vue.openBlock(), vue.createElementBlock("image", {
                      key: index,
                      src: img,
                      mode: "aspectFill",
                      class: "deal-image",
                      "lazy-load": "",
                      onClick: ($event) => $options.previewImage(deal.images, index)
                    }, null, 8, ["src", "onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 2,
                  style: { "font-size": "20rpx", "color": "#999", "margin-bottom": "16rpx" }
                },
                " 无图片数据: " + vue.toDisplayString(JSON.stringify(deal.images)),
                1
                /* TEXT */
              )),
              deal.profit ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "deal-profit"
              }, [
                vue.createElementVNode("text", { class: "profit-label" }, "预计收益"),
                vue.createElementVNode(
                  "text",
                  { class: "profit-value" },
                  "+" + vue.toDisplayString(deal.profit) + " 元",
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "deal-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "publish-time" },
                  vue.toDisplayString($options.formatTime(deal.createTime || deal.publishTime)),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "publisher" },
                  "发布者 " + vue.toDisplayString(deal.publisherName || deal.userId || "未知"),
                  1
                  /* TEXT */
                )
              ]),
              deal.status === 0 || deal.status === "pending" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 4,
                class: "action-bar"
              }, [
                vue.createElementVNode("button", {
                  class: "btn-reject",
                  onClick: ($event) => $options.handleReject(deal)
                }, "驳回", 8, ["onClick"]),
                vue.createElementVNode("button", {
                  class: "btn-approve",
                  onClick: ($event) => $options.handleApprove(deal)
                }, "通过", 8, ["onClick"])
              ])) : deal.status === 1 || deal.status === "approved" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 5,
                class: "action-bar"
              }, [
                vue.createElementVNode("button", {
                  class: "btn-reject",
                  onClick: ($event) => $options.handleOffline(deal)
                }, "下架", 8, ["onClick"])
              ])) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.auditList.length === 0 && !$data.loading ? (vue.openBlock(), vue.createBlock(_component_Empty, {
          key: 0,
          text: $options.emptyText,
          subText: "当前状态下还没有需要处理的内容。",
          icon: "🧾"
        }, null, 8, ["text"])) : vue.createCommentVNode("v-if", true),
        $data.auditList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "load-more"
        }, [
          $data.loading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "加载中...")) : !$data.hasMore ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "没有更多内容了")) : (vue.openBlock(), vue.createElementBlock("text", { key: 2 }, "继续下滑查看更多"))
        ])) : vue.createCommentVNode("v-if", true)
      ], 40, ["refresher-triggered"]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesAuditAudit = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-249ccafc"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/audit/audit.vue"]]);
  const _sfc_main$d = {
    components: { Toast: __easycom_0, Modal: __easycom_1 },
    mixins: [toastMixin],
    data() {
      return {
        version: "1.0.0",
        cacheSize: "0 KB"
      };
    },
    computed: {
      isAdmin() {
        const userInfo = uni.getStorageSync("userInfo") || {};
        return userInfo.role === "admin" || userInfo.isAdmin === true;
      },
      isH5() {
        return uni.getSystemInfoSync().platform === "h5" || typeof plus === "undefined";
      }
    },
    async onLoad() {
      await this.loadVersion();
      this.calculateCacheSize();
    },
    methods: {
      async loadVersion() {
        try {
          const platform = uni.getSystemInfoSync().platform.toLowerCase();
          const res = await getLatestVersion({
            platform: platform === "android" ? "android" : "ios"
          });
          if (res.code === 200 && res.data) {
            this.version = res.data.versionName || "1.0.0";
          }
        } catch (e) {
          formatAppLog("log", "at pages/settings/settings.vue:122", "获取版本失败", e);
        }
      },
      goChangePassword() {
        uni.navigateTo({ url: "/pages/change-password/change-password" });
      },
      goChangeNickname() {
        uni.navigateTo({ url: "/pages/change-nickname/change-nickname" });
      },
      goFeedback() {
        uni.navigateTo({ url: "/pages/feedback/feedback" });
      },
      goVersionManage() {
        uni.navigateTo({ url: "/pages/admin-version/admin-version" });
      },
      async goDownloadApp() {
        uni.showLoading({ title: "获取中..." });
        try {
          const platform = uni.getSystemInfoSync().platform.toLowerCase();
          const res = await getVersionList({
            platform: platform === "android" ? "android" : "ios",
            status: 1
          });
          uni.hideLoading();
          if (res.code === 200 && res.data && res.data.length > 0) {
            const latestVersion = res.data[0];
            const downloadUrl = latestVersion.downloadUrl;
            if (downloadUrl) {
              const confirmResult = await this.$modal({
                title: "下载 App",
                content: "发现版本 v" + latestVersion.versionName + "\n\n点击确定复制下载链接",
                confirmText: "复制链接",
                showCancel: false
              });
              if (confirmResult.confirm) {
                uni.setClipboardData({
                  data: downloadUrl,
                  success: () => {
                    this.$toastSuccess("下载链接已复制，请前往浏览器打开");
                  },
                  fail: () => {
                    this.$toastInfo("下载链接：" + downloadUrl);
                  }
                });
              }
            } else {
              this.$toastError("暂无下载链接");
            }
          } else {
            this.$toastError("暂无可用版本");
          }
        } catch (e) {
          uni.hideLoading();
          this.$toastError("获取失败");
        }
      },
      calculateCacheSize() {
        try {
          const info = uni.getStorageInfoSync();
          const sizeKB = info.currentSize;
          if (sizeKB > 1024) {
            this.cacheSize = (sizeKB / 1024).toFixed(1) + " MB";
          } else {
            this.cacheSize = sizeKB + " KB";
          }
        } catch (e) {
          this.cacheSize = "未知";
        }
      },
      async clearCache() {
        const res = await this.$modal({
          title: "清除缓存",
          content: "确定要清除所有缓存吗？"
        });
        if (res.confirm) {
          uni.clearStorageSync();
          this.calculateCacheSize();
          this.$toastSuccess("缓存已清除");
        }
      },
      goDisclaimer() {
        uni.navigateTo({ url: "/pages/disclaimer/disclaimer" });
      },
      goAbout() {
        this.$modal({
          title: "关于我们",
          content: "薅羊毛情报站 - 分享优质优惠信息，一起薅羊毛！\n\n版本：" + this.version,
          showCancel: false
        });
      },
      async checkUpdate() {
        uni.showLoading({ title: "检查中..." });
        try {
          const platform = uni.getSystemInfoSync().platform.toLowerCase();
          const res = await checkVersionUpdate({
            platform: platform === "android" ? "android" : "ios",
            versionCode: this.version
          });
          uni.hideLoading();
          if (res.code === 200 && res.data) {
            const { hasUpdate, forceUpdate, latestVersion, message } = res.data;
            if (hasUpdate && latestVersion) {
              const confirmResult = await this.$modal({
                title: "发现新版本 v" + latestVersion.versionName,
                content: latestVersion.updateContent || "有新版本可以更新！\n\n是否立即下载？",
                confirmText: forceUpdate ? "立即更新" : "稍后",
                cancelText: forceUpdate ? "" : "取消"
              });
              if (confirmResult.confirm && latestVersion.downloadUrl) {
                const downloadUrl = latestVersion.downloadUrl;
                const isApp = uni.getSystemInfoSync().platform === "android" || uni.getSystemInfoSync().platform === "ios";
                if (forceUpdate && isApp) {
                  plus.runtime.openURL(downloadUrl);
                } else {
                  uni.setClipboardData({
                    data: downloadUrl,
                    success: () => {
                      this.$toastSuccess("下载链接已复制，请前往浏览器打开");
                    },
                    fail: () => {
                      this.$toastInfo("下载链接：" + downloadUrl);
                    }
                  });
                }
              }
            } else {
              this.$toastSuccess(message || "已是最新版本");
            }
          } else {
            this.$toastSuccess("已是最新版本");
          }
        } catch (e) {
          uni.hideLoading();
          this.$toastSuccess("已是最新版本");
        }
      },
      compareVersion(v1, v2) {
        const parseV = (v) => v.split(".").map((s) => parseInt(s) || 0);
        const arr1 = parseV(v1);
        const arr2 = parseV(v2);
        for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
          const n1 = arr1[i] || 0;
          const n2 = arr2[i] || 0;
          if (n1 > n2)
            return 1;
          if (n1 < n2)
            return -1;
        }
        return 0;
      },
      async handleLogout() {
        const res = await this.$modal({
          title: "退出登录",
          content: "确定要退出当前账号吗？"
        });
        if (res.confirm) {
          uni.removeStorageSync("token");
          uni.removeStorageSync("currentUser");
          uni.removeStorageSync("userInfo");
          uni.switchTab({ url: "/pages/index/index" });
          this.$toastSuccess("已退出登录");
        }
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "settings-page" }, [
      vue.createElementVNode("view", { class: "section card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "账户设置"),
        vue.createElementVNode("view", { class: "menu-list" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goChangePassword && $options.goChangePassword(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "修改密码"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.goChangeNickname && $options.goChangeNickname(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "修改昵称"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ]),
      $options.isAdmin ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "section card"
      }, [
        vue.createElementVNode("view", { class: "section-title" }, "系统管理"),
        vue.createElementVNode("view", { class: "menu-list" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.goVersionManage && $options.goVersionManage(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "版本管理"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "section card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "帮助与反馈"),
        vue.createElementVNode("view", { class: "menu-list" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.goFeedback && $options.goFeedback(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "意见反馈"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section card" }, [
        vue.createElementVNode("view", { class: "section-title" }, "通用设置"),
        vue.createElementVNode("view", { class: "menu-list" }, [
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.clearCache && $options.clearCache(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "清除缓存"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          !$options.isH5 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "menu-item",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.checkUpdate && $options.checkUpdate(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "检查更新"),
            vue.createElementVNode("view", { class: "menu-right" }, [
              vue.createElementVNode(
                "text",
                { class: "version-text" },
                "v" + vue.toDisplayString($data.version),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "menu-arrow" }, "›")
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "menu-item",
            onClick: _cache[6] || (_cache[6] = (...args) => $options.goDownloadApp && $options.goDownloadApp(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "下载 App"),
            vue.createElementVNode("view", { class: "menu-right" }, [
              vue.createElementVNode("text", { class: "download-tip" }, "获取更多功能"),
              vue.createElementVNode("text", { class: "menu-arrow" }, "›")
            ])
          ])),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.goDisclaimer && $options.goDisclaimer(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "免责声明"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "menu-item",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.goAbout && $options.goAbout(...args))
          }, [
            vue.createElementVNode("text", { class: "menu-text" }, "关于我们"),
            vue.createElementVNode("text", { class: "menu-arrow" }, "›")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "logout-section" }, [
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, "退出登录")
      ]),
      vue.createElementVNode(
        "view",
        { class: "bottom-tip" },
        "薅羊毛情报站 v" + vue.toDisplayString($data.version),
        1
        /* TEXT */
      ),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-7fad0a1c"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/settings/settings.vue"]]);
  const _sfc_main$c = {
    name: "DisclaimerPage",
    methods: {
      goAgreement() {
        uni.navigateTo({ url: "/pages/agreement/agreement" });
      },
      goPrivacy() {
        uni.navigateTo({ url: "/pages/privacy/privacy" });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "disclaimer-page" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "免责声明")
      ]),
      vue.createElementVNode("view", { class: "content card" }, [
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "一、信息来源与真实性"),
          vue.createElementVNode("text", { class: "section-text" }, ' 1. 本应用（"薅羊毛情报站"）仅作为优惠信息分享平台，所有优惠信息均由用户自行发布。 2. 我们不对用户发布信息的真实性、准确性、完整性、合法性做任何明示或暗示的保证。 3. 优惠信息可能存在时效性，活动规则可能随时变更，请以各平台官方最新规则为准。 4. 建议用户在参与任何优惠活动前，务必前往官方平台核实活动详情。 ')
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "二、平台责任限制"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 因使用本应用信息导致的任何损失（包括但不限于财产损失、账号风险等），本平台不承担任何责任。 2. 用户应自行判断优惠信息的可靠性，谨慎参与各类活动。 3. 对于第三方平台的链接跳转，本平台不对其安全性、合法性负责。 4. 如用户发现虚假信息，可通过举报功能反馈，我们将及时处理。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "三、知识产权"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 本应用展示的品牌名称、商标、Logo 等知识产权归 respective 权利人所有。 2. 本平台仅作信息展示用途，不代表与任何品牌存在合作关系。 3. 如权利人认为内容侵权，可联系我方删除。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "四、用户行为规范"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 用户发布信息应遵守法律法规，不得发布虚假、欺诈信息。 2. 禁止利用本平台从事任何违法违规活动。 3. 用户应对自己发布的内容承担全部法律责任。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "五、其他"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 本声明最终解释权归本平台所有。 2. 本平台保留随时修改本声明的权利。 3. 如对本声明有任何疑问，请联系客服。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "六、相关协议"),
          vue.createElementVNode("view", { class: "link-list" }, [
            vue.createElementVNode("text", {
              class: "link-item",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.goAgreement && $options.goAgreement(...args))
            }, "《用户协议》"),
            vue.createElementVNode("text", {
              class: "link-item",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goPrivacy && $options.goPrivacy(...args))
            }, "《隐私政策》")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("text", { class: "footer-text" }, "最后更新：2026年3月")
      ])
    ]);
  }
  const PagesDisclaimerDisclaimer = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-a44ac5c9"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/disclaimer/disclaimer.vue"]]);
  const _sfc_main$b = {
    name: "AgreementPage"
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "agreement-page" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "用户协议")
      ]),
      vue.createElementVNode("view", { class: "content card" }, [
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "一、协议接受"),
          vue.createElementVNode("text", { class: "section-text" }, ' 欢迎使用"薅羊毛情报站"！在您使用本应用之前，请仔细阅读本用户协议。当您点击"同意"或开始使用本应用时，即表示您已阅读、理解并同意接受本协议的所有条款。 如果您不同意本协议的任何内容，请立即停止使用本应用。 ')
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "二、服务说明"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 本应用是一个优惠信息分享平台，为用户提供各类优惠活动的发布、浏览和分享服务。 2. 我们保留随时修改、暂停或终止服务的权利，且无需事先通知。 3. 我们不对服务的及时性、安全性、准确性做任何担保。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "三、账号注册与安全"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 您需要提供真实、准确、完整的注册信息，并及时更新。 2. 您有责任妥善保管账号和密码，对账号下的所有行为负责。 3. 如发现账号被盗或异常，请立即联系我们。 4. 我们有权对违反规定的账号进行封禁处理。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "四、用户行为规范"),
          vue.createElementVNode("text", { class: "section-text" }, " 您在使用本应用时，不得从事以下行为： 1. 发布虚假、欺诈、误导性的优惠信息 2. 侵犯他人知识产权或其他合法权益 3. 传播违法、违规、有害信息 4. 从事任何商业广告行为（经授权除外） 5. 干扰、破坏本应用的正常运行 6. 其他任何违反法律法规的行为 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "五、内容发布"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 您发布的内容应真实、合法、有效。 2. 您对自己发布的内容承担全部法律责任。 3. 我们有权对违规内容进行删除、屏蔽等处理。 4. 您授予我们使用、复制、修改、发布您内容的权利。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "六、知识产权"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 本应用的界面设计、代码、商标等知识产权归我们所有。 2. 用户发布内容的知识产权归用户所有，但用户授予我们使用许可。 3. 未经授权，不得复制、修改、传播本应用的任何内容。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "七、免责声明"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 本应用仅作为信息平台，不对优惠信息的真实性、有效性负责。 2. 用户应自行判断信息可靠性，谨慎参与活动。 3. 因使用本应用导致的任何损失，我们不承担责任。 4. 对于第三方链接，我们不对其内容和安全性负责。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "八、协议修改"),
          vue.createElementVNode("text", { class: "section-text" }, " 我们有权随时修改本协议，修改后的协议将在应用内公布。如您继续使用本应用，即视为接受修改后的协议。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "九、法律适用"),
          vue.createElementVNode("text", { class: "section-text" }, " 本协议的订立、执行和解释均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方均可向我们所在地人民法院提起诉讼。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "十、联系我们"),
          vue.createElementVNode("text", { class: "section-text" }, " 如您对本协议有任何疑问，请通过应用内反馈功能联系我们。 ")
        ])
      ]),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("text", { class: "footer-text" }, "最后更新：2026年3月")
      ])
    ]);
  }
  const PagesAgreementAgreement = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-b6d09298"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/agreement/agreement.vue"]]);
  const _sfc_main$a = {
    name: "PrivacyPage"
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "privacy-page" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "隐私政策")
      ]),
      vue.createElementVNode("view", { class: "content card" }, [
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "一、引言"),
          vue.createElementVNode("text", { class: "section-text" }, ' "薅羊毛情报站"（以下简称"我们"）非常重视用户的隐私保护。本隐私政策说明我们如何收集、使用、存储和保护您的个人信息。 请您在使用本应用前仔细阅读本政策。如您不同意本政策的任何内容，请停止使用本应用。 ')
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "二、信息收集"),
          vue.createElementVNode("text", { class: "section-text" }, " 我们可能会收集以下信息： 1. 注册信息：用户名、密码、手机号等 2. 设备信息：设备型号、操作系统版本、唯一设备标识符等 3. 使用信息：浏览记录、发布内容、操作日志等 4. 位置信息：经您授权后获取的位置信息 5. 其他信息：您主动提供的其他信息 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "三、信息使用"),
          vue.createElementVNode("text", { class: "section-text" }, " 我们使用您的信息用于： 1. 提供、维护和改进我们的服务 2. 验证您的身份，防止欺诈 3. 向您发送服务通知和更新 4. 进行数据分析和研究，改善用户体验 5. 遵守法律法规要求 我们不会将您的个人信息出售给第三方。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "四、信息共享"),
          vue.createElementVNode("text", { class: "section-text" }, " 我们在以下情况下可能共享您的信息： 1. 经您明确同意 2. 为提供服务的需要（如第三方服务提供商） 3. 遵守法律法规或政府部门要求 4. 保护我们的合法权益 5. 在合并、收购等情况下转移信息 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "五、信息存储与安全"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 我们采取合理的技术和管理措施保护您的信息安全。 2. 您的信息存储在安全的服务器上。 3. 我们使用加密技术保护敏感数据传输。 4. 尽管我们努力保护信息安全，但互联网传输无法保证绝对安全。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "六、您的权利"),
          vue.createElementVNode("text", { class: "section-text" }, " 您对您的个人信息享有以下权利： 1. 访问权：查看我们持有的您的信息 2. 更正权：更正不准确的信息 3. 删除权：要求删除您的信息 4. 限制处理权：限制我们对您信息的处理 5. 数据可携带权：获取您的信息副本 6. 撤回同意权：撤回之前的授权 如需行使上述权利，请通过应用内反馈功能联系我们。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "七、Cookie 和类似技术"),
          vue.createElementVNode("text", { class: "section-text" }, " 我们可能使用 Cookie 和类似技术来： 1. 记住您的登录状态 2. 了解您的使用习惯 3. 改善用户体验 您可以通过浏览器设置管理 Cookie。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "八、未成年人保护"),
          vue.createElementVNode("text", { class: "section-text" }, " 1. 本应用不向未满14周岁的未成年人提供服务。 2. 如您是未成年人，请在监护人指导下使用本应用。 3. 如发现未成年人未经同意提供个人信息，请联系我们删除。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "九、政策更新"),
          vue.createElementVNode("text", { class: "section-text" }, " 我们可能适时更新本隐私政策。更新后的政策将在应用内公布，重大变更会通知您。继续使用本应用即表示您接受更新后的政策。 ")
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "section-title" }, "十、联系我们"),
          vue.createElementVNode("text", { class: "section-text" }, " 如您对本隐私政策有任何疑问，请通过应用内反馈功能联系我们。 ")
        ])
      ]),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("text", { class: "footer-text" }, "最后更新：2026年3月")
      ])
    ]);
  }
  const PagesPrivacyPrivacy = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-33d54784"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/privacy/privacy.vue"]]);
  const _sfc_main$9 = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        submitting: false
      };
    },
    methods: {
      async handleChangePassword() {
        if (!this.oldPassword) {
          this.$toastInfo("请输入原密码");
          return;
        }
        if (!this.newPassword) {
          this.$toastInfo("请输入新密码");
          return;
        }
        if (this.newPassword.length < 6) {
          this.$toastInfo("新密码至少6位");
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.$toastInfo("两次密码不一致");
          return;
        }
        this.submitting = true;
        try {
          const res = await putWithQuery("/user/password", {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          });
          if (res.code === 200) {
            this.$toastSuccess("密码修改成功");
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            this.$toastError(res.message || "修改失败");
          }
        } catch (e) {
          this.$toastError("修改失败");
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "change-page" }, [
      vue.createElementVNode("view", { class: "form-section card" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "原密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.oldPassword = $event),
              type: "password",
              placeholder: "请输入原密码",
              class: "form-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.oldPassword]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "新密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.newPassword = $event),
              type: "password",
              placeholder: "请输入新密码",
              class: "form-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.newPassword]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "确认密码"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.confirmPassword = $event),
              type: "password",
              placeholder: "请再次输入新密码",
              class: "form-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.confirmPassword]
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "submit-section" }, [
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleChangePassword && $options.handleChangePassword(...args)),
          disabled: $data.submitting
        }, vue.toDisplayString($data.submitting ? "修改中..." : "确认修改"), 9, ["disabled"])
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesChangePasswordChangePassword = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-1cf4ae80"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/change-password/change-password.vue"]]);
  const _sfc_main$8 = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        nickname: "",
        submitting: false
      };
    },
    onLoad() {
      const currentUser = uni.getStorageSync("currentUser");
      if (currentUser && currentUser.nickname) {
        this.nickname = currentUser.nickname;
      }
    },
    methods: {
      validateNickname(name) {
        const regex = /^[a-zA-Z0-9]{2,20}$/;
        return regex.test(name);
      },
      async handleChangeNickname() {
        if (!this.nickname.trim()) {
          this.$toastInfo("请输入昵称");
          return;
        }
        if (!this.validateNickname(this.nickname)) {
          this.$toastInfo("昵称仅支持英文和数字，2-20位");
          return;
        }
        this.submitting = true;
        try {
          const res = await updateUserInfo({ nickname: this.nickname });
          if (res.code === 200) {
            const users = uni.getStorageSync("users") || [];
            const token = uni.getStorageSync("token");
            const userIndex = users.findIndex((u) => u.token === token);
            if (userIndex !== -1) {
              users[userIndex].nickname = this.nickname;
              uni.setStorageSync("users", users);
            }
            const currentUser = uni.getStorageSync("currentUser");
            if (currentUser) {
              currentUser.nickname = this.nickname;
              uni.setStorageSync("currentUser", currentUser);
            }
            this.$toastSuccess("昵称修改成功");
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            this.$toastError(res.message || "修改失败");
          }
        } catch (e) {
          this.$toastError("修改失败");
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "change-page" }, [
      vue.createElementVNode("view", { class: "form-section card" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "新昵称"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.nickname = $event),
              placeholder: "请输入新昵称",
              class: "form-input",
              maxlength: "20"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.nickname]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-tip" }, "昵称仅支持英文、数字，2-20个字符")
      ]),
      vue.createElementVNode("view", { class: "submit-section" }, [
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.handleChangeNickname && $options.handleChangeNickname(...args)),
          disabled: $data.submitting
        }, vue.toDisplayString($data.submitting ? "修改中..." : "确认修改"), 9, ["disabled"])
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesChangeNicknameChangeNickname = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-f7b0ba45"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/change-nickname/change-nickname.vue"]]);
  const _sfc_main$7 = {
    components: { Empty, Toast: __easycom_0, Modal: __easycom_1 },
    mixins: [toastMixin],
    data() {
      return {
        historyList: [],
        page: 0,
        size: 10,
        hasMore: false,
        loading: false
      };
    },
    onLoad() {
      this.loadHistory();
    },
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.loadMore();
      }
    },
    methods: {
      async loadHistory() {
        this.loading = true;
        try {
          const res = await getHistory({ page: this.page, size: this.size });
          if (res.code === 200) {
            const data = res.data || res;
            this.historyList = data.content || [];
            this.hasMore = (data.page || 0) < data.totalPages - 1;
          }
        } catch (e) {
          formatAppLog("error", "at pages/history/history.vue:87", "获取浏览历史失败", e);
        } finally {
          this.loading = false;
        }
      },
      async loadMore() {
        if (this.loading || !this.hasMore)
          return;
        this.page++;
        this.loading = true;
        try {
          const res = await getHistory({ page: this.page, size: this.size });
          if (res.code === 200) {
            const data = res.data || res;
            this.historyList = [...this.historyList, ...data.content || []];
            this.hasMore = (data.page || 0) < data.totalPages - 1;
          }
        } catch (e) {
          this.page--;
          formatAppLog("error", "at pages/history/history.vue:105", "加载更多失败", e);
        } finally {
          this.loading = false;
        }
      },
      async handleDelete(dealId) {
        const res = await this.$modal({
          title: "删除记录",
          content: "确定要删除这条浏览记录吗？"
        });
        if (res.confirm) {
          try {
            await deleteHistory(dealId);
            this.historyList = this.historyList.filter((item) => item.dealId !== dealId);
            this.$toastSuccess("已删除");
          } catch (e) {
            this.$toastError("删除失败");
          }
        }
      },
      async handleClear() {
        const res = await this.$modal({
          title: "清空历史",
          content: "确定要清空所有浏览记录吗？"
        });
        if (res.confirm) {
          try {
            await clearHistory();
            this.historyList = [];
            this.$toastSuccess("已清空");
          } catch (e) {
            this.$toastError("清空失败");
          }
        }
      },
      goDetail(dealId) {
        uni.navigateTo({ url: `/pages/detail/detail?id=${dealId}` });
      },
      formatTime(time) {
        if (!time)
          return "";
        const date = new Date(time);
        const now = /* @__PURE__ */ new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 6e4);
        const hours = Math.floor(diff / 36e5);
        const days = Math.floor(diff / 864e5);
        if (minutes < 1)
          return "刚刚";
        if (minutes < 60)
          return `${minutes}分钟前`;
        if (hours < 24)
          return `${hours}小时前`;
        if (days < 7)
          return `${days}天前`;
        return `${date.getMonth() + 1}-${date.getDate()}`;
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "history-page" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "浏览历史"),
        $data.historyList.length > 0 ? (vue.openBlock(), vue.createElementBlock("text", {
          key: 0,
          class: "clear-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClear && $options.handleClear(...args))
        }, "清空")) : vue.createCommentVNode("v-if", true)
      ]),
      $data.historyList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "history-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.historyList, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "history-item card",
              key: item.id,
              onClick: ($event) => $options.goDetail(item.dealId)
            }, [
              vue.createElementVNode("view", { class: "item-content" }, [
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "item-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "item-platform" },
                    vue.toDisplayString(item.platform),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "item-meta" }, [
                  item.profit ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "item-profit"
                    },
                    "赚 " + vue.toDisplayString(item.profit),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    { class: "item-time" },
                    vue.toDisplayString($options.formatTime(item.browseTime)),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              item.images && item.images.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "item-image"
              }, [
                vue.createElementVNode("image", {
                  src: item.images[0],
                  mode: "aspectFill",
                  "lazy-load": ""
                }, null, 8, ["src"])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("text", {
                class: "delete-btn",
                onClick: vue.withModifiers(($event) => $options.handleDelete(item.dealId), ["stop"])
              }, "删除", 8, ["onClick"])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-text" }, "暂无浏览记录"),
        vue.createElementVNode("text", { class: "empty-sub" }, "去看看有什么优惠吧")
      ])),
      $data.hasMore && $data.historyList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "load-more",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesHistoryHistory = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-b2d018fa"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/history/history.vue"]]);
  const _sfc_main$6 = {
    components: { Empty, Toast: __easycom_0, Modal: __easycom_1 },
    mixins: [toastMixin],
    data() {
      return {
        notifications: [],
        page: 0,
        size: 10,
        hasMore: false,
        loading: false
      };
    },
    computed: {
      isAdmin() {
        const userInfo = uni.getStorageSync("userInfo") || {};
        return userInfo.role === "admin" || userInfo.isAdmin === true;
      }
    },
    onLoad() {
      this.loadNotifications();
    },
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.loadMore();
      }
    },
    methods: {
      async loadNotifications() {
        this.loading = true;
        try {
          const res = await getNotifications({ page: this.page, size: this.size });
          if (res.code === 200) {
            const data = res.data || res;
            this.notifications = data.content || [];
            this.hasMore = (data.number || 0) < data.totalPages - 1;
          }
        } catch (e) {
          formatAppLog("error", "at pages/messages/messages.vue:100", "获取通知失败", e);
        } finally {
          this.loading = false;
        }
      },
      async loadMore() {
        if (this.loading || !this.hasMore)
          return;
        this.page++;
        this.loading = true;
        try {
          const res = await getNotifications({ page: this.page, size: this.size });
          if (res.code === 200) {
            const data = res.data || res;
            this.notifications = [...this.notifications, ...data.content || []];
            this.hasMore = (data.number || 0) < data.totalPages - 1;
          }
        } catch (e) {
          this.page--;
          formatAppLog("error", "at pages/messages/messages.vue:118", "加载更多失败", e);
        } finally {
          this.loading = false;
        }
      },
      async handleClick(item) {
        if (!item.isRead) {
          try {
            await markNotificationRead(item.id);
            item.isRead = true;
          } catch (e) {
            formatAppLog("error", "at pages/messages/messages.vue:129", "标记已读失败", e);
          }
        }
        if (item.dealId) {
          uni.navigateTo({ url: `/pages/detail/detail?id=${item.dealId}` });
          return;
        }
        const title = item.title || "";
        if (this.isAdmin && (title.includes("反馈") || title.includes("建议"))) {
          uni.navigateTo({ url: "/pages/feedback-manage/feedback-manage" });
          return;
        }
        item.expanded = !item.expanded;
      },
      async handleMarkAllRead() {
        const res = await this.$modal({
          title: "全部已读",
          content: "确定要将所有通知标记为已读吗？"
        });
        if (res.confirm) {
          try {
            await markAllNotificationsRead();
            this.notifications.forEach((item) => item.isRead = true);
            this.$toastSuccess("已标记全部已读");
          } catch (e) {
            this.$toastError("操作失败");
          }
        }
      },
      async handleDelete(item) {
        const res = await this.$modal({
          title: "删除通知",
          content: "确定要删除这条通知吗？"
        });
        if (res.confirm) {
          try {
            await deleteNotification(item.id);
            this.notifications = this.notifications.filter((n) => n.id !== item.id);
            this.$toastSuccess("已删除");
          } catch (e) {
            this.$toastError("删除失败");
          }
        }
      },
      goSendNotification() {
        uni.navigateTo({ url: "/pages/send-notification/send-notification" });
      },
      goFeedbackManage() {
        uni.navigateTo({ url: "/pages/feedback-manage/feedback-manage" });
      },
      getTypeIcon(type) {
        const iconMap = {
          audit_approve: "✓",
          audit_reject: "✗",
          offline: "▼"
        };
        return iconMap[type] || "•";
      },
      getTypeClass(type) {
        const classMap = {
          audit_approve: "success",
          audit_reject: "danger",
          offline: "warning"
        };
        return classMap[type] || "default";
      },
      formatTime(time) {
        if (!time)
          return "";
        const date = new Date(time);
        const now = /* @__PURE__ */ new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 6e4);
        const hours = Math.floor(diff / 36e5);
        const days = Math.floor(diff / 864e5);
        if (minutes < 1)
          return "刚刚";
        if (minutes < 60)
          return `${minutes}分钟前`;
        if (hours < 24)
          return `${hours}小时前`;
        if (days < 7)
          return `${days}天前`;
        return `${date.getMonth() + 1}-${date.getDate()}`;
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    const _component_modal = resolveEasycom(vue.resolveDynamicComponent("modal"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "messages-page" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "消息通知"),
        vue.createElementVNode("view", { class: "header-actions" }, [
          $options.isAdmin ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "send-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goSendNotification && $options.goSendNotification(...args))
          }, "发通知")) : vue.createCommentVNode("v-if", true),
          $options.isAdmin ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "feedback-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.goFeedbackManage && $options.goFeedbackManage(...args))
          }, "处理反馈")) : vue.createCommentVNode("v-if", true),
          $data.notifications.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "mark-read-btn",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleMarkAllRead && $options.handleMarkAllRead(...args))
          }, "全部已读")) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      $data.notifications.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "notification-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.notifications, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: vue.normalizeClass(["notification-item card", { unread: !item.isRead, expanded: item.expanded }]),
              key: item.id,
              onClick: ($event) => $options.handleClick(item)
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["item-icon", $options.getTypeClass(item.type)])
                },
                [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($options.getTypeIcon(item.type)),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode("view", { class: "item-content" }, [
                vue.createElementVNode("view", { class: "item-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "item-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "item-time" },
                    vue.toDisplayString($options.formatTime(item.createTime)),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["item-desc", { expanded: item.expanded }])
                  },
                  vue.toDisplayString(item.content),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              !item.isRead ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "unread-dot"
              })) : vue.createCommentVNode("v-if", true)
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-text" }, "暂无通知"),
        vue.createElementVNode("text", { class: "empty-sub" }, "审核结果和系统提醒会在这里显示")
      ])),
      $data.hasMore && $data.notifications.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "load-more",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.loadMore && $options.loadMore(...args))
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.loading ? "加载中..." : "加载更多"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_modal,
        { ref: "modal" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesMessagesMessages = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-ecc172b4"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/messages/messages.vue"]]);
  const _sfc_main$5 = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        form: {
          title: "",
          content: "",
          userId: ""
        },
        searchKeyword: "",
        searchResults: [],
        selectedUser: null,
        showDropdown: false,
        submitting: false,
        searchTimer: null
      };
    },
    methods: {
      async handleSearch() {
        if (this.searchTimer) {
          clearTimeout(this.searchTimer);
        }
        if (!this.searchKeyword.trim()) {
          this.searchResults = [];
          return;
        }
        this.searchTimer = setTimeout(async () => {
          var _a;
          try {
            const res = await searchUsers(this.searchKeyword);
            if (res.code === 200) {
              this.searchResults = ((_a = res.data) == null ? void 0 : _a.content) || res.data || [];
            }
          } catch (e) {
            formatAppLog("error", "at pages/send-notification/send-notification.vue:99", "搜索用户失败", e);
          }
        }, 300);
      },
      selectUser(user) {
        this.selectedUser = user;
        this.form.userId = user.id || user._id;
        this.searchKeyword = "";
        this.searchResults = [];
        this.showDropdown = false;
      },
      clearUser() {
        this.selectedUser = null;
        this.form.userId = "";
      },
      async handleSend() {
        if (!this.form.title.trim()) {
          this.$toastInfo("请输入标题");
          return;
        }
        if (!this.form.content.trim()) {
          this.$toastInfo("请输入内容");
          return;
        }
        this.submitting = true;
        try {
          const res = await sendNotification(this.form);
          if (res.code === 200) {
            this.$toastSuccess("发送成功");
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            this.$toastError(res.message || "发送失败");
          }
        } catch (e) {
          this.$toastError("发送失败");
        } finally {
          this.submitting = false;
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "send-page" }, [
      vue.createElementVNode("view", { class: "form-section card" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "通知标题"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.title = $event),
              placeholder: "请输入通知标题",
              class: "form-input",
              maxlength: "50"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.title]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "通知内容"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.content = $event),
              placeholder: "请输入通知内容",
              class: "form-textarea",
              maxlength: "500"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.content]
          ]),
          vue.createElementVNode(
            "text",
            { class: "char-count" },
            vue.toDisplayString($data.form.content.length) + "/500",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "form-label" }, "指定用户"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.searchKeyword = $event),
              placeholder: "搜索用户昵称，不填则发送给所有人",
              class: "form-input",
              onInput: _cache[3] || (_cache[3] = (...args) => $options.handleSearch && $options.handleSearch(...args)),
              onFocus: _cache[4] || (_cache[4] = ($event) => $data.showDropdown = true)
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKeyword]
          ]),
          $data.showDropdown && $data.searchResults.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "user-dropdown"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.searchResults, (user) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "user-item",
                  key: user.id || user._id,
                  onClick: ($event) => $options.selectUser(user)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString(user.nickname || user.username),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          $data.selectedUser ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "selected-user"
          }, [
            vue.createElementVNode(
              "text",
              null,
              "已选择: " + vue.toDisplayString($data.selectedUser.nickname || $data.selectedUser.username),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", {
              class: "clear-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.clearUser && $options.clearUser(...args))
            }, "清除")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createElementVNode("view", { class: "submit-section" }, [
        vue.createElementVNode("button", {
          class: "submit-btn",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.handleSend && $options.handleSend(...args)),
          disabled: $data.submitting
        }, vue.toDisplayString($data.submitting ? "发送中..." : "发送通知"), 9, ["disabled"])
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesSendNotificationSendNotification = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-2eac07f4"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/send-notification/send-notification.vue"]]);
  const submitFeedback = (data) => {
    return post("/feedback", data);
  };
  const getMyFeedback = (params) => {
    return get("/feedback/my", params);
  };
  const getFeedbackList = (params) => {
    return get("/admin/feedback", params);
  };
  const replyFeedback = (id, reply) => {
    return putWithQuery(`/admin/feedback/${id}/reply`, { reply });
  };
  const _sfc_main$4 = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        form: {
          type: "suggestion",
          content: "",
          contact: ""
        },
        imageList: [],
        submitting: false,
        typeOptions: [
          { label: "功能建议", value: "suggestion" },
          { label: "问题反馈", value: "bug" },
          { label: "其他", value: "other" }
        ]
      };
    },
    computed: {
      canSubmit() {
        return this.form.content.trim().length > 0;
      }
    },
    methods: {
      chooseImage() {
        uni.chooseImage({
          count: 3 - this.imageList.length,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: async (res) => {
            uni.showLoading({ title: "上传中..." });
            try {
              const uploadPromises = res.tempFilePaths.map((path) => uploadImage(path));
              const results = await Promise.all(uploadPromises);
              const imageUrls = results.map((r) => {
                if (r.code === 200 && r.data) {
                  return r.data;
                }
                return null;
              }).filter((url) => url);
              this.imageList = [...this.imageList, ...imageUrls];
            } catch (e) {
              formatAppLog("error", "at pages/feedback/feedback.vue:128", "上传失败:", e);
              this.$toastError("上传失败");
            } finally {
              uni.hideLoading();
            }
          }
        });
      },
      removeImage(index) {
        this.imageList.splice(index, 1);
      },
      async handleSubmit() {
        if (!this.canSubmit)
          return;
        const token = uni.getStorageSync("token");
        if (!token) {
          this.$toastInfo("请先登录");
          uni.navigateTo({ url: "/pages/login/login" });
          return;
        }
        this.submitting = true;
        try {
          const data = {
            ...this.form,
            images: this.imageList.join(",")
          };
          await submitFeedback(data);
          try {
            const typeMap = {
              suggestion: "功能建议",
              bug: "问题反馈",
              other: "其他"
            };
            const typeLabel = typeMap[this.form.type] || "反馈";
            await sendNotification({
              title: `收到新的${typeLabel}`,
              content: this.form.content.trim().substring(0, 100) + (this.form.content.length > 100 ? "..." : "")
            });
          } catch (e) {
            formatAppLog("error", "at pages/feedback/feedback.vue:170", "发送通知失败", e);
          }
          this.$toastSuccess("反馈提交成功");
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (e) {
          this.$toastError("提交失败，请重试");
        } finally {
          this.submitting = false;
        }
      },
      goMyFeedback() {
        uni.navigateTo({ url: "/pages/my-feedback/my-feedback" });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "feedback-page" }, [
      vue.createElementVNode("view", { class: "form-card" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "反馈类型"),
          vue.createElementVNode("view", { class: "type-options" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.typeOptions, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.value,
                  class: vue.normalizeClass(["type-item", { active: $data.form.type === item.value }]),
                  onClick: ($event) => $data.form.type = item.value
                }, vue.toDisplayString(item.label), 11, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "反馈内容"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.content = $event),
              class: "content-input",
              placeholder: "请详细描述您的问题或建议，我们会尽快处理...",
              maxlength: "500"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.content]
          ]),
          vue.createElementVNode(
            "text",
            { class: "word-count" },
            vue.toDisplayString($data.form.content.length) + "/500",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "联系方式（选填）"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.contact = $event),
              class: "contact-input",
              placeholder: "手机号或邮箱，方便我们联系您"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.contact]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "相关截图（选填）"),
          vue.createElementVNode("view", { class: "image-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.imageList, (img, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "image-item"
                }, [
                  vue.createElementVNode("image", {
                    src: img,
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("text", {
                    class: "delete-btn",
                    onClick: ($event) => $options.removeImage(index)
                  }, "×", 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $data.imageList.length < 3 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "upload-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.chooseImage && $options.chooseImage(...args))
            }, [
              vue.createElementVNode("text", { class: "plus" }, "+"),
              vue.createElementVNode("text", { class: "tip" }, "上传图片")
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("text", { class: "image-tip" }, "最多上传3张图片")
        ])
      ]),
      vue.createElementVNode("button", {
        class: vue.normalizeClass(["submit-btn", { disabled: !$options.canSubmit }]),
        disabled: !$options.canSubmit || $data.submitting,
        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
      }, vue.toDisplayString($data.submitting ? "提交中..." : "提交反馈"), 11, ["disabled"]),
      vue.createElementVNode("view", {
        class: "history-link",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.goMyFeedback && $options.goMyFeedback(...args))
      }, [
        vue.createElementVNode("text", null, "查看我的反馈记录"),
        vue.createElementVNode("text", { class: "arrow" }, "›")
      ]),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesFeedbackFeedback = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-a24b82f2"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/feedback/feedback.vue"]]);
  const _sfc_main$3 = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        feedbackList: [],
        page: 0,
        size: 10,
        hasMore: true,
        loading: false
      };
    },
    onLoad() {
      this.loadFeedback();
    },
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.loadMore();
      }
    },
    methods: {
      async loadFeedback() {
        this.loading = true;
        try {
          const res = await getMyFeedback({ page: this.page, size: this.size });
          if (res.code === 200) {
            const data = res.data || res;
            this.feedbackList = data.content || [];
            this.hasMore = (data.number || 0) < data.totalPages - 1;
          }
        } catch (e) {
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
        }
      },
      async loadMore() {
        this.page++;
        this.loading = true;
        try {
          const res = await getMyFeedback({ page: this.page, size: this.size });
          if (res.code === 200) {
            const data = res.data || res;
            this.feedbackList.push(...data.content || []);
            this.hasMore = (data.number || 0) < data.totalPages - 1;
          }
        } catch (e) {
          this.page--;
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
        }
      },
      getTypeLabel(type) {
        const map = {
          suggestion: "功能建议",
          bug: "问题反馈",
          other: "其他"
        };
        return map[type] || "其他";
      },
      formatTime(time) {
        if (!time)
          return "";
        const date = new Date(time);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      },
      viewDetail(item) {
      },
      goFeedback() {
        uni.navigateTo({ url: "/pages/feedback/feedback" });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "my-feedback-page" }, [
      $data.feedbackList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "feedback-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.feedbackList, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "feedback-item card",
              onClick: ($event) => $options.viewDetail(item)
            }, [
              vue.createElementVNode("view", { class: "item-header" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["type-tag", item.type])
                  },
                  vue.toDisplayString($options.getTypeLabel(item.type)),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["status-tag", item.status === 0 ? "pending" : "replied"])
                  },
                  vue.toDisplayString(item.status === 0 ? "待处理" : "已回复"),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "content" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              item.images ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "image-list"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(item.images.split(","), (img, index) => {
                    return vue.openBlock(), vue.createElementBlock("image", {
                      key: index,
                      src: img,
                      mode: "aspectFill",
                      class: "feedback-image",
                      "lazy-load": ""
                    }, null, 8, ["src"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              item.status === 1 && item.reply ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "reply-box"
              }, [
                vue.createElementVNode("text", { class: "reply-label" }, "官方回复："),
                vue.createElementVNode(
                  "text",
                  { class: "reply-content" },
                  vue.toDisplayString(item.reply),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "text",
                { class: "time" },
                vue.toDisplayString($options.formatTime(item.createTime)),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        !$data.hasMore && $data.feedbackList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "no-more"
        }, " 没有更多记录了 ")) : vue.createCommentVNode("v-if", true)
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-icon" }, "💬"),
        vue.createElementVNode("text", { class: "empty-text" }, "暂无反馈记录"),
        vue.createElementVNode("text", { class: "empty-sub" }, "有问题或建议？去提交反馈吧"),
        vue.createElementVNode("button", {
          class: "go-feedback-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goFeedback && $options.goFeedback(...args))
        }, "去反馈")
      ])),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesMyFeedbackMyFeedback = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-d425aefa"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/my-feedback/my-feedback.vue"]]);
  const _sfc_main$2 = {
    components: { Toast: __easycom_0 },
    mixins: [toastMixin],
    data() {
      return {
        feedbackList: [],
        page: 0,
        size: 10,
        hasMore: true,
        loading: false,
        currentStatus: null,
        statusOptions: [
          { label: "全部", value: null },
          { label: "待处理", value: 0 },
          { label: "已回复", value: 1 }
        ]
      };
    },
    onLoad() {
      this.loadFeedback();
    },
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.loadMore();
      }
    },
    methods: {
      async loadFeedback() {
        this.loading = true;
        try {
          const params = { page: this.page, size: this.size };
          if (this.currentStatus !== null) {
            params.status = this.currentStatus;
          }
          const res = await getFeedbackList(params);
          if (res.code === 200) {
            const data = res.data || res;
            this.feedbackList = (data.content || []).map((item) => ({
              ...item,
              replyText: ""
            }));
            this.hasMore = (data.number || 0) < data.totalPages - 1;
          }
        } catch (e) {
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
        }
      },
      async loadMore() {
        this.page++;
        this.loading = true;
        try {
          const params = { page: this.page, size: this.size };
          if (this.currentStatus !== null) {
            params.status = this.currentStatus;
          }
          const res = await getFeedbackList(params);
          if (res.code === 200) {
            const data = res.data || res;
            const newItems = (data.content || []).map((item) => ({
              ...item,
              replyText: ""
            }));
            this.feedbackList.push(...newItems);
            this.hasMore = (data.number || 0) < data.totalPages - 1;
          }
        } catch (e) {
          this.page--;
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
        }
      },
      changeStatus(status) {
        this.currentStatus = status;
        this.page = 0;
        this.loadFeedback();
      },
      getTypeLabel(type) {
        const map = {
          suggestion: "功能建议",
          bug: "问题反馈",
          other: "其他"
        };
        return map[type] || "其他";
      },
      formatTime(time) {
        if (!time)
          return "";
        const date = new Date(time);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      },
      previewImage(images, current) {
        uni.previewImage({
          urls: images,
          current: images[current]
        });
      },
      async handleReply(item) {
        if (!item.replyText.trim())
          return;
        item.replying = true;
        try {
          await replyFeedback(item.id, item.replyText.trim());
          try {
            const typeMap = {
              suggestion: "功能建议",
              bug: "问题反馈",
              other: "其他"
            };
            const typeLabel = typeMap[item.type] || "反馈";
            await sendNotification({
              title: `您的${typeLabel}已收到回复`,
              content: `管理员回复：${item.replyText.trim()}`,
              userId: item.userId
            });
          } catch (e) {
            formatAppLog("error", "at pages/feedback-manage/feedback-manage.vue:215", "发送通知失败", e);
          }
          item.status = 1;
          item.reply = item.replyText.trim();
          item.replyTime = (/* @__PURE__ */ new Date()).toISOString();
          this.$toastSuccess("回复成功");
        } catch (e) {
          this.$toastError("回复失败");
        } finally {
          item.replying = false;
        }
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "feedback-manage-page" }, [
      vue.createElementVNode("view", { class: "filter-bar" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.statusOptions, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.value,
              class: vue.normalizeClass(["filter-item", { active: $data.currentStatus === item.value }]),
              onClick: ($event) => $options.changeStatus(item.value)
            }, vue.toDisplayString(item.label), 11, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      $data.feedbackList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "feedback-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.feedbackList, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "feedback-item card"
            }, [
              vue.createElementVNode("view", { class: "item-header" }, [
                vue.createElementVNode("view", { class: "user-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "nickname" },
                    vue.toDisplayString(item.userNickname || "匿名用户"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["type-tag", item.type])
                    },
                    vue.toDisplayString($options.getTypeLabel(item.type)),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "time" },
                  vue.toDisplayString($options.formatTime(item.createTime)),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "content" },
                vue.toDisplayString(item.content),
                1
                /* TEXT */
              ),
              item.images ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "image-list"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(item.images.split(","), (img, index) => {
                    return vue.openBlock(), vue.createElementBlock("image", {
                      key: index,
                      src: img,
                      mode: "aspectFill",
                      class: "feedback-image",
                      "lazy-load": "",
                      onClick: ($event) => $options.previewImage(item.images.split(","), index)
                    }, null, 8, ["src", "onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              item.contact ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "contact-info"
              }, [
                vue.createElementVNode("text", { class: "contact-label" }, "联系方式："),
                vue.createElementVNode(
                  "text",
                  { class: "contact-value" },
                  vue.toDisplayString(item.contact),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              item.status === 1 && item.reply ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "reply-box"
              }, [
                vue.createElementVNode("view", { class: "reply-header" }, [
                  vue.createElementVNode("text", { class: "reply-label" }, "已回复"),
                  vue.createElementVNode(
                    "text",
                    { class: "reply-time" },
                    vue.toDisplayString($options.formatTime(item.replyTime)),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "reply-content" },
                  vue.toDisplayString(item.reply),
                  1
                  /* TEXT */
                )
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "reply-action"
              }, [
                vue.createElementVNode("view", { class: "reply-input-box" }, [
                  vue.withDirectives(vue.createElementVNode("textarea", {
                    "onUpdate:modelValue": ($event) => item.replyText = $event,
                    class: "reply-input",
                    placeholder: "请输入回复内容...",
                    maxlength: "500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vue.vModelText, item.replyText]
                  ]),
                  vue.createElementVNode("button", {
                    class: "reply-btn",
                    disabled: !item.replyText || item.replying,
                    onClick: ($event) => $options.handleReply(item)
                  }, vue.toDisplayString(item.replying ? "回复中..." : "回复"), 9, ["disabled", "onClick"])
                ])
              ]))
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        !$data.hasMore && $data.feedbackList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "no-more"
        }, " 没有更多反馈了 ")) : vue.createCommentVNode("v-if", true)
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-icon" }, "📭"),
        vue.createElementVNode("text", { class: "empty-text" }, "暂无反馈")
      ])),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesFeedbackManageFeedbackManage = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-5028b886"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/feedback-manage/feedback-manage.vue"]]);
  const _sfc_main$1 = {
    components: { Toast: __easycom_0 },
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
          { label: "全部", value: null },
          { label: "待发布", value: 0 },
          { label: "已发布", value: 1 },
          { label: "已下架", value: 2 }
        ],
        platformOptions: [
          { label: "安卓", value: "android" },
          { label: "iOS", value: "ios" }
        ],
        showModal: false,
        editingVersion: null,
        formData: {
          platform: "android",
          versionCode: "",
          versionName: "",
          updateContent: "",
          downloadUrl: "",
          forceUpdate: 0
        }
      };
    },
    onLoad() {
      this.loadVersions();
    },
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.loadMore();
      }
    },
    methods: {
      async loadVersions() {
        this.loading = true;
        this.page = 0;
        try {
          const params = {};
          if (this.currentStatus !== null) {
            params.status = this.currentStatus;
          }
          const res = await getVersionList(params);
          if (res.code === 200) {
            const data = res.data;
            if (Array.isArray(data)) {
              this.versionList = data;
            } else if (data && Array.isArray(data.content)) {
              this.versionList = data.content;
            } else {
              this.versionList = [];
            }
            this.hasMore = false;
          }
        } catch (e) {
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
        }
      },
      async loadMore() {
        if (!this.hasMore)
          return;
        this.page++;
        this.loading = true;
        try {
          const params = { page: this.page, size: this.size };
          if (this.currentStatus !== null) {
            params.status = this.currentStatus;
          }
          const res = await getVersionList(params);
          if (res.code === 200) {
            const data = res.data;
            if (data && Array.isArray(data.content)) {
              this.versionList.push(...data.content);
              this.hasMore = (data.number || 0) < data.totalPages - 1;
            } else {
              this.hasMore = false;
            }
          }
        } catch (e) {
          this.page--;
          this.$toastError("加载失败");
        } finally {
          this.loading = false;
        }
      },
      changeStatus(status) {
        this.currentStatus = status;
        this.loadVersions();
      },
      getStatusLabel(status) {
        const map = { 0: "待发布", 1: "已发布", 2: "已下架" };
        return map[status] || "未知";
      },
      formatTime(time) {
        if (!time)
          return "";
        const date = new Date(time);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      },
      copyUrl(url) {
        uni.setClipboardData({
          data: url,
          success: () => {
            this.$toastSuccess("链接已复制");
          }
        });
      },
      showAddModal() {
        this.editingVersion = null;
        this.formData = {
          platform: "android",
          versionCode: "",
          versionName: "",
          updateContent: "",
          downloadUrl: "",
          forceUpdate: 0
        };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
      async handleSubmit() {
        if (!this.formData.versionCode.trim()) {
          this.$toastInfo("请输入版本号");
          return;
        }
        if (!this.formData.versionName.trim()) {
          this.$toastInfo("请输入版本名称");
          return;
        }
        try {
          const data = {
            platform: this.formData.platform,
            versionCode: this.formData.versionCode.trim(),
            versionName: this.formData.versionName.trim(),
            updateContent: this.formData.updateContent.trim(),
            downloadUrl: this.formData.downloadUrl.trim(),
            forceUpdate: this.formData.forceUpdate
          };
          if (this.editingVersion) {
            await this.handleUpdate(data);
          } else {
            await createVersion(data);
            this.$toastSuccess("创建成功");
          }
          this.closeModal();
          this.loadVersions();
        } catch (e) {
          this.$toastError(this.editingVersion ? "保存失败" : "创建失败");
        }
      },
      async handlePublish(item) {
        try {
          await publishVersion(item.id);
          this.$toastSuccess("发布成功");
          this.loadVersions();
        } catch (e) {
          this.$toastError("发布失败");
        }
      },
      async handleUnpublish(item) {
        try {
          await unpublishVersion(item.id);
          this.$toastSuccess("下架成功");
          this.loadVersions();
        } catch (e) {
          this.$toastError("下架失败");
        }
      },
      async handleDelete(item) {
        const res = await new Promise((resolve) => {
          this.$modal({
            title: "确认删除",
            content: "确定要删除这个版本吗？",
            confirmText: "删除"
          }).then(resolve);
        });
        if (res.confirm) {
          try {
            await deleteVersion(item.id);
            this.$toastSuccess("删除成功");
            this.loadVersions();
          } catch (e) {
            this.$toastError("删除失败");
          }
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_toast = resolveEasycom(vue.resolveDynamicComponent("toast"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "version-manage-page" }, [
      vue.createElementVNode("view", { class: "filter-bar" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.statusOptions, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.value,
              class: vue.normalizeClass(["filter-item", { active: $data.currentStatus === item.value }]),
              onClick: ($event) => $options.changeStatus(item.value)
            }, vue.toDisplayString(item.label), 11, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      $data.versionList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "version-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.versionList, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "version-item card"
            }, [
              vue.createElementVNode("view", { class: "item-header" }, [
                vue.createElementVNode("view", { class: "version-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "version-name" },
                    "v" + vue.toDisplayString(item.versionName),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "version-code" },
                    vue.toDisplayString(item.versionCode),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["platform-tag", item.platform])
                    },
                    vue.toDisplayString(item.platform === "android" ? "安卓" : "iOS"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["status-tag", item.status])
                  },
                  vue.toDisplayString($options.getStatusLabel(item.status)),
                  3
                  /* TEXT, CLASS */
                )
              ]),
              vue.createElementVNode("view", { class: "update-content" }, [
                vue.createElementVNode("text", { class: "content-label" }, "更新内容："),
                vue.createElementVNode(
                  "text",
                  { class: "content-text" },
                  vue.toDisplayString(item.updateContent || "暂无描述"),
                  1
                  /* TEXT */
                )
              ]),
              item.downloadUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "download-url"
              }, [
                vue.createElementVNode("text", { class: "url-label" }, "下载地址："),
                vue.createElementVNode("text", {
                  class: "url-text",
                  onClick: ($event) => $options.copyUrl(item.downloadUrl)
                }, vue.toDisplayString(item.downloadUrl), 9, ["onClick"])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "item-footer" }, [
                vue.createElementVNode(
                  "text",
                  { class: "create-time" },
                  "创建于 " + vue.toDisplayString($options.formatTime(item.createTime)),
                  1
                  /* TEXT */
                ),
                item.publishTime ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "publish-time"
                  },
                  " 发布于 " + vue.toDisplayString($options.formatTime(item.publishTime)),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "action-bar" }, [
                item.status === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "action-btn publish",
                  onClick: ($event) => $options.handlePublish(item)
                }, " 发布 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                item.status === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "action-btn unpublish",
                  onClick: ($event) => $options.handleUnpublish(item)
                }, " 下架 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                item.status === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "action-btn delete",
                  onClick: ($event) => $options.handleDelete(item)
                }, " 删除 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        !$data.hasMore && $data.versionList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "no-more"
        }, " 没有更多版本了 ")) : vue.createCommentVNode("v-if", true)
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-icon" }, "📦"),
        vue.createElementVNode("text", { class: "empty-text" }, "暂无版本")
      ])),
      vue.createElementVNode("view", {
        class: "add-btn",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.showAddModal && $options.showAddModal(...args))
      }, [
        vue.createElementVNode("text", { class: "add-icon" }, "+")
      ]),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal",
        onClick: _cache[9] || (_cache[9] = (...args) => $options.closeModal && $options.closeModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[8] || (_cache[8] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-title" },
              vue.toDisplayString($data.editingVersion ? "编辑版本" : "创建新版本"),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", {
              class: "modal-close",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.closeModal && $options.closeModal(...args))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "平台"),
            vue.createElementVNode("view", { class: "platform-select" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.platformOptions, (p) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: p.value,
                    class: vue.normalizeClass(["platform-option", { active: $data.formData.platform === p.value }]),
                    onClick: ($event) => $data.formData.platform = p.value
                  }, vue.toDisplayString(p.label), 11, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "版本号"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.formData.versionCode = $event),
                class: "form-input",
                placeholder: "如 1.0.0"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.versionCode]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "版本名称"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.formData.versionName = $event),
                class: "form-input",
                placeholder: "如 1.0.0"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.versionName]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "更新内容"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.formData.updateContent = $event),
                class: "form-textarea",
                placeholder: "请输入更新内容...",
                maxlength: "500"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.updateContent]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "下载地址"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.formData.downloadUrl = $event),
                class: "form-input",
                placeholder: "请输入下载链接"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.formData.downloadUrl]
            ])
          ]),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "强制更新"),
            vue.createElementVNode("switch", {
              checked: $data.formData.forceUpdate === 1,
              onChange: _cache[6] || (_cache[6] = ($event) => $data.formData.forceUpdate = $data.formData.forceUpdate === 1 ? 0 : 1),
              color: "#c93a5a"
            }, null, 40, ["checked"])
          ]),
          vue.createElementVNode(
            "button",
            {
              class: "submit-btn",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
            },
            vue.toDisplayString($data.editingVersion ? "保存" : "创建"),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(
        _component_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesAdminVersionAdminVersion = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-ef837fd4"], ["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/pages/admin-version/admin-version.vue"]]);
  __definePage("pages/splash/splash", PagesSplashSplash);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/category/category", PagesCategoryCategory);
  __definePage("pages/publish/publish", PagesPublishPublish);
  __definePage("pages/mine/mine", PagesMineMine);
  __definePage("pages/detail/detail", PagesDetailDetail);
  __definePage("pages/search/search", PagesSearchSearch);
  __definePage("pages/my-deals/my-deals", PagesMyDealsMyDeals);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/edit-profile/edit-profile", PagesEditProfileEditProfile);
  __definePage("pages/audit/audit", PagesAuditAudit);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  __definePage("pages/disclaimer/disclaimer", PagesDisclaimerDisclaimer);
  __definePage("pages/agreement/agreement", PagesAgreementAgreement);
  __definePage("pages/privacy/privacy", PagesPrivacyPrivacy);
  __definePage("pages/change-password/change-password", PagesChangePasswordChangePassword);
  __definePage("pages/change-nickname/change-nickname", PagesChangeNicknameChangeNickname);
  __definePage("pages/history/history", PagesHistoryHistory);
  __definePage("pages/messages/messages", PagesMessagesMessages);
  __definePage("pages/send-notification/send-notification", PagesSendNotificationSendNotification);
  __definePage("pages/feedback/feedback", PagesFeedbackFeedback);
  __definePage("pages/my-feedback/my-feedback", PagesMyFeedbackMyFeedback);
  __definePage("pages/feedback-manage/feedback-manage", PagesFeedbackManageFeedbackManage);
  __definePage("pages/admin-version/admin-version", PagesAdminVersionAdminVersion);
  const _sfc_main = {
    onLaunch() {
      formatAppLog("log", "at App.vue:4", "App Launch");
      this.$mountToast();
    },
    onShow() {
      formatAppLog("log", "at App.vue:9", "App Show");
    },
    onHide() {
      formatAppLog("log", "at App.vue:12", "App Hide");
    },
    methods: {
      $mountToast() {
        const toastVm = {
          show: (options) => {
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            if (page && page.$refs && page.$refs.toast) {
              return page.$refs.toast.show(options);
            }
            return uni.showToast(options);
          },
          hide: () => {
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            if (page && page.$refs && page.$refs.toast) {
              page.$refs.toast.hide();
            }
          },
          success: (message, duration) => {
            return toastVm.show({ title: message, icon: "success", duration });
          },
          error: (message, duration) => {
            return toastVm.show({ title: message, icon: "error", duration });
          },
          loading: (message) => {
            return toastVm.show({ title: message, icon: "loading", duration: 0 });
          },
          info: (message, duration) => {
            return toastVm.show({ title: message, icon: "none", duration });
          }
        };
        uni.$toast = toastVm;
        this.globalData = { toast: toastVm };
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/10292/Documents/HBuilderProjects/fossicker/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
