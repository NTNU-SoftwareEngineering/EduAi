const identity = document.getElementById('identity');
const username = document.getElementById('username');
const fullname = document.getElementById('fullname');
// const id = document.getElementById('studentId');
const email = document.getElementById('email');
// const password = document.getElementById('password');
// const showPwdButton = document.getElementById('showPwd');
let s = location.href.split('/');
let user = s[s.length-1].split('_')[0]
const wstoken = localStorage.getItem('token')
const wsfunction='core_webservice_get_site_info'
async function getData(){
	await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken,  
			wsfunction  // API 對應的服務名稱，需確認
		}),
	})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);

		identity.value = localStorage.getItem('role');
		username.value = data.username;
		fullname.value = data.fullname;

		return fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				wstoken,
				wsfunction: 'core_user_get_users_by_field',
				field: 'id',
				'values[0]': data.userid
			}),
		})
	})
	.then((response) => response.json())
	.then((data) => {
		email.value = data[0].email;
	});
}

// showPwdButton.addEventListener('click', function(e){
// 	if(e.target.classList.contains('opened')){
// 		e.target.classList.remove('opened');
// 		e.target.classList.add('closed');
// 		password.setAttribute('type','text');
// 		showPwdButton.setAttribute('src','assets/images/user_data/View_alt_close.svg');
// 	}else{
// 		e.target.classList.add('opened');
// 		e.target.classList.remove('closed');
// 		password.setAttribute('type','password');
// 		showPwdButton.setAttribute('src','assets/images/user_data/View_alt_light.svg');
// 	}
// })