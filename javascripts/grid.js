(function() {

  jQuery(function() {
    $('.note').draggable();
    return $('input').keyup(function() {
      return $(this).width((($(this).val().length) + 1) * 9 + 'px');
    }).trigger('keyup');
  });

}).call(this);
