// 初始化函数
function initializeExtension() {
  // 检查按钮是否已经存在
  if (document.querySelector('.readerControls_item.catalog') && ['显', '隐'].includes(document.querySelector('.readerControls_item.catalog').innerHTML)) {
    console.log('浮动按钮已存在，跳过初始化');
    return null;
  }

  // 隐藏顶部栏
  const topBar = document.querySelector('.readerTopBar');
  // 调整内容区域的上边距
  const contentArea = document.querySelector('.navBarOffset') || document.querySelector('.app_content');

  // 页面上放置一个悬浮按钮，点击后可以隐藏顶部栏和内容区域的上边距
  const readerControls = document.querySelector('.readerControls');

  if (!readerControls) {
    console.error('无法找到 .readerControls 元素');
    return null;
  }

  const floatingButton = document.createElement('button');
  floatingButton.classList.add('readerControls_item');
  floatingButton.classList.add('catalog');
  floatingButton.innerHTML = '显';  
  floatingButton.style.color = '#2A303A';
  floatingButton.style.fontSize = '18px';

  // 放置在第一个子节点
  try {
    readerControls.insertBefore(floatingButton, readerControls.firstChild);
  } catch (error) {
    console.error('无法插入按钮:', error);
    return;
  }
  
  let isTopBarVisible = true;
  floatingButton.addEventListener('click', function() {
    if (topBar) {
      topBar.style.display = isTopBarVisible ? 'none' : 'block';
    } else {
      console.warn('无法找到顶部栏元素');
    }
    
    if (contentArea) {
      contentArea.style.marginTop = isTopBarVisible ? '30px' : '60px';
    } else {
      console.warn('无法找到内容区域元素');
    }
    
    isTopBarVisible = !isTopBarVisible;
    floatingButton.innerHTML = isTopBarVisible ? '显' : '隐';
    floatingButton.style.color = isTopBarVisible ? '#2A303A' : '#9DA3AA';
  });

  console.log('浮动按钮初始化完成');
}

// 等待页面加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// 添加一个 MutationObserver 来处理动态加载的内容
function setupObserver() {
  const observer = new MutationObserver(function(mutations) {
    if (document.querySelector('.wr_avatar_img')?.src === 'https://res.mail.qq.com/node/wr/wrpage/style/images/independent/widget/common/avatar/Default.svg') {
      return;
    }
    observer.disconnect();
    initializeExtension();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    console.warn('document.body 不可用，等待后重试');
    setTimeout(setupObserver, 2000);
  }
}

setupObserver();