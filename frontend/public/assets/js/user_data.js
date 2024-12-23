const identity = document.getElementById('identity');
const fullname = document.getElementById('fullName');
const id = document.getElementById('studentId');
const email = document.getElementById('email');
const password = document.getElementById('password');
const showPwdButton = document.getElementById('showPwd');
let s = location.href.split('/');
let user = s[s.length-1].split('_')[0]
const wstoken = localStorage.getItem('token')
const wsfunction='core_webservice_get_site_info'
async function getData(){
	const response = await fetch('https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?moodlewsrestformat=json', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken,  
			wsfunction  // API 對應的服務名稱，需確認
		}),
	});
	const data = await response.json()
	console.log(data)
	localStorage.setItem('userid', data.userid);
	const role = localStorage.getItem('role')
	identity.value = role;
    fullname.value = data.fullname;
    id.value = '11011111';
    email.value = data.username;
    password.value = '12345678';
}

showPwdButton.addEventListener('click', function(e){
	if(e.target.classList.contains('opened')){
		e.target.classList.remove('opened');
		e.target.classList.add('closed');
		password.setAttribute('type','text');
		showPwdButton.setAttribute('src','assets/images/user_data/View_alt_close.svg');
	}else{
		e.target.classList.add('opened');
		e.target.classList.remove('closed');
		password.setAttribute('type','password');
		showPwdButton.setAttribute('src','assets/images/user_data/View_alt_light.svg');
	}
})