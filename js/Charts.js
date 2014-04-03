var StatsTableView = Backbone.View.extend({
  initialize: function(options) {
    this.template = _.template(options.template);
    this.collection.on('sync', this.render, this);
  },
  render: function() {
    this.$el.html(this.template({
      collection: this.collection
    }));
    return this;
  },
});

var DailyPopulationChartView = ChartView.extend({
  draw: function() {
    var view = this;

    // Get data
    var maxDay = this.collection.get_max("population");
    var data = this.collection.toJSON();

    // A function to set y values for bars
    var yScale = d3.scale.linear()
      .range([this.dimensions.height, 0])
      .domain([0, maxDay.get("population")])
      ;

    // A function to set x positions for bars
    var startDate = new Date(data[0].date);
    var endDate = new Date(data[this.data.length - 1].date);
    var xScale = d3.time.scale()
      .range([0, this.dimensions.width])
      .domain([startDate, endDate])
      ;

    // Create canvas
    var svg = d3.select(this.el).append("svg")
        .attr("width", this.dimensions.wrapperWidth)
        .attr("height", this.dimensions.wrapperHeight)
      .append("g")
        .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")")
        ;

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
        var date = new Date(d.date);
        return xScale(date);
      })
      .attr("y", function(d) {
        return yScale(d.population);
      })
      .attr("width", function(d) {
        return view.dimensions.width / data.length;
      })
      .attr("height", function(d) {
        return view.dimensions.height - yScale(d.population);
      })
      ;

    return this;
  },
});
