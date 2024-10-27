// 調試信息：檢查 JavaScript 是否已加載
console.log("JavaScript 已加載並開始執行");

// 獲取登入表單元素
const signInForm = document.getElementById('signInForm');

// 確保表單存在
if (signInForm) {
  // 找到登入表單內的 DOM 元素
  const usernameInput = signInForm.querySelector('input[type="text"]');  // 使用者名稱輸入框
  const passwordInput = signInForm.querySelector('input[type="password"]');  // 密碼輸入框

  // 創建顯示錯誤訊息的元素
  const errorDisplay = document.createElement('p');
  errorDisplay.style.color = 'red';
  errorDisplay.style.marginTop = '10px';
  signInForm.appendChild(errorDisplay);  // 將錯誤訊息元素添加到登入表單內

  // 確認 DOM 元素是否正確加載
  console.log("使用者名稱輸入框:", usernameInput);
  console.log("密碼輸入框:", passwordInput);
  console.log("錯誤訊息顯示區域已添加至登入表單");

  // 表單提交處理
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("登入表單提交事件觸發");

    // 更新變數
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("使用者名稱:", username);  // 輸出使用者名稱
    console.log("密碼:", password);  // 輸出密碼

    if (!username || !password) {
      errorDisplay.textContent = '請輸入使用者名稱和密碼';
      return;
    }

    try {
      // 發送登入請求
      console.log("開始發送登入請求...");
      const response = await fetch('http://localhost:8080/moodle/login/token.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,  // 使用者名稱
          password,  // 密碼
          service: 'moodle_mobile_app',  // API 對應的服務名稱，需確認
        }),
      });

      console.log("API 回應狀態:", response.status);  // 檢查 API 回應狀態碼
      const data = await response.json();
      console.log("API 回應數據:", data);  // 輸出 API 回應數據

      if (response.ok && data.token) {
        console.log("登入成功，回應包含 token");

        // 儲存 Token 到瀏覽器的 localStorage
        localStorage.setItem('token', data.token);

        // 清除錯誤訊息
        errorDisplay.textContent = '';
        alert('登入成功！');  // 彈出成功訊息

        // 重定向到主頁或其他頁面
        window.location.href = 'dashboard.html';  // 請替換為實際的頁面
      } else {
        console.warn("登入失敗，伺服器未返回 token");

        // 根據後端返回的錯誤訊息，顯示相應的提示
        if (data.errorcode === 'invalidlogin') {
          errorDisplay.textContent = '帳號密碼錯誤';
          alert('帳號或密碼錯誤');  // 彈出提示
        } else {
          errorDisplay.textContent = data.error || '登入失敗，請稍後重試';
          alert(data.error || '登入失敗，請稍後重試');  // 彈出提示
        }
      }
    } catch (err) {
      console.error("捕獲到錯誤:", err);  // 打印錯誤訊息
      errorDisplay.textContent = '登入失敗，請檢查網路連接或聯繫管理員';
      alert('登入失敗，請檢查網路連接或聯繫管理員');  // 彈出失敗訊息
    }
  });

  // 監聽使用者輸入的變化，清除錯誤訊息
  usernameInput.addEventListener('input', (e) => {
    console.log("使用者名稱輸入更改:", e.target.value);
    errorDisplay.textContent = '';  // 清除錯誤訊息
  });

  passwordInput.addEventListener('input', (e) => {
    console.log("密碼輸入更改:", e.target.value);
    errorDisplay.textContent = '';  // 清除錯誤訊息
  });
} else {
  console.error("找不到登入表單 signInForm");
}

// 切換面板邏輯
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.querySelector("body > div.container");

signInButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signUpButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});
