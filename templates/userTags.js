  Annotator.Plugin.UserTags = function(element, user_id) {
  var userTagsPlugin = {};
  userTagsPlugin.pluginInit = function () {
    this.annotator.subscribe("annotationsLoaded", function (annotations) {
      var allAnnoButton = document.getElementById("AllAnno");
      allAnnoButton.addEventListener('click', function() {
        for (var i = 0; i < annotations.length; i++) {
          var annotation = annotations[i];
          var highlights = annotation.highlights;
          for (var j = 0; j < highlights.length; j++) {
            highlights[j].style.backgroundColor = "rgba(255, 255, 10, 0.3)";
          }
        }
      });

      var myAnnoButton = document.getElementById("myAnno");
      myAnnoButton.addEventListener('click', function() {
        for (var i = 0; i < annotations.length; i++) {
          var annotation = annotations[i];
          var isMine = false;
          var admins = annotation.permissions.admin;
          var highlights = annotation.highlights;
          
          for (var j = 0; j < admins.length; j++) {
            if (admins[j] === user_id) {
              isMine = true;
            }
          }
          if (isMine === false) {
            for (var b = 0; b < highlights.length; b++) {
              highlights[b].style.backgroundColor = "transparent";
            }
          } else {
            for (var b = 0; b < highlights.length; b++) {
              highlights[b].style.backgroundColor = "rgba(255, 255, 10, 0.3)";
            }
          }
        }
      });
      var filterButton = document.getElementById("filterButton");
      filterButton.addEventListener('click', function() {
        var fromWhom = document.getElementById("fromWhom").value;

        for (var a = 0; a < annotations.length; a++) {
          var admins = annotations[a].permissions.admin;
          var highlights = annotations[a].highlights;
          var isFromWhom = false;
          for (var b = 0; b < admins.length; b++) {
            if (admins[b] === fromWhom) {
              isFromWhom = true;
            }
          }
          if (isFromWhom === true) {
            for (var d = 0; d < highlights.length; d++) {
              highlights[d].style.backgroundColor = "rgba(255, 255, 10, 0.3)";
            }
          } else {
            for (var d = 0; d < highlights.length; d++) {
              highlights[d].style.backgroundColor = "transparent";
            }
          }
        }
      });
    });

    this.annotator.editor.addField({
      load: function (field, annotation) {
        var html = "<br><input id='sendAnno' type='checkbox' style='margin-left:5px' onclick='showuser();'> Send annotation to someone <br><br>";
        //ajax call retrieves userids of all users
        var req = new XMLHttpRequest();
        req.open('GET', '/getallusers', false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
        var users = JSON.parse(req.responseText);

        html += "<select id='userdropdown' style='display:none'>";
        for (var i = 0; i < users.length; i++) {
          var option = "<option value=\"" + users[i] + "\">" + users[i] +"</option>";
          html += option;
        }
        html += "</select>";
        field.innerHTML= html;

      },
      submit: function (field, annotation) {
        var send = document.getElementById("sendAnno");
        if (send.checked === true) {
          var sendTo = document.getElementById("userdropdown").value;
          annotation.sendTo = sendTo;
          annotation.permissions.read.push(sendTo);
        }
        return annotation;
      }
    });
  };
  return userTagsPlugin;
};
