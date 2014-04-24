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

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      ;

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(15)
        .tickSize(this.dimensions.wrapperWidth)
        .tickFormat(function(d) {
          var ticks = svg.select('g.y.axis').selectAll('g')[0],
              max_tick = d3.select(ticks[ticks.length - 1]).datum();
          if ( Number(d) >= Number(max_tick) )
            return view.formatCommas(d) + " reports";
          else
            return view.formatCommas(d);
        })
        .orient("right")
        ;

    // Create canvas
    var svg = d3.select(this.el).append("svg")
        .attr("width", this.dimensions.wrapperWidth)
        .attr("height", this.dimensions.wrapperHeight)
      .append("g")
        .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")")
        ;

    //create and set x axis position
    //svg.append("g")
        //.attr("class", "x axis")
        //.attr("transform", "translate(0," + this.dimensions.height + ")")
        //.call(xAxis)
        //;

    // create and set y axis positions
    //var gy = svg.append("g")
      //.attr("class", "y axis")
      //.attr("transform", "translate(" + parseInt(-1 * this.options.margin.left) +", 0)")
      //.attr("text-anchor", "middle")
      //.call(yAxis)
    //.selectAll("text")
      //.attr("x", 0)
      //;

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
