

$(document).ready(function(event) {
  $(event.target).preventDefault;
  var a = $(document.querySelectorAll('a'))
      a.each(function() {
      $(this).attr('id', row_id)
    })

var section = $(document.querySelectorAll('.section'))
  console.log(section)
  section.each(function() {
    $(this).attr('id', row_id );
  })

    var card = $(document.querySelectorAll('.card'))
    console.log(card)
    card.each(function() {
      $(this).attr('id', row_id );
    })

  $('.edit').on('click', editLink)
  $('.save').on('click', saveLink)
  $('.cancel').on('click', cancelLink)
              .on('click', cancelText) 
  $('.delete').on('click', deleteLink)
    
    function editLink(event) {
      event.preventDefault();
      var id = $(this).attr('id');
      console.log(id);
      var ele = $(document.getElementById(id));
      ele.closest('div').parent().siblings().find('textarea[required]').prop('readonly', false).focus();
    }

    function cancelLink(event) {
      event.preventDefault();
      var id = $(this).attr('id');
      var ele = $(document.getElementById(id))
      ele.closest('div').parent().siblings('div').find('textarea[required]').prop('readonly', true)
    }

    function cancelText(event) {
      event.preventDefault();
      var id = $(this).attr('id');
      var ele = $(document.getElementById(id));
      var baseElement = ele.closest('div').parent().siblings().find('textarea')
      var idData = baseElement.attr('id')
      $.ajax({
        type: 'GET',
        url: '/:id',
        data: {
          id: idData
        },
        dataType: 'json',
        success: function(data) {
          var descriptionData = data;
          baseElement.val(data.description)
        }
      })
    }

    function saveLink(event) {
      event.preventDefault();
      var id = $(this).attr('id');
      var ele = $(document.getElementById(id));
      var baseElement = ele.closest('div').parent().siblings().find('textarea')
      var valueData = baseElement.val();
      var idData = baseElement.attr('id')
      //console.log(valueData)
      $.ajax({
        url: "/save",
        type: 'post',
        data: {
          value: valueData,
          id: idData
        },
        success: function(err, data) {
          console.log(data)
        }
      })
    } 

    function deleteLink(event) {
      event.preventDefault();
      var id = $(this).attr('id');
      var ele = $(document.getElementById(id));
      var baseElement = ele.closest('div').parent().siblings().find('textarea')
      var fadeOut = ele.parents().find('.card').attr('id')
      var loadOut = ele.parents().find('.section').attr('id')
      var valueData = baseElement.val();
      var idData = baseElement.attr('id')
      console.log(id)
      console.log(loadOut)

      $.ajax({
        url: "/delete",
        type: 'post',
        data: {
          id: idData
        },
        
      }).done(function(){
        $('#'+fadeOut).fadeOut('slow').load(location.href + ' #'+fadeOut)
      })

    }
    
    // function getImages() {
    //   var images = new Array;
    //   var imageObj = localStorage.getItem('items');
    //   if(imageObj !== null) {
    //     images = JSON.parse(imageObj);
    //   }
    //   return images;
    //  }

    // function show(ids) {
    //    var render = getImages();
    //    for(var i = 0; i < render.length; i++) {
    //      if(ids === render[i].id) {
    //        //console.log(render[i].description);
    //      }
         
    //    }
    //  }
     
     function row_id() {
      var id_num = Math.random().toString(9).substr(2,3);
      var id_str = Math.random().toString(36).substr(2);
      return id_num + id_str;
    }


})