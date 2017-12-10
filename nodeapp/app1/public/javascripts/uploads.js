$('#upload__input').change(function(){
  readImgUrlAndPreview(this);
  function readImgUrlAndPreview(input){
     if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = function (e) {
                  $('#imagePreview').attr('src', e.target.result);
          }
            };
            reader.readAsDataURL(input.files[0]);
       }
});


$('#upload-button').on('click', function(event) {
                    
  event.preventDefault();
  //var description = $('#msg').get(0).value;
  var ele = $(document.getElementById('msg'));
  var description = ele.get(0).value;
  
  var files = $('#upload__input').get(0).files;
  console.log(description)
  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      //formData.append('msg', description)
      formData.append('msg', description)
      formData.append('thumb', file, file.name);
      }
    console.log(formData)
    $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: '/images',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          var ajaxResult = data
          if(ajaxResult.status === "success") {
            window.location = ajaxResult.redirect;
            getUser();
          };
        }
      });
     
    }
   
});

setTimeout(getUser, 0)
    function getUser() {
      var account = sessionStorage.getItem('user')
      
      $('.head__subnav-user1')[0].innerHTML += account;
      console.log('this is session account' + account)
      }
