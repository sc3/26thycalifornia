  $(document).ready(function() {
    var population = new DailyPopulationCollection();
    population.on("sync", function() { console.log(this.toJSON()); });
    population.fetch();
  });
