jQuery ->

  $('.note').draggable()

  $('input').keyup ->
    $(this).width( (($(this).val().length) + 1) * 9 + 'px' )
  .trigger 'keyup'