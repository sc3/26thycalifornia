var DailyPopulationCollection = Backbone.Collection.extend({
  url: 'data/daily_population.json',
  parse: function(data) {
    // Cast all keys to numbers
    return _.map(data, function(day) {
      for (key in day)
          day[key] = Number(day[key]);
      return day;
    });
  }
});
