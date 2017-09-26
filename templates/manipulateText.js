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
      var btn_left_class = "fa fa-arrow-circle-o-left";

      for (i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation.hidetext===true) {
          var highlights = annotation.highlights;
          var btn_id = "btn " + annotation._id;
          var btn = "<i class=\"" + btn_class + "\" id=\"" + btn_id + "\"></i>";

          var j;
          for (j = 0; j < highlights.length; j++) {
            highlights[j].style.backgroundColor = "orange";
            highlights[j].style.display="none";
            highlights[j].setAttribute('id', annotation['_id']);
            highlights[j].classList.add('hiddentext');
            $(btn).insertAfter(highlights[j]);
          }
        } else if (annotation.inserttext === true) {
          var tCtx = document.getElementById('textCanvas').getContext('2d');
          var inserted = " " + annotation.text + " ";
          tCtx.canvas.width = tCtx.measureText(inserted).width;
          // tCtx.font="13px Arial";
          tCtx.fillStyle="blue";
          tCtx.fillText(inserted, 0, 18);

          var imageSrc = tCtx.canvas.toDataURL();
          var annoImage = "<img src=" + imageSrc + " id=" + annotation._id + " class=\"insertedtext\">";

          var btn_id = "btn " + annotation._id;
          var btn = "<i class=\"" + btn_left_class + "\" id=\"" + btn_id + "\"></i>";

          var highlights = annotation.highlights;
          var j;
          for (j = 0; j < highlights.length; j++) {
            highlights[j].style.backgroundColor = "lightblue";
            $(annoImage).insertBefore(highlights[j]);
            $(btn).insertBefore(highlights[j]);
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

      var btns = document.getElementsByClassName(btn_left_class);
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

    this.annotator.subscribe("annotationEditorShown", function(editor, annotation) {
      // Warning messages will pop up if users select texts that includes whole annotations whose attributes
      // "hidden" or "inserted" are true
      var temporary = document.getElementsByClassName("annotator-hl-temporary");
      var allDeletedNodes = document.getElementsByClassName("hiddentext");
      var allInsertedNodes = document.getElementsByClassName("insertedtext");

      if (temporary.length > 0) {
        var startRange = document.createRange();
        startRange.selectNode(temporary[0]);
        var endRange = document.createRange();
        endRange.selectNode(temporary[temporary.length - 1]);
        for (var j = 0; j < allDeletedNodes.length; j++) {
          var deleteRange = document.createRange();
          deleteRange.selectNode(allDeletedNodes[j]);
          if (startRange.compareBoundaryPoints(Range.START_TO_END, deleteRange) > 0
              || endRange.compareBoundaryPoints(Range.END_TO_START, deleteRange) < 0) {
            continue;
          } else {
            alert("Error: Your selection includes deleted scripts!");
            editor.hide();
            break;
          }
        }

        for (var j = 0; j < allInsertedNodes.length; j++) {
          var insertRange = document.createRange();
          insertRange.selectNode(allInsertedNodes[j]);
          if (startRange.compareBoundaryPoints(Range.START_TO_START, insertRange) <= 0
                    && endRange.compareBoundaryPoints(Range.END_TO_END, insertRange) >= 0) {
                alert("Error: Your selection includes inserted scripts!");
                editor.hide();
                break;
            }
        }
      }


    });

    this.annotator.editor.addField({
      load: function (field, annotation) {
        var html = "<br><input id='hidetext' type='checkbox' style='margin-left:5px'> Hide Text <br><br>";
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
