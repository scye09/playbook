jQuery(function ($) {

      var annotation = $(document.body).annotator();

      ////////////Filter Plugin/////////////////
      annotation.annotator('addPlugin', 'Filter', {
        filters: [
          {
            label: 'Quote',
            property: 'quote'
          }
        ]
      });

      /////////////Tags Plugin/////////////
      //annotation.annotator('addPlugin', 'Tags');

      //ajax call retrieves all groups -- assuming 'admin' belongs to all groups
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/accounts?where={"userid":"admin"}&projection={"roles":1}', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      var response = JSON.parse(xhr.responseText);
      var groups = response['_items'][0].roles;


      ////////////Categories Plugin///////////
      var categories = [];
      for (var p=0; p<groups.length; p++) {
        categories.push('to: ' + groups[p]);
      }
      //categories.push('to:'); //to specify recipients by userid

      // var categories = ['admin', 'superuser', 'user'];
      annotation.annotator('addPlugin','Categories', {
        category: categories
      });


      //////////////Store Plugin/////////////////////
      annotation.annotator('addPlugin', 'Store', {
          prefix: '/annotations',

          annotationData: {
            'uri': window.location.href
          },

          loadFromSearch: {
           'uri': window.location.href
          },

          urls: {
               create:  '/',
               update:  '/:id',
               destroy: '/:id',
               search:  '/search'
           },
        });

          //reload page every time annotation is updated/saved
          var saveButton = document.getElementsByClassName("annotator-save");

          // for (var i = 0; i < saveButton.length; i++) {
              saveButton[0].addEventListener('click', function () {window.location.reload(false);});
          // }

          //ajax call retrieves userid of current user
          var req = new XMLHttpRequest();
          req.open('GET', '/getcurrentuser', false);
          req.setRequestHeader('Content-Type', 'application/json');
          req.send();
          var user_id = req.responseText;

          /////////////////Permissions Plugin//////////////////
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
