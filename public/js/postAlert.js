var loginModal = document.getElementById('loginModal')
var loginBtn3 = document.getElementById('login-button3')

if (loginBtn3) {
  loginBtn3.onclick = () => {
    loginModal.style.display = 'block'
  }
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// function myFunction () {
//     document.getElementById('myDropdown').classList.toggle('show')
// }
//
// // Close the dropdown menu if the user clicks outside of it
// window.onclick = (event) => {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName('dropdown-content')
//     var i
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i]
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show')
//       }
//     }
//   }
// }
