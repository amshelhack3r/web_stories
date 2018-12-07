const moment = require("moment");

module.exports = {
  truncate: (str, len) => {
    if (str.length > len) {
      const ending = "...";
      return str.substring(0, len) + ending;
    } else {
      return str;
    }
  },

  stripTags: input => {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },

  formatDate: (date, format) => {
    return moment(date).format(format);
  },

  editIcon: function(storyUser, loggedUser, storyId, floating = true) {
    if (storyUser == loggedUser) {
      if (floating) {
        return `<a href="${
          this.rootpath
        }/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="${
          this.rootpath
        }/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return "";
    }
  },

  rootpath: "/node_projects/dev_stories"
};
