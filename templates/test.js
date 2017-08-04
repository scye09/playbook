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
               create:  '/store',
               update:  '/update/:id',
               destroy: '/delete/:id',
               search:  '/search'
           },
        });

  //       $.ajax({
  //   url: '/annotations/store',
  //   type: "POST",
  //   datatype: "json",
  //
  //   success: function(data) {
  //     var xhr = new XMLHttpRequest();
  //     var new_data = json.stringify(data);
  //     xhr.open('POST', '/annotations', true);
  //     xhr.setRequestHeader('Content-Type', 'application/json');
  //     xhr.send(new_data.toString());
  //   },
  //   error: function(XMLHttpRequest, textStatus, errorThrown) {
  //                   alert("Status: " + textStatus);
  //                   alert("Error: " + errorThrown);
  //                   console.log("annotation failed!");
  //               }
  // });

  });
