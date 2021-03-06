  jQuery(function ($) {
      var annotation = $(document.body).annotator();
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
            'uri': 'http://67.207.95.7:5000/test'
          },

          // This will perform a "search" action when the plugin loads. Will
          // request the last 20 annotations for the current url.
          // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
          //loadFromSearch: {
          //  'limit': 20,
          //  'uri': 'http://67.207.95.7:5000/test'
          //},

          urls: {
               create:  '/annotations',
               update:  '/update/:id',
               destroy: '/delete/:id',
               search:  '/search'
           },
        });
  });
