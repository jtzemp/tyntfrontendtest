describe "VisitReport", ->
  beforeEach ->
    @visit_report = new VisitReport(2009, 10)
 
  describe "properties", ->
    it "@_chart_id is the CSS selector for the chart", ->
      expect(VisitReport._chart_id).toEqual("#chart")

    it "@_data_table_id is the CSS selector for the table to display the sites in tabular fashion", ->
      expect(VisitReport._data_table_id).toEqual("#data_table")
  
  describe "#dataUrl()", ->
    it "takes a year and a month as parameter and returns the url to grab the data from", ->
      expect(@visit_report.dataUrl()).toEqual("../data/2009-10_visits.json")

    it "for the sake of the exercise it defaults to the only data set I have (Oct, 2009)", ->
      expect(@visit_report.dataUrl()).toEqual("../data/2009-10_visits.json")

  describe "#getData()", ->
    it "gets the requested data from the VisitReport object dataUrl()", ->
      spyOn(@visit_report, 'dataUrl').andReturn("../data/2009-10_visits.json")
      @visit_report.getData()
      expect(@visit_report.dataUrl).toHaveBeenCalled()

    it "if the AJAX call to the data stream is successful, it calls #drawReport()", ->
      spyOn(@visit_report, 'drawReport')
      @visit_report.getData()
      expect(@visit_report.drawReport).toHaveBeenCalled()
