$(document).ready(function() {
  var population = new DailyPopulationCollection();
  population.on("sync", function() {
    console.log("Average:", this.average('population'));
    console.log("Min:", this.get_min('population'));
    console.log("Max:", this.get_max('population'));
  });
  population.fetch();
});
