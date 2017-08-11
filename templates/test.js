jQuery(function ($) {

      var annotation = $(document.body).annotator();

      /////////////Tags Plugin/////////////
      annotation.annotator('addPlugin', 'Tags');

      //ajax call retrieves all groups -- assuming 'admin' belongs to all groups
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/accounts?where={"userid":"admin"}&projection={"roles":1}', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      var response = JSON.parse(xhr.responseText);
      var groups = response['_items'][0].roles;


      ////////////Lacuna Tags Categories Plugin///////////
      var categories = ['general'];
      for (var p=0; p<groups.length; p++) {
        categories.push('to: ' + groups[p]);
      }
      // categories.push('to:'); //to specify recipients by userid -- bug: because
      // max limit of categories tags is 4 (if css is not adjusted), highlightSelectedCategory
      // function does not work properly when there are over 4 categories tags

      annotation.annotator('addPlugin','Categories', {
        category: categories
      });

      //filter plugin not compatible with categories plugin
      ////////////Filter Plugin/////////////////
      annotation.annotator('addPlugin', 'Filter', {
        filters: [
          {
            label: 'User',
            property: 'user'
          },
          {
            label: 'Quote',
            property: 'quote',
            // isFiltered: function(input, quote) {
            //   console.log(quote);
            //   console.log(input);
            //   if (input && quote && quote.length) {
            //     var keywords = quote.split(/\s+/g);
            //     console.log(keywords);
            //   for (var i = 0; i < quote.length; i += 1) {
            //     for (var j = 0; j < quote.length; j += 1) {
            //       if (quote[j].indexOf(keywords[i]) !== -1) {
            //         return true;
            //         console.log('true ' + quote[j])
            //       }
            //     }
            //   }
            // }
            // return false;
            //
            // }
          },
          {
            label: 'Categories',
            property: 'category',
            isFiltered: function(input, category) {
                console.log(category);
                console.log(input);
                if (input && category && category.length) {
                  var keywords = category.split(/\s+/g);
                  console.log(keywords);
                  for (var i = 0; i < category.length; i += 1) {
                    for (var j = 0; j < category.length; j += 1) {
                      if (category[j].indexOf(keywords[i]) !== -1) {
                        return true;
                        console.log(category[j])
                      }
                    }
                  }
                }
                return false;
              }
            }
        ]
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
          //
          // // for (var i = 0; i < saveButton.length; i++) {
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
