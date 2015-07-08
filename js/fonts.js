WebFontConfig = {
    google: { families: [ 'Trade+Winds::latin', 'Fredericka+the+Great::latin', 'Frijole::latin', 'Freckle+Face::latin', 'Slackey::latin', 'Press+Start+2P::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
