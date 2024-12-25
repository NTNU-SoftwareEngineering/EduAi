const aboutButton = document.getElementById('about');
const signInButton = document.getElementById('signIn');
const showPwdButton = document.getElementById('showPwd');
const pwdInput = document.getElementById('pwd');
const container = document.querySelector("body > div");
const signInForm = document.getElementById('signInForm');
let loginBtnCanClick = 1
// 確保表單存在
if (signInForm) {

	const token = localStorage.getItem('token');
    if ( token ) window.location.href = 'student_user_data_edu.html';
	
	// 找到登入表單內的 DOM 元素
	const usernameInput = signInForm.querySelector('input[type="email"]');  // 使用者名稱輸入框
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
		if(!loginBtnCanClick) return;
		loginBtnCanClick = 0;
		document.querySelector("#login").setAttribute("disabled" , "disabled")
		e.preventDefault();
		console.log("登入表單提交事件觸發");
		// 更新變數
		const username = usernameInput.value.trim();
		const password = passwordInput.value.trim();
		console.log("使用者名稱:", username);  // 輸出使用者名稱
		console.log("密碼:", password);  // 輸出密碼
		if (!username || !password) {
			errorDisplay.textContent = '請輸入使用者名稱和密碼';
			loginBtnCanClick = 1
			document.querySelector("#login").removeAttribute("disabled")
			return;
		}
		try {
		// 發送登入請求
		console.log("開始發送登入請求...");
		
		const response = await fetch('https://eduai-api.andy-lu.dev/moodle/login/token.php', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
			username,  // 使用者名稱
			password,  // 密碼
			service: 'software_engineering',  // API 對應的服務名稱，需確認
			}),
		});
		
		console.log("API 回應狀態:", response.status);  // 檢查 API 回應狀態碼
		const data = await response.json();
		console.log("API 回應數據:", data);  // 輸出 API 回應數據
		if (response.ok && data.token) {
			console.log("登入成功，回應包含 token");
			// 儲存 Token 到瀏覽器的 localStorage
			localStorage.setItem('token', data.token);
			courseObjList = await fetchCourses();
			// console.log(courseObjList[0])
    		courseList = courseObjList.map(c => c.id);
			course_first = courseList[0]
			// 清除錯誤訊息
			userid = await get_userid()
			role = await get_role_from_course(course_first,userid)
			console.log(`role:${role}`)
			if(role==5)
				localStorage.setItem('role', '學生');
			else localStorage.setItem('role', '老師');
			errorDisplay.textContent = '';
			alert('登入成功！');  // 彈出成功訊息
			// 重定向到主頁或其他頁面
			if(role==5)
				window.location.href = 'student_user_data_edu.html';  // 請替換為實際的頁面
			else window.location.href = 'teacher_user_data_edu.html';
		} else {
			loginBtnCanClick = 1;
			document.querySelector("#login").removeAttribute("disabled")
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
			loginBtnCanClick = 1;
			document.querySelector("#login").removeAttribute("disabled")
			console.error("捕獲到錯誤:", err);  // 打印錯誤訊息
			errorDisplay.textContent = '登入失敗，請檢查網路連接或聯繫管理員';
			alert('登入失敗，請檢查網路連接或聯繫管理員');  // 彈出失敗訊息
		}
	});
}
signInButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

aboutButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

showPwdButton.addEventListener('click', function(e){
	if(e.target.classList.contains('opened')){
		e.target.classList.remove('opened');
		e.target.classList.add('closed');
		pwdInput.setAttribute('type','text');
		showPwdButton.setAttribute('src','assets/images/login/View_alt_close.svg');
	}else{
		e.target.classList.add('opened');
		e.target.classList.remove('closed');
		pwdInput.setAttribute('type','password');
		showPwdButton.setAttribute('src','assets/images/login/View_alt_light.svg');
	}
})