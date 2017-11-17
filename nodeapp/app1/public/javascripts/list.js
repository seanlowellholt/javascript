$.ajax({
  type: 'get',
  url: '/test',
  processData: false,
  contentType: false,
  success: function(data) {
    data = JSON.parse(data);
    buildlist($('.menu'), data);
    $('.menu').menu();
  }
    })

    var str = '<ul>';

    data.forEach(function(slide) {
      str += '<li>' + slide + '</li>';
    });

    str += '</ul>';
    document.getElementById("test").innerHTML = str;


