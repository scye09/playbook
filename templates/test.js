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

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/accounts?where={"userid":"admin"}&projection={"roles":1}', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      var response = JSON.parse(xhr.responseText);
      var groups = response['_items'][0].roles;
      console.log(groups);

      //create 'restrict access to annotation' item and checkbox
      var options = document.createElement('li');
      options.className = 'annotator-item annotator-checkbox';
      options.innerHTML = '<input id="annotator-field-3" \
      placeholder="Restrict access to this annotation" type="checkbox" /> \
      <label for="annotator-field-3">Restrict access to this annotation</label>';


      var viewOptions = document.createElement('ul');
      viewOptions.className = 'annotator-item';
      viewOptions.innerHTML = '<id="restrict-view-access" /> \
      <label for="restrict-view-access">This annotation can be viewed by:</label>';
      viewOptions.style.display = 'none';

      for (var i = 0; i < groups.length; i++) {
        var groupOption = document.createElement('li');
        groupOption.className = 'annotator-item annotator-checkbox';
        groupOption.innerHTML = '<input id="access-group-' + i + '"' +
        'placeholder=' + groups[i] + ' type="checkbox" /> \
        <label for="access-group-' + i + '">' + groups[i] + '</label>';
        viewOptions.appendChild(groupOption);
      }

      var list = document.getElementsByClassName('annotator-listing');

        list[1].appendChild(options);
        options.appendChild(viewOptions);


      var viewCheck = document.getElementById('annotator-field-3');
      var view = document.getElementsByClassName('annotator-item')[2];
      viewCheck.addEventListener('click', function(){
        if (viewCheck.checked) {
          view.style.display = 'block';
        }
        else {
          view.style.display = 'none';
        }
      });

      var saveButton = document.getElementsByClassName("annotator-save");

      var users = [];

        // for (var m=0; m<groups.length; m++) {
          // var groupsCheck = document.getElementById('access-group-0');
          // var n = 0;
          saveButton[0].addEventListener('click', function() {
            // console.log(n);
            for (var i=0; i<groups.length; i++) {
              var groupsCheck = document.getElementById('access-group-' + i);
              var resp = new XMLHttpRequest();
              var query = '/accounts?where={"$or":['
              if (groupsCheck.checked) {
                query += '{"roles": {"$regex":"(?i).*' + groups[i] + '.*"}},'
                query = query.slice(0, -1);
                query += ']}&projection={"userid":1}';
                console.log(query);
                resp.open('GET', query, false);
                resp.setRequestHeader('Content-Type', 'application/json');
                resp.send();
                var responses = JSON.parse(resp.responseText);
                var items = responses['_items'];

                for (var k=0; k<items.length; k++) {
                    users.push(items[k].userid);
                }
                console.log(users);
              }
            }

          });

        // }

      //////////////Store Plugin/////////////////////
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



          // var saveButton = document.getElementsByClassName("annotator-save");

          // for (var i = 0; i < saveButton.length; i++) {
              //saveButton[0].addEventListener('click', function () {window.location.reload(false);});
          // }

          var req = new XMLHttpRequest();
          req.open('GET', '/getcurrentuser', false);
          req.setRequestHeader('Content-Type', 'application/json');
          req.send();
          var user_id = req.responseText;

          annotation.annotator('addPlugin', 'Permissions', {
            user: user_id,
            permissions: {
              'read':   [],
              'update': [],
              'delete': [],
              'admin':  [user_id]
            }

          });

});
