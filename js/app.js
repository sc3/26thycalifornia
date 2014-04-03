$(document).ready(function() {
  var population = new DailyPopulationCollection();
  var population_table = new StatsTableView({
    el: $("#poblacion-diaria .stats"),
    collection: population,
    template: $('#population-table-template').html(),
  });
  population.fetch();
});
