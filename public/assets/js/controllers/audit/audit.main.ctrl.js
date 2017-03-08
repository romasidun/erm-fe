(function () {
    AuditMainController.$inject = ['$scope', '$rootScope', '$state', 'AuditService', 'ChartFactory', 'Utils', '$filter'];
    app.controller('AuditMainCtrl', AuditMainController);

    function AuditMainController($scope, $rootScope, $state, AuditService, ChartFactory, Utils, $filter) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "AUDIT MANAGEMENT";

        vm.OpList = [5, 10, 25, 50, 100];
        vm.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'auditName',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
            SortMe: function (col) {
                if (vm.Grid1.Column === col)
                    vm.Grid1.IsAsc = !vm.Grid1.IsAsc;
                else
                    vm.Grid1.Column = col;
            },
            GetIco: function (col) {
                if (vm.Grid1.Column === col) {
                    return vm.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('vm.Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')(vm.Grid1.Data, vm.Grid1.Filter);
            vm.Grid1.Total = searchedData.length;
        });

        vm.deleteAction = function (r) {

        };

        vm.editAction = function (r) {

        };

        AuditService.GetManageStatus()
            .then(function (data) {
                $rootScope.app.Mask = true;
                ChartFactory.CreatePieChart('Audit By Status', 'Audit By Status', data, 'audit_MGStatus');
                return AuditService.GetManagePeriod();
            })
            .then(function (data) {
                ChartFactory.CreateLineChart('Audit By Period', data, 'audit_MGPeriod');
                return AuditService.GetManageRegion();
            })
            .then(function (data) {
                loadRegion(data);
                return AuditService.GetActionStatus();
            })
            .then(function (data) {
                ChartFactory.CreatePieChart('Actions By Status', 'Actions By Status', data, 'action_StatusChart');
                return AuditService.GetFindingOpen();
            })
            .then(function (data) {
                loadFinding(data);
                console.log(1111);
                return AuditService.GetManageDept();
            })
            .then(function (data) {
                console.log(data);
                ChartFactory.CreatePieChart('Status By Department', 'Status By Department', data, 'status_department');

            })
            .finally(function () {
                loadData();
            });


        function loadRegion(data) {
            var categories = ['All', 'Asia', 'South Ameria', 'North America', 'Europe'];
            var tmpobj = {};
            for (var i in categories) {
                var item = categories[i];
                var tmpit = (item === 'South Ameria') ? 'EMEA' : item;
                angular.forEach(data, function (val, key) {
                    if (key.indexOf(tmpit) === 0) {
                        var re = key.substr(+tmpit.length + 1);
                        if(re.indexOf('Pacific') !== -1) re = re.substr(8);
                        if (angular.isArray(tmpobj[re])) {
                            tmpobj[re][i] += val * 1;
                        } else {
                            tmpobj[re] = [0, 0, 0, 0, 0];
                            tmpobj[re][i] = val;
                        }
                    }
                });

            }
            var series = [];
            angular.forEach(tmpobj, function (ary, key) {
                series.push({
                    name: key,
                    data: ary
                })
            });
            var config = {
                Text: 'Audit By Region',
                Title: '',
                Categories: categories,
                Series: series
            };
            config = ChartFactory.SetupStackedChart(config);
            Highcharts.chart('audit_MGRegion', config);
        }

        function loadFinding(data) {
            var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var tmpobj = {};
            for (var i in categories) {
                var item = categories[i].toLowerCase();
                angular.forEach(data, function (val, key) {
                    if (key.indexOf(item) === 0) {
                        var re = key.substr(item.length);
                        if (angular.isArray(tmpobj[re])) {
                            tmpobj[re][i] += val * 1;
                        } else {
                            tmpobj[re] = [0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0];
                            tmpobj[re][i] = val;
                        }
                    }
                });

            }
            var series = [];
            angular.forEach(tmpobj, function (ary, key) {
                series.push({
                    name: key,
                    data: ary
                })
            });
            var config = {
                Text: 'Open Findings By Period',
                yTitle: '1',
                subTitle: '1',
                Tooltip: '1',
                Categories: categories,
                Series: series
            };
            console.log(config);
            config = ChartFactory.SetupMonthLineChart(config);
            Highcharts.chart('openFinding_periodChart', config);
        }

        function loadData() {
            AuditService.GetAudits().then(function (data) {
                vm.Grid1.Total = data.length;
                vm.Grid1.Data = data;

                return AuditService.GetFindings();
            }).then(function (data) {
                vm.FindingData = data;
                return AuditService.GetTopics();
            }).then(function (data) {
                angular.forEach(vm.Grid1.Data, function (r, k) {
                    r.dateOccurance = moment(r.dateOccurance).format('MMM-DD-YYYY');

                    r.Grid1 = {
                        PerPage: 10, CurrPage: 1, Column: 'topicName', IsAsc: true, Filter: "", Total: 0, Data: [],
                        SortMe: function (col, obj) {
                            if (obj.Grid1.Column === col)
                                obj.Grid1.IsAsc = !obj.Grid1.IsAsc;
                            else
                                obj.Grid1.Column = col;
                        },
                        GetIco: function (col, obj) {
                            if (obj.Grid1.Column === col) {
                                return obj.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                            } else {
                                return 'fa-unsorted';
                            }
                        }
                    };

                    var tdata = $filter('filter')(data, {'auditId': r.id});
                    r.Grid1.Total = tdata.length;
                    r.Grid1.Data = tdata;
                    $scope.$watch('r.Grid1.Filter', function (n, o) {
                        var searchedData = $filter('filter')(r.Grid1.Data, r.Grid1.Filter);
                        r.Grid1.Total = searchedData.length;
                    });

                    //---------Finding SubGrid----------------------
                    r.Grid1.Data.forEach(function (topic) {
                        topic.Grid1 = {
                            PerPage: 10,
                            CurrPage: 1,
                            Column: 'findingName',
                            IsAsc: true,
                            Filter: "",
                            Total: 0,
                            Data: [],
                            SortMe: function (col, obj) {
                                if (obj.Grid1.Column === col)
                                    obj.Grid1.IsAsc = !obj.Grid1.IsAsc;
                                else
                                    obj.Grid1.Column = col;
                            },
                            GetIco: function (col, obj) {
                                if (obj.Grid1.Column === col) {
                                    return obj.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                                } else {
                                    return 'fa-unsorted';
                                }
                            }
                        };

                        var fdata = $filter('filter')(vm.FindingData, {auditId: r.id, topicId: topic.id});
                        topic.Grid1.Total = fdata.length;
                        topic.Grid1.Data = fdata;

                        $scope.$watch('topic.Grid1.Filter', function (n, o) {
                            var searchedData = $filter('filter')(topic.Grid1.Data, topic.Grid1.Filter);
                            topic.Grid1.Total = searchedData.length;
                        });
                    });
                    //----------------------------------------------
                });

                $rootScope.app.Mask = false;
            });
        }
    }
})();