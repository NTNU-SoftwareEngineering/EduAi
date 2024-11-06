const aboutButton = document.getElementById('about');
const signInButton = document.getElementById('signIn');
const showPwdButton = document.getElementById('showPwd');
const pwdInput = document.getElementById('pwd');
const container = document.querySelector("body > div");

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