jQuery(function ($) {
     var annotation = $(document.body).annotator()
                                      .annotator('setupPlugins', {}, {
                                        Auth: false,
                                        Permissions: false,
                                        Store: false
                                      });
    
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
         loadFromSearch: {
           'limit': 20,
          'uri': 'http://67.207.95.7:5000/test'
        },

         urls: {
              create:  '/store',
              update:  '/update/:id',
              destroy: '/delete/:id',
              search:  '/search'
          },
       });
 });
