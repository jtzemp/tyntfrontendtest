class window.VisitReport
  @_chart_id = "#chart"
  @_data_table_id = "#data_table"

  constructor: (year, month)->
    @year = year || 2009
    @month = month || 10
    @chart_data = {}

  dataUrl: ->
    "../data/#{@year}-#{@month}_visits.json"

  getData: -> 
    $.get @dataUrl(),
      (data, textStatus, jqXHR) =>
        if textStatus == "success"
          @chart_data = data
          @drawReport()
      'json'

  drawReport: ->
    @drawChart()
    @drawDataTable()

  drawChart: ->
    # populate the chart with Flot

  drawDataTable: ->
    # populate the table with tablular data
