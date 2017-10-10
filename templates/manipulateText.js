// an annnotator plugin that adds a hide text checkbox
// if checked, "hidetext" field of the annotation will be true
// annotations with "hidetext" being true will be hidden
// use an arrow icon to show or hide annotations
Annotator.Plugin.ManipulateText = function (element) {
  var myPlugin = {};
  myPlugin.pluginInit = function () {
    this.annotator.subscribe("annotationsLoaded", function (annotations) {
      var i;
      // var btn_class = "fa fa-sub fa-arrow-circle-o-right";
      var btn_class = "fa fa-commenting-o hide";
      var btn_left_class = "fa fa-scissors insert";

      for (i = 0; i < annotations.length; i++) {
        var annotation = annotations[i];
        if (annotation.hidetext===true) {
          var highlights = annotation.highlights;
          var btn_id = "btn " + annotation._id;
          var btn = '<i title="Click to view deleted script!" class="' + btn_class + '" id="' + btn_id + '" style="font-size: 70%; position:relative; top:-0.5em"></i>';
          $(btn).insertBefore(highlights[0]);

          for(var j = 0; j < highlights.length; j++) {
            highlights[j].style.display = "none";
            highlights[j].classList.add('hiddentext');
            highlights[j].classList.add(annotation['_id']);
          }

        } else if (annotation.inserttext === true) {
          var words = annotation.text.split(" ");

          var btn_id = "btn " + annotation._id;
          var btn = '<i title="Click to hide inserted script!" class="' + btn_left_class + '" id="' + btn_id + '" " style="font-size:70%; position:relative; top:-0.5em"></i>';

          var highlights = annotation.highlights;
          $(btn).insertBefore(highlights[0]);
          for (var a = 0; a < words.length; a++) {
            var word = words[a] + " "
            var tCtx = document.getElementById('textCanvas').getContext('2d');
            var inserted = " " + annotation.text + " ";

            tCtx.font='12pt "Times New Roman"';
            tCtx.canvas.width = tCtx.measureText(word).width;
            tCtx.font='12pt "Times New Roman"';
            // tCtx.font="12pt Times New Roman";
            tCtx.fillStyle="blue";
            tCtx.fillText(word, 0, 18);

            var imageSrc = tCtx.canvas.toDataURL();
            var annoImage = "<img src=" + imageSrc + " class=\"" + annotation._id + " insertedtext\">";
            $(annoImage).insertBefore(highlights[0]);
          }
          // $(btn).insertBefore(highlights[0]);

          var j;
          for (j = 0; j < highlights.length; j++) {
            highlights[j].style.backgroundColor = "transparent";
          }
        }
      }

      var btns = document.getElementsByClassName(btn_class);

      for (i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
          var div_id = this.id.split(" ")[1];
          var related_divs = document.getElementsByClassName(div_id);
          for (var t = 0; t < related_divs.length; t++) {
            var related_div = related_divs[t];
            if (related_div.style.display === "none") {
              related_div.style.display = "inline";
              this.title="Click to hide deleted script!";
            } else {
              related_div.style.display = "none";
              this.title="Click to view deleted script!";
            }
          }

          if (this.classList.contains("fa-commenting-o")) {
            this.classList.remove("fa-commenting-o");
            this.classList.add("fa-scissors");
          } else if (this.classList.contains("fa-scissors")){
            this.classList.remove("fa-scissors");
            this.classList.add("fa-commenting-o");
          }
        });
      }

      var btns = document.getElementsByClassName(btn_left_class);
      for (i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
          var div_id = this.id.split(" ")[1];
          var related_divs = document.getElementsByClassName(div_id);
          for (var t = 0; t < related_divs.length; t++) {
            var related_div = related_divs[t];
            if (related_div.style.display === "none") {
              related_div.style.display = "inline";
              this.title="Click to hide inserted script!";
            } else {
              related_div.style.display = "none";
              this.title="Click to view inserted script!";
            }
          }

          if (this.classList.contains("fa-commenting-o")) {
            this.classList.remove("fa-commenting-o");
            this.classList.add("fa-scissors");
          } else if (this.classList.contains("fa-scissors")){
            this.classList.remove("fa-scissors");
            this.classList.add("fa-commenting-o");
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

      if (temporary.length >= 2) {
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
            break;
          }
        }

        for (var j = 0; j < allInsertedNodes.length; j++) {
          var insertRange = document.createRange();
          insertRange.selectNode(allInsertedNodes[j]);
          if (startRange.compareBoundaryPoints(Range.START_TO_START, insertRange) <= 0
                    && endRange.compareBoundaryPoints(Range.END_TO_END, insertRange) >= 0) {
                alert("Error: Your selection includes inserted scripts!");
                break;
            }
        }
      }
    });

    this.annotator.subscribe("annotationDeleted", function(annotation) {
      if (annotation.hidetext === true || annotation.inserttext === true) {
        var btn_id = "btn " + annotation._id;
        var button = document.getElementById(btn_id);
        button.parentNode.removeChild(button);
      }
      if (annotation.inserttext === true) {
        var anno_classname = annotation._id + " insertedtext";
        var anno_imgs = document.getElementsByClassName(anno_classname);
        for (var i = anno_imgs.length - 1; i >= 0; i--) {
          anno_imgs[i].parentNode.removeChild(anno_imgs[i]);
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
