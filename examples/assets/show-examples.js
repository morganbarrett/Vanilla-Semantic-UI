$(document).ready(function(){
  // add popup to show name
  vs('.ui').popup({
    on        : 'hover',
    variation : 'small inverted',
    exclusive : true,
    content   : $(this).attr('class')
  });
});
