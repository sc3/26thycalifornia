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

  initialize_chart: function(options) {

    this.maxDay = this.collection.get_max("population");
    this.startDate = new Date(this.data[0].date);
    this.endDate = new Date(this.data[this.data.length - 1].date);
    this.canvas = {};

    //console.log(this.data[0]);
    //console.log(this.startDate);
    //var blah = d3.time.months.utc(this.startDate, this.endDate);
    //console.log(blah);
    this.createScales();
    this.createAxes();
    this.createLine();

    //ChartView.initialize_chart.apply(this, arguments);
  },

  createAxes: function() {
    this.xAxisYear = d3.svg.axis()
      .scale(this.xScale)
      .ticks(d3.time.year, 1)
      .tickSize(30)
      .orient("bottom");

    this.xAxisMonth = d3.svg.axis()
      .scale(this.xScale)
      .ticks(d3.time.month, 1)
      .tickFormat(function(d) {
        var fmt = d3.time.format("%b '%y");
        return fmt(new Date(d));
      })
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .tickSize(this.dimensions.wrapperWidth)
      .orient("right");
  },

  createScales: function() {
    this.xScale = d3.time.scale()
      .range([0, this.dimensions.width])
      .domain([this.startDate, this.endDate])
    this.yScale = d3.scale.linear()
      .range([this.dimensions.height, 0])
      .domain([0, this.maxDay.get("population") * 1.35]);
  },

  createLine: function() {
    var self = this;
    this.Line = d3.svg.line()
      .x(function(d, i) {
        return self.xScale(new Date(d.date))
      })
      .y(function(d, i) {
        return self.yScale(d.population);
      });
  },

  draw: function() {
     this.canvas.svg = d3.select(this.el).append("svg")
        .attr("width", this.dimensions.wrapperWidth)
        .attr("height", this.dimensions.wrapperHeight)
      //.append("g")
        //.attr("width", this.dimensions.width)
        //.attr("height", this.dimensions.height)
        //.attr("transform", "translate(0," + this.options.margin.top + ")")

    //create and set x axis position
    this.canvas.xaxis = this.canvas.svg.append("g")
        .attr("class", "x axis month-ticks")
        .attr("width", this.dimensions.width)
        .attr("transform", "translate(0," + this.dimensions.height + ")")
        .call(this.xAxisMonth)
      //.selectAll("text")
        //.attr("x", 3)
        //.attr("y", 6)
        //.style("text-anchor", "start");

    console.log(this);
    this.canvas.yaxis = this.canvas.svg.append("g")
      .attr("class", "y axis")
      //.attr("transform", "translate(" + this.options.margin.left + ", " + this.options.margin.top + ")")
      .attr("text-anchor", "middle")
      .call(this.yAxis)
    .selectAll("text")
      .attr("x", 0)
      .attr("dy", -3)

     this.canvas.lines = this.canvas.svg.append("g")
        .attr("transform", "translate(" + this.options.margin.left + ", " + this.options.margin.top + ")")
        .attr("width", this.dimensions.width)
        .attr("class", "lines");

     this.canvas.lines.population = this.canvas.lines.append("path")
        .datum(this.data)
        .attr("class", "line")
        .attr("d", this.Line);

    //svg.append("g")
        //.attr("class", "x axis year")
        //.attr("transform", "translate(0," + this.dimensions.height + ")")
        //.attr("transform", "translate(-" + ((Math.round(self.$el.width() / self.data.length)/2) - 1) + "," + this.dimensions.height + ")")
        //.call(this.xAxisYear)
      //.selectAll("text")
        //.style("text-anchor", "start")
        //.style("text-align", "right")
        //.attr("y", 10)
        //.attr("x", 3);



    //var self = this;
    //this.canvas.bars = this.canvas.svg.selectAll("rect")
      //.data(this.data)
      //.enter()
      //.append("rect")
      //.attr("class", "bar")
      //.attr("x", this.barX)
      //.attr("y", this.barY)
      //.attr("width", function(d) {
        //return (self.dimensions.width / (self.data.length * 2));
      //})
      //.attr("height", this.barHeight);
    return this;
  },

});
