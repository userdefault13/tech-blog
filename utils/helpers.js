const Handlebars = require('handlebars');

module.exports = {
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`
    }
}

Handlebars.registerHelper('format_date', function(date) {
    return new Date(date).toLocaleDateString();
  });
