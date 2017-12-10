

$(document).ready(function(event) {
  $(event.target).preventDefault;
  var a = $(document.querySelectorAll('a'))
      a.each(function() {
      $(this).attr('id', row_id)
    })

  var section = $(document.querySelectorAll('.card__box'))
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
    
    function getId(idObj) {
      console.log(idObj);
      var id = $(idObj).attr('id');
      var ele = $(document.getElementById(id));
      console.log(ele)
      return ele;
    }

    function editLink(event) {
      event.preventDefault();
      var ele = getId(this)
      ele.closest('div').parent().siblings().find('textarea[required]').prop('readonly', false).focus();
    }

    function cancelLink(event) {
      event.preventDefault();
      var ele = getId(this)
      ele.closest('div').parent().siblings('div').find('textarea[required]').prop('readonly', true)
    }

    function cancelText(event) {
      event.preventDefault();
      var ele = getId(this)
      var baseElement = ele.closest('div').parent().siblings().find('textarea')
      var idData = baseElement.attr('id')
      $.get('/:id', {id: idData}, function(data) {
        console.log(data)
      })
    }

    function saveLink(event) {
      event.preventDefault();
      var ele = getId(this)
      var baseElement = ele.closest('div').parent().siblings().find('textarea')
      var valueData = baseElement.val();
      var idData = baseElement.attr('id')
      
      $.post('/save', {value: valueData, id: idData}, function(data){
        console.log(data)
      })
      // $.ajax({
      //   url: "/save",
      //   type: 'post',
      //   data: {
      //     value: valueData,
      //     id: idData
      //   },
      //   success: function(err, data) {
      //     console.log(data)
      //   }
      // })
    } 

    function deleteLink(event) {
      event.preventDefault();
      var id = $(this).attr('id');
      var ele = $(document.getElementById(id));
      var baseElement = ele.closest('div').parent().siblings().find('textarea')
      var fadeOut = ele.closest('div').parents('.card__box').attr('id')
      var loadOut = ele.closest('div').parents('.card__box').attr('id')
      var valueData = baseElement.val();
      var idData = baseElement.attr('id')
      console.log(id)
      console.log(fadeOut)

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
     
     function row_id() {
      var id_num = Math.random().toString(9).substr(2,3);
      var id_str = Math.random().toString(36).substr(2);
      return id_num + id_str;
    }
    (function() {
      var account = sessionStorage.getItem('user')
      
      $('.head__subnav-user')[0].innerHTML += account;
      console.log('this is session account' + account)
    })()
})