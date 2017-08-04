  jQuery(function ($) {

      var annotation = $(document.body).annotator()
                                        .annotator('setupPlugins', {}, {
                                          Store: false,
                                          Auth: false,
                                        });
      /*annotation.annotator("loadAnnotations", {
      "id": "39fc339cf058bd22176771b3e3187329",
      "created": "2011-05-24T18:52:08.036814",
      "updated": "2011-05-26T12:17:05.012544",
      "text": "This is a comment",
      "quote": "Lorem",
      "ranges":
      [{
        "start": "/div[1]",
        "end": "/div[1]",
        "startOffset": 17,
        "endOffset": 22
      }]
    });*/
      annotation.annotator('addPlugin', 'Store', {
          // The endpoint of the store on your server.
          prefix: '/annotations',

          // Attach the uri of the current page to all annotations to allow search.
          annotationData: {
            'uri': window.location.href
          },

          // This will perform a "search" action when the plugin loads. Will
          // request the last 20 annotations for the current url.
          // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
          loadFromSearch: {
          //  'limit': 20,
           'uri': window.location.href
          },

          urls: {
               create:  '/',
               update:  '/update/:id',
               destroy: '/delete/:id',
               search:  '/search'
           },
        });

function get_query() {
  var xhr = new XMLHttpRequest();
  var new_url = '/annotations?where={"uri":' + '"' + originurl +'"'+ '}';
  xhr.open('GET', new_url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  return xhr.responseText;

};

});
