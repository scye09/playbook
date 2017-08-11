  jQuery(function ($) {
      var annotation = $(document.body).annotator();

      // callback to get curretn user id
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/getcurrentuser', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      user_id = JSON.parse(xhr.responseText);

      hideAnnotations();
      insertAnnotations();

      //  function to reload page after user clicks "save" on annotator-viewer window;
      // will reload page after creating, updating, and deleting annotations
      var annotator_save = document.getElementsByClassName("annotator-save");
      var i;
      for (i = 0; i < annotator_save.length; i++) {
        annotator_save[i].addEventListener("click", function() {
          window.location.reload();
        });
      }

      annotation.annotator('addPlugin', 'Store', {
          // The endpoint of the store on your server.
          prefix: '/annotations',

          // Attach the uri of the current page to all annotations to allow search.
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

        annotation.annotator('addPlugin', 'Permissions', {
          user: user_id,
          permissions: {
            'read':   [],
            'update': [user_id],
            'delete': [user_id],
            'admin':  [user_id]
          }

        }
        );

        // an annnotator plugin that adds a hide text checkbox
        // if checked, "hidetext" field of the annotation will be true
        Annotator.Plugin.ManipulateText = function (element) {
          var myPlugin = {};
          myPlugin.pluginInit = function () {
            // this.annotator.subscribe("annotationsLoaded", function (annotations) {
            //   hideAnnotations();
            //   insertAnnotations();
            // });

            this.annotator.editor.addField({
              load: function (field, annotation) {
                var html = "<input id='hidetext' type='checkbox' style='margin-left:5px'> Hide Text <br><br>";
                html += "<input id='inserttext' type='checkbox' style='margin-left:5px'> Insert Text <br><br>";
                field.innerHTML= html;
              },
              submit: function (field, annotation) {
                annotation.hidetext = false;
                annotation.inserttext = false;
                var hide = document.getElementById("hidetext");
                var insert = document.getElementById("inserttext");
                if (hide.checked === true) {
                  annotation.hidetext = true;
                }
                if (inserttext.checked === true) {
                  annotation.inserttext = true;
                }
                return annotation;
              }
            });
          };
          return myPlugin;
        };
        annotation.annotator('addPlugin', 'ManipulateText');

        // call back to hide annotations with "delete" tags
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
              range.surroundContents(div);
              div.style.display = "none";
              }
          }
         });
       }

       function insertAnnotations() {
         $.ajax({
           url: '/getinsertannotations',
           type: "GET",
           datatype: "json",
           success: function(data) {
             var annotations = JSON.parse(data);
             var i;
             for (i = 0; i < annotations.length; i++) {
               var annotation = annotations[i];
               var range = getRange(annotation);
               var div = document.createElement("div");
               div.innerHTML = annotation.quote + " " + annotation.text;
               range.deleteContents();
               range.surroundContents(div);
               }
           }
          });
        }

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

});
