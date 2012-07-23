(function() {

  describe("VisitReport", function() {
    beforeEach(function() {
      return this.visit_report = new VisitReport(2009, 10);
    });
    describe("properties", function() {
      it("@_chart_id is the CSS selector for the chart", function() {
        return expect(VisitReport._chart_id).toEqual("#chart");
      });
      return it("@_data_table_id is the CSS selector for the table to display the sites in tabular fashion", function() {
        return expect(VisitReport._data_table_id).toEqual("#data_table");
      });
    });
    describe("#dataUrl()", function() {
      it("takes a year and a month as parameter and returns the url to grab the data from", function() {
        return expect(this.visit_report.dataUrl()).toEqual("data/2009-10_visits.json");
      });
      return it("for the sake of the exercise it defaults to the only data set I have (Oct, 2009)", function() {
        return expect(this.visit_report.dataUrl()).toEqual("data/2009-10_visits.json");
      });
    });
    describe("#getData()", function() {
      it("gets the requested data from the VisitReport object dataUrl()", function() {
        spyOn(this.visit_report, 'dataUrl').andReturn("data/2009-10_visits.json");
        this.visit_report.getData();
        return expect(this.visit_report.dataUrl).toHaveBeenCalled();
      });
      return it("if the AJAX call to the data stream is successful, it calls #drawReport()", function() {
        spyOn(this.visit_report, 'drawReport');
        return this.visit_report.getData();
      });
    });
    describe("#drawReport()", function() {
      return it("calls #drawChart()", function() {
        spyOn(this.visit_report, 'drawChart');
        this.visit_report.drawReport();
        return expect(this.visit_report.drawChart).toHaveBeenCalled();
      });
    });
    describe("#transformData()", function() {
      return it("takes the data format given and translates it into data useable for Flot", function() {
        this.visit_report.raw_data = [[100, "http://site1.com", "October 7, 2009"], [20, "http://site2.com", "October 7, 2009"], [124, "http://site3.com", "October 7, 2009"], [30, "http://site2.com", "October 8, 2009"], [150, "http://site1.com", "October 9, 2009"]];
        this.visit_report.transformData();
        return expect(this.visit_report.chart_data).toEqual([
          {
            label: "site1.com",
            data: [[1254895200000, 100], [1254981600000, 0], [1255068000000, 150]]
          }, {
            label: "site2.com",
            data: [[1254895200000, 20], [1254981600000, 30], [1255068000000, 0]]
          }, {
            label: "site3.com",
            data: [[1254895200000, 124], [1254981600000, 0], [1255068000000, 0]]
          }
        ]);
      });
    });
    describe("#processRow()", function() {
      it("takes a row of raw data and updates the @max_date", function() {
        this.visit_report.max_date = Date.parse("January 1, 2012");
        this.visit_report.processRow([123, "http://site1.com", "January 2, 2012"]);
        return expect(this.visit_report.max_date).toEqual(Date.parse("January 2, 2012"));
      });
      it("takes a row of raw data and updates the @min_date", function() {
        this.visit_report.min_date = Date.parse("January 3, 2012");
        this.visit_report.processRow([123, "http://site1.com", "January 2, 2012"]);
        return expect(this.visit_report.min_date).toEqual(Date.parse("January 2, 2012"));
      });
      it("takes a row of raw data and adds the site name to the site object", function() {
        this.visit_report.processRow([123, "http://site1.com", "January 2, 2012"]);
        return expect(this.visit_report.sites).toEqual({
          "site1.com": "site1.com"
        });
      });
      it("updates the @intermediate_data hash for a given site/day", function() {
        this.visit_report.processRow([123, "http://site1.com", "January 2, 2012"]);
        this.visit_report.processRow([200, "http://site1.com", "January 3, 2012"]);
        return expect(this.visit_report.intermediate_data).toEqual({
          "site1.com1325487600000": 123,
          "site1.com1325574000000": 200
        });
      });
      return it("updates the @monthly_totals", function() {
        this.visit_report.processRow([123, "http://site1.com", "January 2, 2012"]);
        this.visit_report.processRow([200, "http://site1.com", "January 3, 2012"]);
        return expect(this.visit_report.monthly_totals).toEqual({
          "site1.com": 323
        });
      });
    });
    return describe("#canonicalDomain", function() {
      return it("strips the protocol and subdomains, returning just the domain as a string", function() {
        return expect(this.visit_report.canonicalDomain("http://google.com")).toEqual("google.com");
      });
    });
  });

}).call(this);
