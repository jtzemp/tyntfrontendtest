(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.VisitReport = (function() {

    VisitReport._chart_id = "#chart";

    VisitReport._data_table_id = "#data_table";

    VisitReport._month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
      this.grand_total = 0;
      this.chart_options = {
        xaxis: {
          mode: "time"
        },
        legend: {
          labelFormatter: this.formatLegend,
          container: "#data_table"
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
      return "</td><td>" + label + "</td><td class=\"right\">" + vr.monthly_totals[label] + "</td>";
    };

    VisitReport.prototype.drawReport = function() {
      this.transformData();
      this.drawChart();
      this.renderHeader();
      this.renderLegendHeader();
      return this.renderLegendSummary();
    };

    VisitReport.prototype.drawChart = function() {
      return $.plot($("#chart"), this.chart_data, this.chart_options);
    };

    VisitReport.prototype.renderHeader = function() {
      var month_name, report_date;
      report_date = new Date(this.year, this.month, 1);
      month_name = VisitReport._month_names[this.month];
      return $("h1").append("" + month_name + ", " + this.year);
    };

    VisitReport.prototype.renderLegendHeader = function() {
      return $('#legend #data_table table').prepend('<thead><tr><th></th><th></th><th>Site Root</th><th class="right">Visits</th></tr></thead>');
    };

    VisitReport.prototype.renderLegendSummary = function() {
      $('#legend #data_table table').prepend('<tfoot><tr><th colspan="3">Total:</th><th class="right">' + this.grand_total + "</th></tr></tfoot>");
      return $('h1').prepend();
    };

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
        this.monthly_totals[site] += views;
      } else {
        this.monthly_totals[site] = views;
      }
      return this.grand_total += views;
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
