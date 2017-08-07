  jQuery(function ($) {

      var annotation = $(document.body).annotator();

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
               update:  '/:id',
               destroy: '/:id',
               search:  '/search'
           },
        });


        annotation.annotator('addPlugin', 'Permissions', {
          user: 'Alice',
          permissions: {
            'read': [],
            'update': [],
            'delete': [],
            'admin': ['Alice']
          }
        });

});
