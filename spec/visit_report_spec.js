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
        return expect(this.visit_report.dataUrl()).toEqual("../data/2009-10_visits.json");
      });
      return it("for the sake of the exercise it defaults to the only data set I have (Oct, 2009)", function() {
        return expect(this.visit_report.dataUrl()).toEqual("../data/2009-10_visits.json");
      });
    });
    return describe("#getData()", function() {
      it("gets the requested data from the VisitReport object dataUrl()", function() {
        spyOn(this.visit_report, 'dataUrl').andReturn("../data/2009-10_visits.json");
        this.visit_report.getData();
        return expect(this.visit_report.dataUrl).toHaveBeenCalled();
      });
      return it("if the AJAX call to the data stream is successful, it calls #drawReport()", function() {
        spyOn(this.visit_report, 'drawReport');
        this.visit_report.getData();
        return expect(this.visit_report.drawReport).toHaveBeenCalled();
      });
    });
  });

}).call(this);
