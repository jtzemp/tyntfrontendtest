class window.VisitReport
  @_chart_id = "#chart"
  @_data_table_id = "#data_table"
  # this really belongs somewhere else, but this is such a small project. It would get refactored into it's own home in a 'real' project.
  @_month_names = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

  constructor: (year, month)->
    @year = year || 2009
    @month = month || 10
    @intermediate_data = {}
    @chart_data = {}
    @raw_data = {}
    @max_date = null
    @min_date = null
    @sites = {}
    @monthly_totals = {} #[site] = totals
    @grand_total = 0
    @chart_options = {
      xaxis: { mode: "time" },
      legend: {
        labelFormatter: @formatLegend,
        container: "#data_table"
      }
    }

  dataUrl: ->
    "data/#{@year}-#{@month}_visits.json"

  getData: -> 
    $.get @dataUrl(),
      (data, textStatus, jqXHR) =>
        if textStatus == "success"
          @raw_data = data
          @drawReport()
      'json'

  formatLegend: (label, series) ->
    "</td><td>#{label}</td><td class=\"right\">#{vr.monthly_totals[label]}</td>"

  drawReport: ->
    # alert "drawing the report"
    @transformData()
    @drawChart()
    @renderHeader()
    @renderLegendHeader()
    @renderLegendSummary()

  drawChart: ->
    $.plot($("#chart"), @chart_data, @chart_options)

  renderHeader: ->
    report_date = new Date(@year, @month, 1)
    month_name = VisitReport._month_names[@month]
    $("h1").append("#{month_name}, #{@year}")

  renderLegendHeader: ->
    $('#legend #data_table table').prepend('<thead><tr><th></th><th></th><th>Site Root</th><th class="right">Visits</th></tr></thead>')

  renderLegendSummary: ->
    $('#legend #data_table table').prepend('<tfoot><tr><th colspan="3">Total:</th><th class="right">' + @grand_total + "</th></tr></tfoot>")

    $('h1').prepend()
  transformData: ->
    # take the data as given and transform it into a set useful for Flot
    result = []
    # loop through rows
    @processRow row for row in @raw_data

    for site, name of @sites
      series = for day in [@min_date..@max_date] by 86400000
        [day, @intermediate_data[site + day.toString()] || 0]

      result.push { label: site, data: series }
    @chart_data = result

  processRow: (row) ->
    views = row[0]
    site = @canonicalDomain row[1]
    day = Date.parse(row[2])

    @max_date = day if @max_date == null or day > @max_date
    @min_date = day if @min_date == null or day < @min_date
    @sites[site] = site unless site in @sites
    @intermediate_data[site + day.toString()] = views
    if @monthly_totals[site] then @monthly_totals[site] += views else @monthly_totals[site] = views
    @grand_total += views

  canonicalDomain: (name) ->
    if name
      match = name.match(/[A-z0-9-]+\.\w+$/)
      if match then match[0] else ""

$(document).ready ->
  window.vr = new VisitReport(2009, 10)
  vr.getData()
