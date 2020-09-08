$(function() {
  $('.lead').delay(2000).queue(function(){
     $(this).html("Done!");
     $('.container').remove();
  });
  setTimeout(function(){
    window.location.href = "/diagram?filename=" + getUrlParameter('filename');
  }, 3000);
});
