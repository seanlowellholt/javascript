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
          };
        }
      });
    }
});



//$('.upload-btn').on('click', function (){
//     $('#upload-input').click();
//     $('.progress-bar').text('0%');
//     $('.progress-bar').width('0%');
// });
// //uploadBtn.addEventListener('click', function(event){
      // xhr: function() {
      //   // create an XMLHttpRequest
      //   var xhr = new XMLHttpRequest();
      //
      //   // listen to the 'progress' event
      //   xhr.upload.addEventListener('progress', function(evt) {
      //
      //     if (evt.lengthComputable) {
      //       // calculate the percentage of upload completed
      //       var percentComplete = evt.loaded / evt.total;
      //       percentComplete = parseInt(percentComplete * 100);
      //
      //       // update the Bootstrap progress bar with the new percentage
      //       $('.progress-bar').text(percentComplete + '%');
      //       $('.progress-bar').width(percentComplete + '%');
      //
      //       // once the upload reaches 100%, set the progress bar text to done
      //       if (percentComplete === 100) {
      //         $('.progress-bar').html('Done');
      //       }
      //
      //     }
      //
      //   }, false);
      //
      //   return xhr;
      // }
