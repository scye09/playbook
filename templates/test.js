jQuery(function ($) {

      var annotation = $(document.body).annotator();

      annotation.annotator('addPlugin', 'Filter', {
        filters: [
          {
            label: 'Quote',
            property: 'quote'
          }
        ]
      });


      annotation.annotator('addPlugin', 'Tags');

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/accounts?where={"userid":"admin"}&projection={"roles":1}', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      var response = JSON.parse(xhr.responseText);
      var groups = response['_items'][0].roles;

      

      //////////////Store Plugin/////////////////////
      annotation.annotator('addPlugin', 'Store', {
          prefix: '/annotations',

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



          var saveButton = document.getElementsByClassName("annotator-save");

          for (var i = 0; i < saveButton.length; i++) {
              saveButton[0].addEventListener('click', function () {window.location.reload(false);});
          }

          var req = new XMLHttpRequest();
          req.open('GET', '/getcurrentuser', false);
          req.setRequestHeader('Content-Type', 'application/json');
          req.send();
          var user_id = req.responseText;
          console.log(user_id);

          annotation.annotator('addPlugin', 'Permissions', {
            showViewPermissionsCheckbox: false,
            showEditPermissionsCheckbox: false,
            user: user_id,
            permissions: {
              'read':   [],
              'update': [user_id],
              'delete': [user_id],
              'admin':  [user_id]
            }
          });




});
