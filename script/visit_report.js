(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.VisitReport = (function() {

    VisitReport._chart_id = "#chart";

    VisitReport._data_table_id = "#data_table";

    function VisitReport(year, month) {
      this.year = year || 2009;
      this.month = month || 10;
      this.intermediate_data = {};
      this.chart_data = {};
      this.raw_data = {};
      this.max_date = null;
      this.min_date = null;
      this.sites = {};
      this.monthly_totals = {};
      this.grand_total = null;
      this.chart_options = {
        xaxis: {
          mode: "time"
        },
        legend: {
          labelFormatter: this.formatLegend
        }
      };
    }

    VisitReport.prototype.dataUrl = function() {
      return "data/" + this.year + "-" + this.month + "_visits.json";
    };

    VisitReport.prototype.getData = function() {
      var _this = this;
      return $.get(this.dataUrl(), function(data, textStatus, jqXHR) {
        if (textStatus === "success") {
          _this.raw_data = data;
          return _this.drawReport();
        }
      }, 'json');
    };

    VisitReport.prototype.formatLegend = function(label, series) {
      return "</td><td>" + label + "</td><td>" + vr.monthly_totals[label] + "</td>";
    };

    VisitReport.prototype.drawReport = function() {
      this.transformData();
      this.drawChart();
      return this.drawDataTable();
    };

    VisitReport.prototype.drawChart = function() {
      return $.plot($("#chart"), this.chart_data, this.chart_options);
    };

    VisitReport.prototype.drawDataTable = function() {};

    VisitReport.prototype.transformData = function() {
      var day, name, result, row, series, site, _i, _len, _ref, _ref2;
      result = [];
      _ref = this.raw_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        this.processRow(row);
      }
      _ref2 = this.sites;
      for (site in _ref2) {
        name = _ref2[site];
        series = (function() {
          var _ref3, _ref4, _results;
          _results = [];
          for (day = _ref3 = this.min_date, _ref4 = this.max_date; day <= _ref4; day += 86400000) {
            _results.push([day, this.intermediate_data[site + day.toString()] || 0]);
          }
          return _results;
        }).call(this);
        result.push({
          label: site,
          data: series
        });
      }
      return this.chart_data = result;
    };

    VisitReport.prototype.processRow = function(row) {
      var day, site, views;
      views = row[0];
      site = this.canonicalDomain(row[1]);
      day = Date.parse(row[2]);
      if (this.max_date === null || day > this.max_date) this.max_date = day;
      if (this.min_date === null || day < this.min_date) this.min_date = day;
      if (__indexOf.call(this.sites, site) < 0) this.sites[site] = site;
      this.intermediate_data[site + day.toString()] = views;
      if (this.monthly_totals[site]) {
        return this.monthly_totals[site] += views;
      } else {
        return this.monthly_totals[site] = views;
      }
    };

    VisitReport.prototype.canonicalDomain = function(name) {
      var match;
      if (name) {
        match = name.match(/[A-z0-9-]+\.\w+$/);
        if (match) {
          return match[0];
        } else {
          return "";
        }
      }
    };

    return VisitReport;

  })();

  $(document).ready(function() {
    window.vr = new VisitReport(2009, 10);
    return vr.getData();
  });

}).call(this);
