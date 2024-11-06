const password = document.getElementById('pwd');
const confirm = document.getElementById('confirm')
const showPwdButton1 = document.getElementById('showPwd1');
const showPwdButton2 = document.getElementById('showPwd2');
const sendButton = document.getElementById('send');
const warning = document.getElementById('warning');
const modal = new bootstrap.Modal (document.getElementById('successModal'));

showPwdButton1.addEventListener('click', function(e){
	if(e.target.classList.contains('opened')){
		e.target.classList.remove('opened');
		e.target.classList.add('closed');
		password.setAttribute('type','text');
		showPwdButton1.setAttribute('src','assets/images/password/View_alt_close.svg');
	}else{
		e.target.classList.add('opened');
		e.target.classList.remove('closed');
		password.setAttribute('type','password');
		showPwdButton1.setAttribute('src','assets/images/password/View_alt_light.svg');
	}
})

showPwdButton2.addEventListener('click', function(e){
	if(e.target.classList.contains('opened')){
		e.target.classList.remove('opened');
		e.target.classList.add('closed');
		confirm.setAttribute('type','text');
		showPwdButton2.setAttribute('src','assets/images/password/View_alt_close.svg');
	}else{
		e.target.classList.add('opened');
		e.target.classList.remove('closed');
		confirm.setAttribute('type','password');
		showPwdButton2.setAttribute('src','assets/images/password/View_alt_light.svg');
	}
})

password.addEventListener('click', () => {
    warning.style.display = 'none';
})

confirm.addEventListener('click', () => {
    warning.style.display = 'none';
})

sendButton.addEventListener('click', () => {
    if(password.value != confirm.value){
        warning.innerHTML = '密碼不匹配';
        warning.style.display = 'block';
    }else if(password.value.length < 8 || !(password.value.match(/[a-zA-Z]/) && password.value.match(/[\d]/))){
        warning.innerHTML = '密碼長度需達8位以上且英數混合';
        warning.style.display = 'block';
    }else{
        warning.style.display = 'none';
        modal.toggle()
    }
})