
setInterval(()=>{
if(document.querySelector("#sidebar:hover")){
    document.querySelector("#sidebar").classList.add("expand");
}
else{
    document.querySelector("#sidebar").classList.remove("expand");
}
} , 10)