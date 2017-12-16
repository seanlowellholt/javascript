
$(document).ready(function(event) {
  $(document).on('submit', function(event) {
    event.preventDefault();
    id_username = $('#loginform__username').val()
    id_password = $('#loginform__password').val()
    console.log(id_username + id_password)

    // $.post('/login', {'username': id_username, 'password': id_password}, function(data){
    //   console.log(data)
    //   window.location = data.redirect;
    // })
  $.ajax({
    url: '/login',
    type: 'POST',
    data: {
      'username': id_username,
      'password': id_password
    },
    success: function(response){
      console.log(response)
      if(response.result == 'redirect') {
      window.location.replace(response.url)  
      var username = response.user;
      setUser(username)
        }
      }
    })
    function setUser(data) {
      sessionStorage.setItem('user', data);
    }
  })
})



// $(document).ready(function()
// {
//  $(".show__login").click(function(){
//   showpopup();
//  });
//  $("#close_login").click(function(){
//   hidepopup();
//  });
// });

// function showpopup()
// {
//  $("#loginform").fadeIn();
//  $("#loginform").css({"visibility":"visible","display":"block"});
// }

// function hidepopup()
// {
//  $("#loginform").fadeOut();
//  $("#loginform").css({"visibility":"hidden","display":"none"});
// }