$(function() {
  $("#analyze-btn").addClass('disabled');
});

Dropzone.options.MyDropzone = {
  init : function() {
    this.on("success", function(file, response) {
      $("#analyze-btn").removeClass('disabled');
      let href = $("#analyze-btn").attr('href') + '?filename=' + file.name;
      $("#analyze-btn").attr('href', href);
    });
  }
};