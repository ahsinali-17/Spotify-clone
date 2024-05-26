var a=0;
function pass(){
if(a==1){
document.getElementById("password").type='password';
document.getElementById("eye-icon").src='img/eye-slash-svgrepo-com.svg';
a=0;
}
else{
 document.getElementById("password").type='text';
 document.getElementById("eye-icon").src='img/eye-svgrepo-com (1).svg';
 a=1;
}
}


function toggle_btn(){
  const toggleBtn=document.querySelector('.toggle');
  toggleBtn.classList.toggle('active');
}