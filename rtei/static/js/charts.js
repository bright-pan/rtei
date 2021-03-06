var RTEI = RTEI || {}
RTEI.charts = (function() {

  var baseChartConfig = {
    bindto: '#chart',
    data: {
      json: null,
      order: null,
      type: 'bar'
    },
    axis: {
      rotated: true,
      x: {
          type: 'category',
          show: true
      },
      y: {
          show: true,
          max: 100,
          padding: {
              top: 10
          }
      }
    },
    bar: {
        width: 16
    },
    tooltip: {
      format: {
        value: function (value, ratio, id, index) {
          if (id.substring(0, 1) != 't') {
            if (id.indexOf('.') === -1) {
              return parseFloat((value * RTEI.charts.categoriesLength.index).toFixed(2));
            } else {
              var key = id.split('.')[0];
              return parseFloat((value * RTEI.charts.categoriesLength[key]).toFixed(2));
            }
          } else {
            return value;
          }
        }
      }
    },
    size: {
      height: 150
    },
    padding: {
      bottom: 20
    },
    transition: {
      duration: 300
    }
  }

  var register = {};

  return {

    categoriesLength: {},

    initChartConfig: function(chartId, data, customChartConfig, names) {

      var config = $.extend(true, {}, baseChartConfig, customChartConfig);
      if (!config.data.json) {
        config.data.json= data;
      }

      if (names) {
        config.data.names = names;
        var colors = {};
        var indicator, subIndicator;
        for (var key in names) {
          if (names.hasOwnProperty(key)) {
            if (key.substring(0, 1) == 't') {
              // Theme, use the default
              colors[key] = RTEI.colors.index[0];
            } else if (key.indexOf('.') !== -1) {
              // Indicator level 2
              indicator = key.split('.')[0];
              subIndicator = key.split('.')[1];
              colors[key] = RTEI.colors[indicator][parseInt(subIndicator) - 1];

              if (RTEI.charts.categoriesLength[indicator]) {
                RTEI.charts.categoriesLength[indicator]++;
              } else {
                RTEI.charts.categoriesLength[indicator] = 1;
              }
            } else {
              //Indicator level 1
              colors[key] = RTEI.colors[key][0];
              if (RTEI.charts.categoriesLength['index']) {
                RTEI.charts.categoriesLength['index']++;
              } else {
                RTEI.charts.categoriesLength['index'] = 1;
              }
            }
          }
        }
        config.data.colors = colors;
      }

      register[chartId] = {};
      register[chartId].config = config;

      return config;
    },

    updateChartConfig: function(chartId, customConfig) {
      var config = register[chartId].config;
      $.extend(true, config, customConfig);

      return config;
    },

    updateChart: function(chartId, code) {
      var config = register[chartId].config;
      var chart = register[chartId].chart;

      if (chart) {
        chart = chart.destroy;
      }

      var values = [];
      if (code == 'index') {
        values = ['1', '2', '3', '4', '5'];
      } else if (code.substring(0, 1) != 't') {
        for (var key in config.data.names) {
          if (config.data.names.hasOwnProperty(key) &&
              key.substring(0, 1) == code &&
              key.indexOf('.') !== -1) {
            values.push(key);
          }
        }
      } else {
        values = [code]
      }
      values.sort()

      var customConfig = $.extend(true, {}, config, {
        data: {
          keys : {
            x: 'name',
            value: values
          },
          groups: [
            values
          ]
        }
      });

      register[chartId].chart = c3.generate(customConfig);
      return register[chartId].chart
    }
  }

})();
