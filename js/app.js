$(document).ready(function() {
  var population = new DailyPopulationCollection();
  population.on("sync", function() { console.log("Average:", this.average('population')); });
  population.fetch();
});
