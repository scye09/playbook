  jQuery(function ($) {
      var annotation = $(document.body).annotator();

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/getcurrentuser', false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      user_id = JSON.parse(xhr.responseText);

      $.ajax({
        url: 'http://localhost:5000/getdeleteannotations',
        type: "GET",
        datatype: "json",
        success: function(data) {
          var annotations = JSON.parse(data);
          var i;
          for (i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            var paras = document.getElementsByTagName('p');
            var ranges = annotation.ranges[0];
            var startOffset = ranges.startOffset;
            var endOffset = ranges.endOffset;
            var start = ranges.start;
            start = "/" + start;
            var end = ranges.end;
            end = "/" + end;
            var d = document.createNSResolver(document.ownerDocument === null ? document.documentElement : document.ownerDocument.documentElement);
            var startNode = document.evaluate(start, document, d, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var endNode = document.evaluate(end, document, d, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            var range = document.createRange();
            range.setStart(startNode.firstChild, startOffset);
            range.setEnd(endNode.firstChild, endOffset);

            var el = document.createElement("div");
            el.innerHTML = "[DELETED]";
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
              }
            range.insertNode(frag);
          }
        }
       });

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
          user: user_id,
          permissions: {
            'read':   [],
            'update': [user_id],
            'delete': [user_id],
            'admin':  [user_id]
          }

        }
        );

        annotation.annotator('addPlugin', 'Tags');

        // var annotatorhls = document.getElementsByClassName("annotator-hl");
        // if (annotatorhls.length === 0) {
        //   alert("empty");
        // }

        // var elements = document.getElementsByTagName('span');
        // if (elements.length != 0) {
        //   alert("not empty");
        // }

});
