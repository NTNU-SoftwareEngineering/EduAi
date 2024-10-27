// 禁止用戶在電腦上縮放網站
document.addEventListener('mousewheel', function (event) {
    event = event || window.event;
  
    if ((event.wheelDelta && event.ctrlKey) || event.detail) {
      event.preventDefault();
    }
  }, { capture: false, passive: false });
  
  document.addEventListener('keydown', function (event) {
    // 檢查是否按下了 Ctrl 或 Command 鍵，以及特定的縮放快捷鍵
    if ((event.ctrlKey || event.metaKey) &&
        (event.keyCode === 61 || event.keyCode === 107 ||  // Ctrl + '+'
         event.keyCode === 173 || event.keyCode === 109 || // Ctrl + '-'
         event.keyCode === 187 || event.keyCode === 189)) { // Ctrl + '=' or '-'
      event.preventDefault();
    }
  }, false);
  