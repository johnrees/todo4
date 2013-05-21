jQuery ->

  $('.postit').draggable
    handle: '.handle'
    stack: '.postit'

  $('input').keyup ->
    $(this).width( (($(this).val().length) + 1) * 9 + 'px' )
  .trigger 'keyup'