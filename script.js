/**
 * iPhone SE 网络时钟应用
 * 专门为 320×568px 屏幕优化的时钟应用
 */

class WebClock {
  constructor() {
    // 应用状态
    this.wakeLock = null;
    this.settings = this.loadSettings();
    this.clockInterval = null;
    this.fallbackInterval = null;

    // DOM 元素引用
    this.elements = {};

    // 初始化应用
    this.init();
  }

  /**
   * 初始化应用
   */
  init() {
    console.log('🕐 初始化网络时钟应用...');

    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  /**
   * 应用初始化的主要方法
   */
  initializeApp() {
    this.cacheElements();
    this.setupEventListeners();
    this.applySettings();
    this.setupThemeListener();
    this.startClock();
    this.setupWakeLock();

    console.log('✅ 应用初始化完成');
  }

  /**
   * 缓存 DOM 元素引用
   */
  cacheElements() {
    this.elements = {
      timeDisplay: document.getElementById('timeDisplay'),
      dateDisplay: document.getElementById('dateDisplay'),
      fullscreenBtn: document.getElementById('fullscreenBtn'),
      settingsBtn: document.getElementById('settingsBtn'),
      settingsPanel: document.getElementById('settingsPanel'),
      settingsBackdrop: document.getElementById('settingsBackdrop'),
      showDateCheckbox: document.getElementById('showDate'),
      showSecondsCheckbox: document.getElementById('showSeconds'),
      themeSelector: document.getElementById('themeMode'),
      closeSettingsBtn: document.getElementById('closeSettings'),
    };

    // 验证所有元素是否存在
    for (const [key, element] of Object.entries(this.elements)) {
      if (!element) {
        console.error(`❌ 找不到元素: ${key}`);
      }
    }
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 全屏按钮点击
    this.elements.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

    // 设置按钮点击
    this.elements.settingsBtn?.addEventListener('click', () => this.toggleSettings(true));

    // 关闭设置按钮
    this.elements.closeSettingsBtn?.addEventListener('click', () => this.toggleSettings(false));

    // 背景遮罩点击关闭
    this.elements.settingsBackdrop?.addEventListener('click', () => this.toggleSettings(false));

    // 日期显示切换
    this.elements.showDateCheckbox?.addEventListener('change', (e) => {
      this.settings.showDate = e.target.checked;
      this.saveSettings();
      this.updateDateDisplay();
      console.log(`📅 日期显示: ${this.settings.showDate ? '开启' : '关闭'}`);
    });

    // 秒钟显示切换
    this.elements.showSecondsCheckbox?.addEventListener('change', (e) => {
      this.settings.showSeconds = e.target.checked;
      this.saveSettings();
      this.updateTime(); // 立即更新时间显示
      console.log(`⏰ 秒钟显示: ${this.settings.showSeconds ? '开启' : '关闭'}`);
    });

    // 主题模式切换
    this.elements.themeSelector?.addEventListener('change', (e) => {
      this.settings.themeMode = e.target.value;
      this.saveSettings();
      this.applyTheme();
      console.log(`🎨 主题切换为: ${e.target.value}`);
    });

    // 页面可见性变化处理
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handlePageVisible();
      } else {
        this.handlePageHidden();
      }
    });

    // 页面获得焦点时重新请求 wake lock
    window.addEventListener('focus', () => {
      console.log('🔄 页面获得焦点，重新请求 Wake Lock');
      this.setupWakeLock();
    });

    // 防止意外的触摸操作
    document.addEventListener('touchstart', (e) => {
      // 防止双指缩放
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    // 防止长按菜单
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());

    console.log('🎯 事件监听器设置完成');
  }

  /**
   * 应用设置到 UI
   */
  applySettings() {
    if (this.elements.showDateCheckbox) {
      this.elements.showDateCheckbox.checked = this.settings.showDate;
    }

    if (this.elements.showSecondsCheckbox) {
      this.elements.showSecondsCheckbox.checked = this.settings.showSeconds;
    }

    if (this.elements.themeSelector) {
      this.elements.themeSelector.value = this.settings.themeMode;
    }

    this.updateDateDisplay();
    this.applyTheme();

    console.log('⚙️ 设置已应用:', this.settings);
  }

  /**
   * 开始时钟
   */
  startClock() {
    // 立即更新一次
    this.updateTime();

    // 设置定时器，每秒更新
    this.clockInterval = setInterval(() => {
      this.updateTime();
    }, 1000);

    console.log('⏰ 时钟已启动');
  }

  /**
   * 停止时钟
   */
  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
      console.log('⏹️ 时钟已停止');
    }
  }

  /**
   * 更新时间显示
   */
  updateTime() {
    const now = new Date();

    // 24小时制时间格式，根据设置决定是否显示秒钟
    const timeOptions = {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    };

    if (this.settings.showSeconds) {
      timeOptions.second = '2-digit';
    }

    const timeString = now.toLocaleTimeString('zh-CN', timeOptions);

    // 日期格式
    const dateString = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // 更新 DOM
    if (this.elements.timeDisplay) {
      this.elements.timeDisplay.textContent = timeString;
    }

    if (this.elements.dateDisplay) {
      this.elements.dateDisplay.textContent = dateString;
    }
  }

  /**
   * 更新日期显示状态
   */
  updateDateDisplay() {
    if (!this.elements.dateDisplay) return;

    if (this.settings.showDate) {
      this.elements.dateDisplay.style.display = 'block';
      this.elements.dateDisplay.classList.remove('hidden');
    } else {
      this.elements.dateDisplay.classList.add('hidden');
      // 延迟隐藏，等待动画完成
      setTimeout(() => {
        if (!this.settings.showDate) {
          this.elements.dateDisplay.style.display = 'none';
        }
      }, 300);
    }
  }

  /**
   * 应用主题
   */
  applyTheme() {
    const body = document.body;
    let themeToApply = this.settings.themeMode;

    // 自动主题检测
    if (themeToApply === 'auto') {
      themeToApply = this.getAutoTheme();
    }

    // 应用主题
    body.setAttribute('data-theme', themeToApply);

    // 更新meta主题颜色
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = themeToApply === 'light' ? '#ffffff' : '#000000';
    }

    console.log(`🎨 主题已应用: ${themeToApply}`);
  }

  /**
   * 获取自动主题（基于系统设置和时间）
   */
  getAutoTheme() {
    // 首先检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 如果系统没有偏好设置，根据时间自动切换
    const now = new Date();
    const hour = now.getHours();

    // 白天时间：6:00 - 18:00 使用浅色主题
    // 夜晚时间：18:00 - 6:00 使用深色主题
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }

  /**
   * 设置系统主题变化监听器
   */
  setupThemeListener() {
    // 监听系统主题变化
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');

      const handleThemeChange = () => {
        if (this.settings.themeMode === 'auto') {
          this.applyTheme();
          console.log('🔄 系统主题变化，重新应用自动主题');
        }
      };

      darkModeQuery.addEventListener('change', handleThemeChange);
      lightModeQuery.addEventListener('change', handleThemeChange);
    }

    // 监听时间变化，用于基于时间的主题切换
    // 每小时检查一次是否需要切换主题
    if (this.settings.themeMode === 'auto') {
      setInterval(() => {
        this.applyTheme();
      }, 60 * 60 * 1000); // 每小时检查一次
    }
  }

  /**
   * 切换设置面板
   */
  toggleSettings(show) {
    const panel = this.elements.settingsPanel;
    const backdrop = this.elements.settingsBackdrop;

    if (!panel || !backdrop) return;

    if (show) {
      // 显示设置面板
      backdrop.classList.add('active');
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');

      // 聚焦到第一个可交互元素
      setTimeout(() => {
        const firstInput = panel.querySelector('input, button');
        firstInput?.focus();
      }, 300);

      console.log('📱 设置面板已打开');
    } else {
      // 隐藏设置面板
      backdrop.classList.remove('active');
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');

      console.log('📱 设置面板已关闭');
    }
  }

  /**
   * 切换全屏模式
   */
  async toggleFullscreen() {
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // 进入全屏
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        }
        console.log('✨ 进入全屏模式');
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
        console.log('🚪 退出全屏模式');
      }
    } catch (error) {
      console.error('❌ 全屏切换失败:', error);
    }
  }

  /**
   * 处理全屏状态变化
   */
  handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const btn = this.elements.fullscreenBtn;

    if (btn) {
      // 根据全屏状态更新按钮图标
      btn.textContent = isFullscreen ? '⛶' : '⛶';
      btn.setAttribute('aria-label', isFullscreen ? '退出全屏' : '全屏');
    }

    console.log(`🖥️ 全屏状态: ${isFullscreen ? '已开启' : '已关闭'}`);
  }

  /**
   * 设置 Wake Lock 防休眠
   */
  async setupWakeLock() {
    console.log('🔒 尝试启用 Wake Lock...');

    // 首先尝试现代 Wake Lock API
    if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');

        this.wakeLock.addEventListener('release', () => {
          console.log('🔓 Wake Lock 已释放');
        });

        console.log('✅ Wake Lock API 启用成功');
        return;
      } catch (err) {
        console.warn('⚠️ Wake Lock API 失败:', err);
      }
    }

    // 降级方案：使用 NoSleep.js 类似技术
    console.log('🔄 使用降级方案防休眠...');
    this.setupFallbackWakeLock();
  }

  /**
   * 降级防休眠方案
   */
  setupFallbackWakeLock() {
    // 创建不可见的视频元素来防止休眠
    const video = document.createElement('video');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.style.position = 'fixed';
    video.style.top = '-1px';
    video.style.left = '-1px';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0';
    video.style.pointerEvents = 'none';

    // 创建一个1秒的无声视频数据
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 1, 1);

    canvas.toBlob((blob) => {
      video.src = URL.createObjectURL(blob);
      video.loop = true;

      document.body.appendChild(video);

      // 尝试播放视频
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          console.log('📹 视频防休眠方案失败，使用定时器方案');
          document.body.removeChild(video);
          this.setupTimerWakeLock();
        });
      }
    }, 'video/webm');

    console.log('📹 视频防休眠方案已启动');
  }

  /**
   * 定时器防休眠方案（最后的降级方案）
   */
  setupTimerWakeLock() {
    // 每30秒触发一次轻微的DOM更新
    this.fallbackInterval = setInterval(() => {
      // 创建一个不可见的元素并立即移除
      const dummy = document.createElement('div');
      dummy.style.position = 'absolute';
      dummy.style.left = '-9999px';
      dummy.style.opacity = '0';
      document.body.appendChild(dummy);

      // 立即移除
      setTimeout(() => {
        if (dummy.parentNode) {
          document.body.removeChild(dummy);
        }
      }, 10);

      console.log('⏱️ 防休眠心跳');
    }, 30000);

    console.log('⏱️ 定时器防休眠方案已启动');
  }

  /**
   * 页面可见时的处理
   */
  handlePageVisible() {
    console.log('👁️ 页面可见');

    // 重新启动时钟（如果需要）
    if (!this.clockInterval) {
      this.startClock();
    }

    // 立即更新时间
    this.updateTime();

    // 重新请求 Wake Lock
    this.setupWakeLock();
  }

  /**
   * 页面隐藏时的处理
   */
  handlePageHidden() {
    console.log('🙈 页面隐藏');

    // 释放 Wake Lock
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }
  }

  /**
   * 加载设置
   */
  loadSettings() {
    const defaultSettings = {
      showDate: true,
      showSeconds: true,        // 默认显示秒钟
      themeMode: 'auto',        // 自动主题模式
      version: '1.1.0'
    };

    try {
      const saved = localStorage.getItem('webClockSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('⚠️ 加载设置失败:', error);
    }

    return defaultSettings;
  }

  /**
   * 保存设置
   */
  saveSettings() {
    try {
      localStorage.setItem('webClockSettings', JSON.stringify(this.settings));
      console.log('💾 设置已保存');
    } catch (error) {
      console.error('❌ 保存设置失败:', error);
    }
  }

  /**
   * 销毁应用（清理资源）
   */
  destroy() {
    console.log('🧹 正在清理资源...');

    // 清理定时器
    this.stopClock();

    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }

    // 释放 Wake Lock
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }

    console.log('✅ 资源清理完成');
  }
}

// 创建全局应用实例
let clockApp;

// 应用入口
document.addEventListener('DOMContentLoaded', () => {
  clockApp = new WebClock();

  // 注册 service worker 支持离线使用（可选）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Service Worker 注册失败是正常的，因为我们没有创建 sw.js 文件
    });
  }
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  if (clockApp) {
    clockApp.destroy();
  }
});

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('🚨 全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 未处理的 Promise 拒绝:', event.reason);
});

// 导出供调试使用
window.clockApp = clockApp;