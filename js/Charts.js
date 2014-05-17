var StatsTableView = ChartView.extend({
  initialize: function(options) {
    this.template = _.template(options.template);
    this.collection.on('sync', this.render, this);
  },
  render: function() {
    this.$el.html(this.template({
      population_average: this.collection.get_average("population"),
      population_max: this.collection.get_max("population"),
      population_min: this.collection.get_min("population"),
      booked_average: this.collection.get_average("booked"),
      booked_max: this.collection.get_max("booked"),
      booked_min: this.collection.get_min("booked"),
      left_average: this.collection.get_average("left"),
      left_max: this.collection.get_max("left"),
      left_min: this.collection.get_min("left"),
    }));
    return this;
  },
});

var DailyPopulationChartView = ChartView.extend({

  createAxes: function() {
    this.xAxisMonth = d3.svg.axis()
      .scale(this.xScale)
      .ticks(d3.time.month, 1)
      .tickSize(7)
      .tickFormat(function(d) {
        var fmt = d3.time.format("%b '%y");
        return fmt(new Date(d));
      })
      .orient("bottom");

    this.xAxisDay = d3.svg.axis()
      .scale(this.xScale)
      .ticks(d3.time.day, 1)
      .tickSize(4)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .ticks(5)
      .tickSize(this.dimensions.wrapperWidth)
      .orient("right");
  },

  createScales: function() {

    // Get start and end dates from data
    this.startDate = new Date(this.data[0].date);
    this.endDate = new Date(this.data[this.data.length - 1].date);

    // Create an x-scale using d3's time scale
    this.xScale = d3.time.scale()
      .range([0, this.dimensions.width])
      .domain([this.startDate, this.endDate]);

    var range = this.xScale.range();
    this.xIntervalWidth = (range[1] - range[0]) / this.data.length;

    // Get max and min value for selected field
    this.minValue = this.collection.get_min("population").get("population");
    this.maxValue = this.collection.get_max("population").get("population");

    // Create a y-scale using d3's linear scale
    this.yScale = d3.scale.linear()
      .range([this.dimensions.height, 0])
      .domain([this.minValue * 0.95, this.maxValue * 1.05])
      .nice();
  },

  createLine: function() {
    self = this;
    this.Line = d3.svg.line()
      .x(function(d, i) {
        return self.xScale(new Date(d.date))
      })
      .y(function(d, i) {
        return self.yScale(d.population);
      });
  },



  highlightData: function(d, i) {
    console.log(this);
    d3.select(this).classed("highlight", true);
  },

  unhighlightData: function(d, i) {
    d3.select(this).classed("highlight", false);
  },

  draw: function() {
    var self = this;
    this.canvas = {};
    this.createScales();
    this.createAxes();
    this.createLine();

    this.canvas.svg = d3.select(this.el).append("svg")
      .attr("width", this.dimensions.wrapperWidth)
      .attr("height", this.dimensions.wrapperHeight)

    //create and set x axis position
    this.canvas.xaxisMonth = this.canvas.svg.append("g")
        .attr("class", "x axis month-ticks")
        .attr("width", this.dimensions.width)
        .attr("transform", "translate(" + this.options.margin.left + ", " + (this.dimensions.height + this.options.margin.top) + ")")
        .call(this.xAxisMonth)

    this.canvas.xaxisDay = this.canvas.svg.append("g")
        .attr("class", "x axis day-ticks")
        .attr("width", this.dimensions.width)
        .attr("transform", "translate(" + this.options.margin.left + ", " + (this.dimensions.height + this.options.margin.top) + ")")
        .call(this.xAxisDay)

    this.canvas.yaxis = this.canvas.svg.append("g")
      .attr("class", "y axis")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(0, " + this.options.margin.top + ")")
      .attr("height", this.dimensions.height)
      .call(this.yAxis)
    .selectAll("text")
      .attr("x", 0)
      .attr("dy", -3)

     this.canvas.lines = this.canvas.svg.append("g")
        .attr("transform", "translate(" + this.options.margin.left + ", " + this.options.margin.top + ")")
        .attr("width", this.dimensions.width)
        .attr("class", "lines");


    this.canvas.lines.bars = this.canvas.lines.selectAll("rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) { return self.xScale(new Date(d.date));} )
      .attr("y", 0)
      .attr("width", this.xIntervalWidth) 
      .attr("height", this.dimensions.height)
      .on("mouseover", this.highlightData)
      .on("mouseout", this.unhighlightData);

     this.canvas.lines.population = this.canvas.lines.append("path")
        .datum(this.data)
        .attr("class", "line")
        .attr("d", this.Line);

    return this;
  },

});
