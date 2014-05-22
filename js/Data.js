var DailyPopulationCollection = Backbone.Collection.extend({
  url: 'http://cookcountyjail.recoveredfactory.net/api/2.0/daily_population',

  // Parse: Cast all non-date strings to numbers
  parse: function(data) {
    return _.map(data, function(day) {
      for (key in day)
          if (key != "date")
            day[key] = Number(day[key]);
      return day;
    });
  },


  // Calculate average for 'field`
  get_average: function(field) {
    var values = this.pluck(field)
    var sum = _.reduce(values, function(memo, num) { return memo + num; }, 0);
    return Math.round(sum / values.length);
  },

  // Calculate max for 'field'
  get_max: function(field) {
    return this.max(function(day) {
      return day.get(field);
    });
  },

  // Calculate min for 'field'
  get_min: function(field) {
    return this.min(function(day) {
      return day.get(field);
    });
  },

  // Override sync to use jsonp by default
  sync: function(method, model, options) {
    var params = $.extend(true, {
      type: 'GET',
      dataType: 'jsonp',
      url: this.url,
      cache: true,
    }, options);
    return $.ajax(params);
  },

});
