const identity = document.getElementById('identity');
const fullname = document.getElementById('fullName');
const id = document.getElementById('studentId');
const email = document.getElementById('email');
const password = document.getElementById('password');
const showPwdButton = document.getElementById('showPwd');
let s = location.href.split('/');
let user = s[s.length-1].split('_')[0]

function getData(){
	if(user === 'teacher'){
		identity.value = '教師';
	}else if(user === 'student'){
		identity.value = '學生';
	}else{
		identity.value = '未知';
	}
    fullname.value = '王小明';
    id.value = '11011111';
    email.value = 'ming111@gmail.com';
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