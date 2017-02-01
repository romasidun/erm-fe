(function(){
    "use strict";


    app.factory('ChartFactory', function($rootScope, Utils){

        function ChartFactory(){ this.name = "Chart Factory" }
        ChartFactory.prototype.constructor = ChartFactory;

        /*
         *  High Chart related functions
         */
        ChartFactory.prototype.CreatePieChartTemplate = function(title, name, data, cols){
            if(cols && cols.length) Highcharts.getOptions().plotOptions.pie.colors = cols;
            return {
                chart: {
                    type: 'pie',
                    options3d: { enabled: true, alpha: 45, beta: 0 }
                },
                title: { text: title },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },
                series: [{ type: 'pie', name: name, data: data }]
            };
        };

        ChartFactory.prototype.StatusChart = function(container){
            return new Highcharts.Chart({
                colors: ['#FFFF33', '#A0341F',  '#739113'],
                chart: {
                    renderTo: container,
                    spacingBottom: 15,
                    spacingTop: 10,
                    spacingLeft: 10,
                    spacingRight: 10,
                    width: 280,
                    height: 270
                },
                title: { text: '', x: 0 , style: { font: '20px TimesNewRoman', color : 'black' } },
                subtitle: { x: 0 },
                xAxis: { categories: jsondata[0] },
                yAxis: {
                    min:0,
                    allowDecimals: false,
                    title: {
                        text: 'Count'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: ''
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Low',
                    data: jsondata[1]
                }, {
                    name: 'Medium',
                    data: jsondata[2]
                }, {
                    name: 'High',
                    data: jsondata[3]
                }]
            });
        };

        ChartFactory.prototype.SetupStackedChart = function(config){

            //if(config.Colors) Highcharts.getOptions().plotOptions.bar.colors = config.Colors;

            return {
                chart: { type: 'bar' },
                title: { text: config.Text },
                xAxis: {
                    categories: config.Categories
                },
                yAxis: {
                    min: 0,
                        title: { text: config.Title }
                },
                legend: {  reversed: false },
                plotOptions: {
                    series: { stacking: 'normal' }
                },
                series: config.Series,
                colors: config.Colors
            };
        };

        ChartFactory.prototype.SetupMultiColChart = function(el, opts){

            var chartObj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: opts.Title
                },
                subtitle: {
                    text: 'Monthly'
                },
                xAxis: {  categories: opts.Categories },
                yAxis: {
                    min: 0,
                    title: {
                        text: opts.YText
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: opts.Series,
                colors: opts.Colors
            };

            Highcharts.chart(el, chartObj);
        };


        ChartFactory.prototype.SetupColChart = function(el, opts){

            var chartObj = {
                chart: {
                    renderTo: el,
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: -20,
                        depth: 100,
                        viewDistance: 25
                    }
                },
                title: { text: opts.Title },
                xAxis: { categories: opts.Categories },
                yAxis: { title: { text: 'Level' } },
                series: [{ name: opts.Series, data: opts.Data }]
            };

            new Highcharts.Chart(chartObj);
        };

        ChartFactory.prototype.SetupLabelChart = function(opts){

            var chartObj = {
                chart: {
                    type: 'column',
                },
                title: {
                    text: opts.Title
                },
                subtitle: {
                    text: opts.subTitle
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: opts.yTitle
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: opts.tooltip
                },
                series: [{
                    name: 'Population',
                    data: opts.Data,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            };

            return chartObj;
        };

        ChartFactory.prototype.BuildHeatMap = function (el, opts) {

            var chartObj = {
                chart: {
                    type: 'heatmap',
                    marginTop: 40,
                    marginBottom: 80,
                    plotBorderWidth: 1
                },
                title: { text: opts.Title },
                xAxis: {
                    categories: opts.XCategories
                },
                yAxis: {
                    categories: opts.YCategories,
                    title: null
                },
                legend: false,
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> ratings <br><b>' +
                            this.point.value + '</b> for <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                    }
                },
                series: [{
                    name: opts.SeriesName,
                    borderWidth: 1,
                    data: opts.SeriesData,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                }]
            };

            Highcharts.chart(el, chartObj);
        };

        return new ChartFactory();
    });

})();


//Usage Examples

// function setupSeverityChart(data){
//     var opts = {
//         Title:  'Risk Type Severity',
//         Categories: [],
//         Series: 'Severity Types',
//         Data : []
//     };
//     Object.keys(data).forEach(function(k){
//         opts.Categories.push(k);
//         opts.Data.push(data[k]);
//     });
//
//     ChartFactory.SetupColChart('severityChart', opts);
// }
