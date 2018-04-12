  // /////////////////////////// //
 //     Registration Modal      //
// /////////////////////////// //
// Get the modal
var loginModal = document.getElementById('loginModal')
var registerModal = document.getElementById('registerModal')

// Get the button that opens the modal
var loginBtn = document.getElementById('login-button')
var registerBtn = document.getElementById('register-button')
var loginBtn2 = document.getElementById('login-button2')

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0]
var span2 = document.getElementsByClassName('close')[1]

// When the user clicks on the button, open the modal
if (loginBtn) {
  loginBtn.onclick = () => {
    loginModal.style.display = 'block'
  }
}
registerBtn.onclick = () => {
  loginModal.style.display = 'none'
  registerModal.style.display = 'block'
}
loginBtn2.onclick = () => {
  registerModal.style.display = 'none'
  loginModal.style.display = 'block'
}
// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  loginModal.style.display = 'none'
}
span2.onclick = () => {
  registerModal.style.display = 'none'
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none'
  }
  if (event.target === registerModal) {
    registerModal.style.display = 'none'
  }
}
