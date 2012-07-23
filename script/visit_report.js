(function() {

  window.VisitReport = (function() {

    VisitReport._chart_id = "#chart";

    VisitReport._data_table_id = "#data_table";

    function VisitReport(year, month) {
      this.year = year || 2009;
      this.month = month || 10;
      this.chart_data = {};
    }

    VisitReport.prototype.dataUrl = function() {
      return "../data/" + this.year + "-" + this.month + "_visits.json";
    };

    VisitReport.prototype.getData = function() {
      var _this = this;
      return $.get(this.dataUrl(), function(data, textStatus, jqXHR) {
        if (textStatus === "success") {
          _this.chart_data = data;
          return _this.drawReport();
        }
      }, 'json');
    };

    VisitReport.prototype.drawReport = function() {
      this.drawChart();
      return this.drawDataTable();
    };

    VisitReport.prototype.drawChart = function() {};

    VisitReport.prototype.drawDataTable = function() {};

    return VisitReport;

  })();

}).call(this);
