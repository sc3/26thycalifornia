var StatsTableView = ChartView.extend({
  initialize: function(options) {
    this.template = _.template(options.template);
    this.field = options.field;
    this.collection.on('sync', this.render, this);
  },
  render: function() {
    var min = this.collection.get_min(this.field);
    var max = this.collection.get_max(this.field);
    console.log(max.get("date"));
    this.$el.html(this.template({
      average: this.collection.get_average(this.field),
      min: min.get(this.field),
      min_date: min.get("date"),
      max: max.get(this.field),
      max_date: max.get("date"),
    }));
    return this;
  },
});

var DailyChartView = ChartView.extend({
  initializeVariables: function() {
    // Get start and end dates from data
    this.startDate = new Date(this.data[0].date);
    this.endDate = new Date(this.data[this.data.length - 1].date);

    // Get max and min value for selected field
    // @TODO show one line -> multiple in tutorial
    //this.minValue = this.collection.get_min(this.options.field).get(this.options.field);
    //this.maxValue = this.collection.get_max(this.options.field).get(this.options.field);

    // Calculate min and max
    this.minValue = 0;
    this.maxValue = 0;
    _.each(this.options.fields, _.bind(function(field, i) {
      var field_min = this.collection.get_min(field).get(field);
      if (field_min > this.minValue)
        this.minValue = field_min;
      var field_max = this.collection.get_max(field).get(field);
      if (field_max > this.maxValue)
        this.maxValue = field_max;
    }, this));
  },
  createScales: function() {

    // Create an x-scale using d3's time scale
    this.xScale = d3.time.scale()
      .range([0, this.dimensions.width])
      .domain([this.startDate, this.endDate]);

    // Calculate interval (for bar width)
    var range = this.xScale.range();
    this.xIntervalWidth = (range[1] - range[0]) / this.data.length

    // Provide a helper for returning a date run through xScale
    this.xValue = _.bind(function(d, i) {
      return this.xScale(new Date(d.date));
    }, this);

    // Create a y-scale using d3's linear scale
    this.yScale = d3.scale.linear()
      .range([this.dimensions.height, 0])
      .domain([this.minValue, this.maxValue])
      .nice();
  },

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
      .ticks(10)
      .tickSize(this.dimensions.wrapperWidth)
      .orient("right");
  },

  createLine: function(field) {
    return d3.svg.line()
      .x(this.xValue)
      .y(_.bind(function(d, i) {
        return this.yScale(d[field]);
      }, this));
  },

  highlightData: function(d, i) {
    d3.select(this).classed("highlight", true);
  },

  unhighlightData: function(d, i) {
    d3.select(this).classed("highlight", false);
  },

  draw: function() {
    // Set up transform for line
    var standard_transform = "translate(" + this.options.margin.left + ", " + this.options.margin.top + ")";

    // Set up canvas object to hold svg elements
    this.canvas = {};

    // Set up callbacks
    this.initializeVariables();
    this.createScales();
    this.createAxes();

    // Create an svg element to work with
    this.canvas = d3.select(this.el).append("svg")
      .attr("width", this.dimensions.wrapperWidth)
      .attr("height", this.dimensions.wrapperHeight)

    // Draw background bars
    this.canvas.Bars = this.canvas.append("g")
        .attr("transform", standard_transform)
        .attr("width", this.dimensions.width)
        .attr("class", "bars")
      .selectAll("rect")
        .data(this.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", this.xValue)
        .attr("y", 0)
        .attr("width", this.xIntervalWidth) 
        .attr("height", this.dimensions.height)
        .on("mouseover", this.highlightData)
        .on("mouseout", this.unhighlightData);

    // Draw month x-axis
    this.canvas.xAxisMonth = this.canvas.append("g")
        .attr("class", "x axis month-ticks")
        .attr("width", this.dimensions.width)
        .attr("transform", "translate(" + this.options.margin.left + ", " + (this.dimensions.height + this.options.margin.top) + ")")
        .call(this.xAxisMonth)

    // Draw day x-axis
    this.canvas.xAxisDay = this.canvas.append("g")
        .attr("class", "x axis day-ticks")
        .attr("width", this.dimensions.width)
        .attr("transform", "translate(" + this.options.margin.left + ", " + (this.dimensions.height + this.options.margin.top) + ")")
        .call(this.xAxisDay)

    // Draw y-axis
    this.canvas.yAxis = this.canvas.append("g")
        .attr("class", "y axis")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0, " + this.options.margin.top + ")")
        .attr("height", this.dimensions.height)
        .call(this.yAxis)
      .selectAll("text")
        .attr("x", 0)
        .attr("dy", -3)

    this.canvas.lines = this.canvas.append("g")
        .attr("transform", standard_transform)
        .attr("width", this.dimensions.width)
        .attr("class", "lines");

    _.each(this.options.fields, _.bind(function(field, i) {
      var line = this.createLine(field);
      this.canvas.lines.append("path")
          .datum(this.data)
          .attr("class", "line " + field)
          .attr("d", line);
    }, this));

    return this;
  },

});
