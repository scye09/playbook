jQuery(function ($) {

      var annotation = $(document.body).annotator();

      // callback to get curretn user id
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/getcurrentuser', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      user_id = JSON.parse(xhr.responseText);

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
        Annotator.Plugin.ManipulateText = function (element) {
          var myPlugin = {};
          myPlugin.pluginInit = function () {
            this.annotator.subscribe("annotationsLoaded", function (annotations) {
              hideAnnotations();
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

        // call back to hide annotations with "delete" tags
      function hideAnnotation(annotation) {
        var range = getRange(annotation);
        var div = document.createElement("div");
        range.surroundContents(div);
        div.style.display = "none";
      }

      function hideAnnotations() {
        $.ajax({
          url: '/getdeleteannotations',
          type: "GET",
          datatype: "json",
          success: function(data) {
            var annotations = JSON.parse(data);
            var i;
            for (i = 0; i < annotations.length; i++) {
              var annotation = annotations[i];
              var range = getRange(annotation);
              var div = document.createElement("div");
              div.setAttribute('id', "div " + annotation._id);
              range.surroundContents(div);
              div.style.display = "none";
              div.style.backgroundColor = "lightblue";
              var btn_class = "fa fa-arrow-circle-o-right";
              var btn = "<i class=\"" + btn_class + "\" id=" + annotation._id + "></i>";
              $(btn).insertAfter(div);
              }
              var btns = document.getElementsByClassName(btn_class);
              for (i = 0; i < btns.length; i++) {
                btns[i].classList.add("rotator");
                btns[i].addEventListener("click", function() {
                  var div_id = "div " + this.id;
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
          }
         });
       }

      //  function insertAnnotations() {
      //    $.ajax({
      //      url: '/getinsertannotations',
      //      type: "GET",
      //      datatype: "json",
      //      success: function(data) {
      //        var annotations = JSON.parse(data);
      //        var i;
      //        for (i = 0; i < annotations.length; i++) {
      //          var annotation = annotations[i];
      //          var range = getRange(annotation);
      //          range.deleteContents();
       //
      //          var el = document.createElement("div");
      //          el.innerHTML = annotation.quote + " " + annotation.text;
      //          var frag = document.createDocumentFragment(), node, lastNode;
      //          while ( (node = el.firstChild) ) {
      //            lastNode = frag.appendChild(node);
      //           }
      //          range.insertNode(frag);
      //          }
      //      }
      //     });
      //   }

       function getRange(annotation) {
         var ranges = annotation.ranges[0];
         var startOffset = ranges.startOffset;
         var endOffset = ranges.endOffset;
         var start = ranges.start;
         start = "/" + start;
         var end = ranges.end;
         end = "/" + end;
         var d = document.createNSResolver(document.ownerDocument === null ? document.documentElement : document.ownerDocument.documentElement);
         var startNode = document.evaluate(start, document, d, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
         var startTextNodes = getTextNodes(startNode);
         var len = 0;
         var j;
         for (j = 0; j < startTextNodes.length; j++) {
           if (len + startTextNodes[j].nodeValue.length >= startOffset) {
             startNode = startTextNodes[j];
             startOffset = startOffset - len;
             break;
           }
           len += startTextNodes[j].nodeValue.length;
         }

         var endNode = document.evaluate(end, document, d, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
         var endTextNodes = getTextNodes(endNode);
         len = 0;
         for (j = 0; j < endTextNodes.length; j++) {
           if (len + endTextNodes[j].nodeValue.length >= endOffset) {
             endNode = endTextNodes[j];
             endOffset = endOffset - len;
             break;
           }
           len += endTextNodes[j].nodeValue.length;
         }

         var range = document.createRange();
         range.setStart(startNode, startOffset);
         range.setEnd(endNode, endOffset);
         return range;
       }

        //  helper function to get all descendant textnodes of a node
         function getTextNodes(node) {
           var children = node.childNodes;
           var i;
           var textNodes = [];
           for (i = 0; i < children.length; i++) {
             if (children[i].nodeType === 3) {
               textNodes.push(children[i]);
             } else {
               var grandchildren = getTextNodes(children[i]);
               var j;
               for (j = 0; j < grandchildren.length; j++) {
                 textNodes.push(grandchildren[j]);
               }
             }
           }
           return textNodes;
         }

          //reload page every time annotation is updated/saved
          // var saveButton = document.getElementsByClassName("annotator-save");

          // for (var i = 0; i < saveButton.length; i++) {
              // saveButton[0].addEventListener('click', function () {window.location.reload(false);});
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
