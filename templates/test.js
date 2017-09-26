jQuery(function ($) {

      var annotation = $(document.body).annotator();

      //ajax call retrieves userid of current user
      var req = new XMLHttpRequest();
      req.open('GET', '/getcurrentuser', false);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send();
      var user_id = JSON.parse(req.responseText);

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

        //////////////User Tags Plugin/////////////////////
        annotation.annotator('addPlugin', 'UserTags');

        //////////////Insert or Delete script Plugin///////////////////
        annotation.annotator('addPlugin', 'ManipulateText');

        function showuser() {
          var userdropdown=document.getElementById("userdropdown");
          if (userdropdown.style.display == 'none') {
            userdropdown.style.display="inline";
          } else {
            userdropdown.style.display="none";
          }
        }
});
