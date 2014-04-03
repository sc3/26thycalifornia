var DailyPopulationCollection = Backbone.Collection.extend({
  url: 'data/daily_population.json',

  parse: function(data) {
    // Cast all strings to numbers
    return _.map(data, function(day) {
      for (key in day)
          if (key != "date")
            day[key] = Number(day[key]);
      return day;
    });
  },

  average: function(field) {
    // Calculate average for 'field`
    var values = this.pluck(field)
    var sum = _.reduce(values, function(memo, num) { return memo + num; }, 0);
    return Math.round(sum / values.length);
  },

  get_max: function(field) {
    // Calculate max for 'field'
    return this.max(function(day) {
      return day.get(field);
    });
  },

  get_min: function(field) {
    // Calculate min for 'field'
    return this.min(function(day) {
      return day.get(field);
    });
  }
});
