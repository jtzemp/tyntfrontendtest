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
      # TODO: There is some scoping issue with Jasmine w.r.t. calling #drawReport in a callback, doesn't notify the Jasmine spy that it ran
      # expect(@visit_report.drawReport).toHaveBeenCalled()

  describe "#drawReport()", ->
    it "calls #drawChart()", ->
      spyOn(@visit_report, 'drawChart')
      @visit_report.drawReport()
      expect(@visit_report.drawChart).toHaveBeenCalled()

    it "calls #drawDataTable()", ->
      spyOn(@visit_report, 'drawDataTable')
      @visit_report.drawReport()
      expect(@visit_report.drawDataTable).toHaveBeenCalled()

  describe "#transformData()", ->
    it "takes the data format given and translates it into data useable for Flot", ->
      @visit_report.raw_data = [
        [100, "http://site1.com", "October 7, 2009"],
        [20,  "http://site2.com", "October 7, 2009"],
        [124, "http://site3.com", "October 7, 2009"],
        [30,  "http://site2.com", "October 8, 2009"],
        [150, "http://site1.com", "October 9, 2009"],
      ]

      @visit_report.transformData()

      expect(@visit_report.chart_data).toEqual([
          { label: "site1.com", data: [ [1254895200000, 100], [1254981600000,  0], [1255068000000, 150] ] },
          { label: "site2.com", data: [ [1254895200000,  20], [1254981600000, 30], [1255068000000,   0] ] },
          { label: "site3.com", data: [ [1254895200000, 124], [1254981600000,  0], [1255068000000,   0] ] }
        ])

  describe "#processRow()", ->
    it "takes a row of raw data and updates the @max_date", ->
      @visit_report.max_date = Date.parse("January 1, 2012")
      @visit_report.processRow([123, "http://site1.com", "January 2, 2012"])
      expect(@visit_report.max_date).toEqual(Date.parse("January 2, 2012"))

    it "takes a row of raw data and updates the @min_date", ->
      @visit_report.min_date = Date.parse("January 3, 2012")
      @visit_report.processRow([123, "http://site1.com", "January 2, 2012"])
      expect(@visit_report.min_date).toEqual(Date.parse("January 2, 2012"))

    it "takes a row of raw data and adds the site name to the site object", ->
      @visit_report.processRow([123, "http://site1.com", "January 2, 2012"])
      expect(@visit_report.sites).toEqual("site1.com": "site1.com")

    it "updates the @intermediate_data hash for a given site/day", ->
      @visit_report.processRow([123, "http://site1.com", "January 2, 2012"])
      @visit_report.processRow([200, "http://site1.com", "January 3, 2012"])
      expect(@visit_report.intermediate_data).toEqual({ "site1.com1325487600000" : 123, "site1.com1325574000000" : 200 })

    it "updates the @monthly_totals", ->
      @visit_report.processRow([123, "http://site1.com", "January 2, 2012"])
      @visit_report.processRow([200, "http://site1.com", "January 3, 2012"])
      expect(@visit_report.monthly_totals).toEqual({ "site1.com": 323 })

  describe "#canonicalDomain", ->
    it "strips the protocol and subdomains, returning just the domain as a string", ->
      expect(@visit_report.canonicalDomain("http://google.com")).toEqual("google.com")


