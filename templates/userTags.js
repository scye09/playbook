Annotator.Plugin.UserTags = function(element) {
  var userTagsPlugin = {};
  userTagsPlugin.pluginInit = function () {

    this.annotator.editor.addField({
      load: function (field, annotation) {
        var html = "<br><input id='sendAnno' type='checkbox' style='margin-left:5px' onclick='showuser();'> Send annotation to someone <br><br>";
        //ajax call retrieves userid of current user
        var req = new XMLHttpRequest();
        req.open('GET', '/getallusers', false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();
        var users = JSON.parse(req.responseText);

        html += "<select id='userdropdown' style='display:none'>";
        for (var i = 0; i < users.length; i++) {
          var option = "<option>" + users[i] +"</option>";
          html += option;
        }
        html += "</select>";

        field.innerHTML= html;

      },
      submit: function (field, annotation) {

        return annotation;
      }
    });
  };

  return userTagsPlugin;
};