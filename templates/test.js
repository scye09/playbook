jQuery(function ($) {

      var annotation = $(document.body).annotator();

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


      // hideAnnotations();

      ////////////Filter Plugin/////////////////
      // annotation.annotator('addPlugin', 'Filter', {
      //   filters: [
      //     {
      //       label: 'Quote',
      //       property: 'quote'
      //     }
      //   ]
      // });

      /////////////Tags Plugin/////////////
      annotation.annotator('addPlugin', 'Tags');

      //ajax call retrieves all groups -- assuming 'admin' belongs to all groups
      // var xhr = new XMLHttpRequest();
      // xhr.open('GET', '/accounts?where={"userid":"admin"}&projection={"roles":1}', false);
      // xhr.setRequestHeader('Content-Type', 'application/json');
      // xhr.send();
      // var response = JSON.parse(xhr.responseText);
      // var groups = response['_items'][0].roles;
      //
      //
      // ////////////Categories Plugin///////////
      // var categories = ["admin", "superuser", "user"];
      // for (var p=0; p<groups.length; p++) {
      //   categories.push('to: ' + groups[p]);
      // }
      //categories.push('to:'); //to specify recipients by userid

      var categories = ['admin', 'superuser', 'user'];
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



        // an annnotator plugin that adds a hide text checkbox
        // if checked, "hidetext" field of the annotation will be true
        // annotations with "hidetext" being true will be hidden
        // use an arrow icon to show or hide annotations
        Annotator.Plugin.ManipulateText = function (element) {
          var myPlugin = {};
          myPlugin.pluginInit = function () {
            this.annotator.subscribe("annotationsLoaded", function (annotations) {
              var i;
              var btn_class = "fa fa-arrow-circle-o-right";
              for (i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                if (annotation["hidetext"]===true) {
                  var highlights = annotation.highlights;
                  var btn_id = "btn " + annotation['_id'];
                  var btn = "<i class=\"" + btn_class + "\" id=\"" + btn_id + "\"></i>";
                  var j;
                  for (j = 0; j < highlights.length; j++) {
                    highlights[j].style.backgroundColor = "lightblue";
                    highlights[j].style.display="none";
                    highlights[j].setAttribute('id', annotation['_id']);
                    $(btn).insertAfter(highlights[j]);
                  }
                }
              }

              var btns = document.getElementsByClassName(btn_class);
              for (i = 0; i < btns.length; i++) {
                btns[i].classList.add("rotator");
                btns[i].addEventListener("click", function() {
                  var div_id = this.id.split(" ")[1];
                  var related_div = document.getElementById(div_id);
                  if (related_div.style.display === "none") {
                    related_div.style.display = "inline";
                  } else {
                    related_div.style.display = "none";
                  }

                  if (this.classList.contains("rotator")) {
                    this.classList.remove("rotator");
                    this.classList.add("antirotator");
                  } else if (this.classList.contains("antirotator")){
                    this.classList.remove("antirotator");
                    this.classList.add("rotator");
                  }
                });
              }
            });

            this.annotator.subscribe("annotationCreated", function (annotation) {
              window.location.reload(false);
            });

            this.annotator.editor.addField({
              load: function (field, annotation) {
                var html = "<input id='hidetext' type='checkbox' style='margin-left:5px'> Hide Text <br><br>";
                // html += "<input id='inserttext' type='checkbox' style='margin-left:5px'> Insert Text <br><br>";
                field.innerHTML= html;
              },
              submit: function (field, annotation) {
                annotation.hidetext = false;
                // annotation.inserttext = false;
                var hide = document.getElementById("hidetext");
                // var insert = document.getElementById("inserttext");
                if (hide.checked === true) {
                  annotation.hidetext = true;
                }
                // if (inserttext.checked === true) {
                //   annotation.inserttext = true;
                // }
                return annotation;
              }
            });
          };
          return myPlugin;
        };
        annotation.annotator('addPlugin', 'ManipulateText');

});
