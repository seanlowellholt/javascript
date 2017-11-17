

// Click event to edit h2 content by adding contentEditable attr
// This will also show the Save | Cancel links
$(document).ready(function(event) {
  $(event.target).preventDefault

  // Add unique ID number to each 'a href' element.
  var element = $(document.querySelectorAll('a'));
    element.each(function() {
    $(this).attr('id', row_id);
  })

  // Add unique ID number to each 'section' element.
  var span = $(document.querySelectorAll('div'))
    span.each(function() {
      $(this).attr('id', row_id)
    })
  
  $('.save').hide();
  $('.cancel').hide();  

  $('.edit').on('click', editLink)
            .on('click', editContent)
  $('.cancel').on('click', cancelLink)
              .on('click', cancelText);
    
  function editLink(event) {
    event.preventDefault();
    var editId = $(this).attr('id')
    var showId = $('#'+editId).parent().nextAll('span').find('a')
    
    var id = $('#'+editId).parent().siblings('div').attr('id')
    var status = $('#'+id).attr('contentEditable')
      if(status === 'false') {
        $('#'+id).attr('contentEditable', 'true')
        $('#'+editId).hide();
        $(showId).show()
        }
  }
  
  // Focus event insert cursor in text area.
  function editContent() {
    var id = $(this).parent().siblings('div').attr('id')
    var oEditor = document.getElementById(id);
    oEditor.focus();
  } 

  // Click event to hide Save | Cancel and show Edit link
  function cancelLink(event) {
    event.preventDefault();
    var cancelId = $(this).attr('id');
    var showId = $('#'+cancelId).parent().next('span').addBack().find('a');
    var editId = $('#'+cancelId).parent().siblings('span').find('.edit').attr('id')
    var id = $('#'+cancelId).parent().siblings('div').attr('id')
    var status = $('#'+id).attr('contentEditable')
      if(status === 'true') {
        $('#'+id).attr('contentEditable', 'false')
        $('#'+editId).show();
        $(showId).hide()
      }
  }
  
  function cancelText() {
    var id = $(this).parent().siblings('div').attr('id')
    var originalText = $('#'+id).attr('value')
    $('#'+id)[0].innerHTML = ""
   }

  // Function to generate random numbers for element ID's
  function row_id() {
    var id_num = Math.random().toString(9).substr(2,3);
    var id_str = Math.random().toString(36).substr(2);
    return id_num + id_str;
  }
});