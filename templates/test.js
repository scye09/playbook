jQuery(function ($) {
      var annotation = $("#canAnnotate").annotator();
      var user_id = document.getElementById('user').value;
      // alert(user_id);
      // var user_id = getCurrentUser();
      populateFilterButtons();

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
            'read':   [user_id],
            'update': [user_id],
            'delete': [user_id],
            'admin':  [user_id]
          }
        });

        //////////////User Tags Plugin/////////////////////
        annotation.annotator('addPlugin', 'UserTags', user_id);

        //////////////Insert or Delete script Plugin///////////////////
        annotation.annotator('addPlugin', 'ManipulateText');

      function getCurrentUser() {
        var req = new XMLHttpRequest();
        req.open('GET', '/getcurrentuser', false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
        var user_id = JSON.parse(req.responseText);
        return user_id;
      }

      function populateFilterButtons() {
        var req = new XMLHttpRequest();
        req.open('GET', '/getallusers', false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
        var users = JSON.parse(req.responseText);

        var filterAnnos = document.getElementById("fromWhom");
        html = '<option value="Z">-select-</option>';;
        for (var i = 0; i < users.length; i++) {
          var option = "<option value=\"" + users[i] + "\">" + users[i] +"</option>";
          html += option;
        }
        filterAnnos.innerHTML= html;
      }
});
