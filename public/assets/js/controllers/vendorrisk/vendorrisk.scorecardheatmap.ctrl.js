(function () {
    'use strict';

    ScoreController.$inject = ['$scope', '$rootScope', '$state', 'RiskDataService', 'ChartFactory', 'Utils'];
    app.controller('VendScoreCardCtrl', ScoreController);

    function ScoreController($scope, $rootScope, $state, RiskDataService, ChartFactory, Utils) {

        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "VENDOR RISK SCORECARDS";
        $rootScope.app.Mask = false;

        $scope.CurrCol = 'riskName';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.sortMe = function (col) {
            if ($scope.CurrCol === col)
                $scope.IsAsc = !$scope.IsAsc;
            else
                $scope.CurrCol = col;
        };

        $scope.resSort = function (col) {
            if ($scope.CurrCol === col) {
                return $scope.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
            }
        };

        ITRiskService.GetRamStatus().then(function (data) {
            setupPieChart(data);
            return ITRiskService.GetRamPeriod();
        }).then(function (data) {
            setupPeriodChart(data);
            return ITRiskService.GetRamRegion();
        }).then(function (data) {
            setupRegionChart(data);
            return ITRiskService.GetRamDept();
        }).then(function (data) {
            setupDeptChart(data);
            $scope.$watch('PerPage', function (n, o) {
                $rootScope.app.Mask = true;
                loadRam();
            });
        });


        $scope.downloadTemp = function () {
            var dlTmpModal = $uibModal.open({
                templateUrl: 'tmpdownload.tpl.html',
                controller: 'TmpDlCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            Templates: []
                        };
                    }
                }
            });

            dlTmpModal.result.then(function (updEquip) {
                console.log("Done");
            });
        };

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ITRiskService.DeleteRam(r.id).then(function (data) {
                    if (data.status === 200) loadRam();
                });
            });
        };

        $scope.editAction = function (r) {

        };

        function loadRam() {
            ITRiskService.GetRam().then(function (data) {
                data.forEach(function (r) {
                    r.IDate = Utils.createDate(r.modifiedOn);
                });
                $scope.Incidents = data;
                $rootScope.app.Mask = false;
            });
        }

        function setupPieChart(data) {
            var series = [];
            Object.keys(data).forEach(function (k) {
                series.push([k, data[k]]);
            });
            var chartObj = ChartFactory.CreatePieChartTemplate('Risk Type Severity', 'Risk Type Severity', series, ['#EDA300', '#1372DF', '#8EB42E', '#9F6CE5', '#4093E2', '#B49400']);
            Highcharts.chart('statusChart', chartObj);
        }

        function setupPeriodChart(data) {

            var month, opts = {
                Title: "By Period",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "High", data: [], color: '#c62733'},
                    {name: "Medium", data: [], color: '#db981f'},
                    {name: "Low", data: [], color: '#00d356'}
                ]

            };

            Object.keys(data).forEach(function (k) {
                if (k.indexOf('High') > -1) {
                    month = Utils.camelizeString(k.split('High')[0]);
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Med') > -1) {
                    month = Utils.camelizeString(k.split('Med')[0]);
                    opts.Series[1].data.push(data[k]);
                }
                if (k.indexOf('Low') > -1) {
                    month = Utils.camelizeString(k.split('Low')[0]);
                    opts.Series[2].data.push(data[k]);
                }
                if (opts.Categories.indexOf(month) === -1)
                    opts.Categories.push(month);
            });

            ChartFactory.SetupMultiColChart('periodChart', opts);
        }

        function setupRegionChart(data) {

            var opts = {
                Title: "By Region",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "In Progress", data: [], color: '#1016c6'},
                    {name: "Completed", data: [], color: '#00db72'},
                    {name: "Submitted", data: [], color: '#d37619'},
                    {name: "To Approve", data: [], color: '#d3000d'},
                    {name: "Ready To Approve", data: [], color: '#d3a209'},
                    {name: "Approved", data: [], color: '#c807d3'}
                ]
            }, cats = [' in_progress', ' completed', ' submitted', ' to_approve', ' ready_to_approve', ' approved'];
            Object.keys(data).forEach(function (k) {
                if (opts.Categories.indexOf(Utils.removeLastWord(k)) === -1) opts.Categories.push(Utils.removeLastWord(k));
            });
            opts.Categories.forEach(function (c) {
                $filter('filter')(Object.keys(data), c).forEach(function (ck) {
                    cats.forEach(function (ct, j) {
                        if (ck.indexOf(ct) > -1) opts.Series[j].data.push(data[ck]);
                    });
                });
            });
            console.log(opts);

            ChartFactory.SetupMultiColChart('regionChart', opts);
        }

        function setupDeptChart(data) {

            var dept, opts = {
                Title: "By Department",
                YText: "Values",
                Categories: [],
                Series: [
                    {name: "High", data: [], color: '#c62733'},
                    {name: "Medium", data: [], color: '#db981f'},
                    {name: "Low", data: [], color: '#00d356'}
                ]

            };

            Object.keys(data).forEach(function (k) {
                if (k.indexOf('High') > -1) {
                    dept = k.split('High')[0];
                    opts.Series[0].data.push(data[k]);
                }
                if (k.indexOf('Med') > -1) {
                    dept = k.split('Med')[0];
                    opts.Series[1].data.push(data[k]);
                }
                if (k.indexOf('Low') > -1) {
                    dept = k.split('Low')[0];
                    opts.Series[2].data.push(data[k]);
                }
                if (opts.Categories.indexOf(dept) === -1)
                    opts.Categories.push(dept);
            });

            ChartFactory.SetupMultiColChart('deptChart', opts);
        }

    }
})();

(function () {
    'use strict';

    ScoreController.$inject = ['$scope', '$rootScope', '$state', 'RiskDataService', 'ChartFactory', 'Utils', 'VendorService'];
    app.controller('VendScoreCardCtrl', ScoreController);

    function ScoreController($scope, $rootScope, $state, RiskDataService, ChartFactory, Utils, VendorService) {

        $scope.mainTitle = $state.current.title;
        $rootScope.app.Mask = false;

        var RawModel = [
            {
                RiskCategory: "Risk Assessment and Treatment",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 10,
                ResponsesNumNo: 4,
                ResponseNumNA: 2,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "5/1/2017",
                AssessmentDate: "10/11/2016",
                OverallRiskWeight: 80,
                OverallFindingWeight: 16,
                Title: "Assessment 2016",
                FindingsTotal: 4
            },
            {
                RiskCategory: "Security Policy",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 3,
                ResponsesNumNo: 9,
                ResponseNumNA: 10,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "6/1/2017",
                AssessmentDate: "11/11/2016",
                OverallRiskWeight: 24,
                OverallFindingWeight: 24,
                Title: "Assessment 2015",
                FindingsTotal: 6
            },
            {
                RiskCategory: "Organizational Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 8,
                ResponsesNumNo: 7,
                ResponseNumNA: 4,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "7/1/2017",
                AssessmentDate: "12/11/2016",
                OverallRiskWeight: 64,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Asset Management",
                RiskSource: "SIG",
                ControlPeriod: 2014,
                ResponsesNumYes: 7,
                ResponsesNumNo: 2,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "8/1/2017",
                AssessmentDate: "13/11/2016",
                OverallRiskWeight: 140,
                OverallFindingWeight: 92,
                Title: "Assessment 2014",
                FindingsTotal: 23
            },
            {
                RiskCategory: "Human Resource Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 1,
                ResponsesNumNo: 7,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "9/1/2017",
                AssessmentDate: "14/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 20,
                Title: "Assessment 2015",
                FindingsTotal: 5
            },
            {
                RiskCategory: "Physical and Environmental Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 6,
                ResponsesNumNo: 5,
                ResponseNumNA: 7,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "10/1/2017",
                AssessmentDate: "15/11/2016",
                OverallRiskWeight: 48,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Communications and Operations Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 1,
                ResponsesNumNo: 1,
                ResponseNumNA: 28,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "11/1/2017",
                AssessmentDate: "16/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 36,
                Title: "Assessment 2015",
                FindingsTotal: 9
            },
            {
                RiskCategory: "Access Control",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 7,
                ResponsesNumNo: 7,
                ResponseNumNA: 7,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "12/1/2017",
                AssessmentDate: "17/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 60,
                Title: "Assessment 2015",
                FindingsTotal: 15
            },
            {
                RiskCategory: "Information Systems Acquisition Development & Maintenance",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 8,
                ResponsesNumNo: 7,
                ResponseNumNA: 12,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "13/1/2017",
                AssessmentDate: "18/11/2016",
                OverallRiskWeight: 200,
                OverallFindingWeight: 4,
                Title: "Assessment 2015",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Incident Event and Communications Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 12,
                ResponsesNumNo: 2,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "14/1/2017",
                AssessmentDate: "19/11/2016",
                OverallRiskWeight: 109,
                OverallFindingWeight: 12,
                Title: "Assessment 2015",
                FindingsTotal: 3
            },
            {
                RiskCategory: "Business Continuity and Disaster Recovery",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 14,
                ResponsesNumNo: 9,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "15/1/2017",
                AssessmentDate: "20/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 32,
                Title: "Assessment 2015",
                FindingsTotal: 8
            },
            {
                RiskCategory: "Compliance",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 2,
                ResponsesNumNo: 15,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "16/1/2017",
                AssessmentDate: "21/11/2016",
                OverallRiskWeight: 16,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Mobile",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 11,
                ResponsesNumNo: 9,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "17/1/2017",
                AssessmentDate: "22/11/2016",
                OverallRiskWeight: 144,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Privacy",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 5,
                ResponsesNumNo: 2,
                ResponseNumNA: 4,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "18/1/2017",
                AssessmentDate: "23/11/2016",
                OverallRiskWeight: 72,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Software Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 14,
                ResponsesNumNo: 14,
                ResponseNumNA: 6,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "19/1/2017",
                AssessmentDate: "24/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 4,
                Title: "Assessment 2016",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Cloud",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 7,
                ResponsesNumNo: 3,
                ResponseNumNA: 2,
                VendorId: null,
                VendorName: "Yahoo",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "20/1/2017",
                AssessmentDate: "25/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 0,
                Title: "Assessment 2016",
                FindingsTotal: 0
            },
            {
                RiskCategory: "Risk Assessment and Treatment",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 7,
                ResponsesNumNo: 4,
                ResponseNumNA: 2,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "5/1/2017",
                AssessmentDate: "10/11/2016",
                OverallRiskWeight: 80,
                OverallFindingWeight: 16,
                Title: "Assessment 2016",
                FindingsTotal: 4
            },
            {
                RiskCategory: "Security Policy",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 16,
                ResponsesNumNo: 2,
                ResponseNumNA: 4,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "6/1/2017",
                AssessmentDate: "11/11/2016",
                OverallRiskWeight: 24,
                OverallFindingWeight: 24,
                Title: "Assessment 2015",
                FindingsTotal: 6
            },
            {
                RiskCategory: "Organizational Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 8,
                ResponsesNumNo: 1,
                ResponseNumNA: 10,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "7/1/2017",
                AssessmentDate: "12/11/2016",
                OverallRiskWeight: 64,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Asset Management",
                RiskSource: "SIG",
                ControlPeriod: 2014,
                ResponsesNumYes: 20,
                ResponsesNumNo: 2,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "8/1/2017",
                AssessmentDate: "13/11/2016",
                OverallRiskWeight: 140,
                OverallFindingWeight: 92,
                Title: "Assessment 2014",
                FindingsTotal: 23
            },
            {
                RiskCategory: "Human Resource Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 1,
                ResponsesNumNo: 20,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "9/1/2017",
                AssessmentDate: "14/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 20,
                Title: "Assessment 2015",
                FindingsTotal: 5
            },
            {
                RiskCategory: "Physical and Environmental Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 6,
                ResponsesNumNo: 5,
                ResponseNumNA: 8,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "10/1/2017",
                AssessmentDate: "15/11/2016",
                OverallRiskWeight: 48,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Communications and Operations Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 1,
                ResponsesNumNo: 1,
                ResponseNumNA: 28,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "11/1/2017",
                AssessmentDate: "16/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 36,
                Title: "Assessment 2015",
                FindingsTotal: 9
            },
            {
                RiskCategory: "Access Control",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 7,
                ResponsesNumNo: 7,
                ResponseNumNA: 7,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "12/1/2017",
                AssessmentDate: "17/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 60,
                Title: "Assessment 2015",
                FindingsTotal: 15
            },
            {
                RiskCategory: "Information Systems Acquisition Development & Maintenance",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 25,
                ResponsesNumNo: 20,
                ResponseNumNA: 12,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "13/1/2017",
                AssessmentDate: "18/11/2016",
                OverallRiskWeight: 200,
                OverallFindingWeight: 4,
                Title: "Assessment 2015",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Incident Event and Communications Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 12,
                ResponsesNumNo: 0,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "14/1/2017",
                AssessmentDate: "19/11/2016",
                OverallRiskWeight: 109,
                OverallFindingWeight: 12,
                Title: "Assessment 2015",
                FindingsTotal: 3
            },
            {
                RiskCategory: "Business Continuity and Disaster Recovery",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 14,
                ResponsesNumNo: 9,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "15/1/2017",
                AssessmentDate: "20/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 32,
                Title: "Assessment 2015",
                FindingsTotal: 8
            },
            {
                RiskCategory: "Compliance",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 2,
                ResponsesNumNo: 15,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "16/1/2017",
                AssessmentDate: "21/11/2016",
                OverallRiskWeight: 16,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Mobile",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 18,
                ResponsesNumNo: 18,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "17/1/2017",
                AssessmentDate: "22/11/2016",
                OverallRiskWeight: 144,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Privacy",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 9,
                ResponsesNumNo: 26,
                ResponseNumNA: 4,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "18/1/2017",
                AssessmentDate: "23/11/2016",
                OverallRiskWeight: 72,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Software Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 14,
                ResponsesNumNo: 14,
                ResponseNumNA: 6,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "19/1/2017",
                AssessmentDate: "24/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 4,
                Title: "Assessment 2016",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Cloud",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 7,
                ResponsesNumNo: 3,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "LinkedIn",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "20/1/2017",
                AssessmentDate: "25/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 0,
                Title: "Assessment 2016",
                FindingsTotal: 0
            },
            {
                RiskCategory: "Risk Assessment and Treatment",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 10,
                ResponsesNumNo: 5,
                ResponseNumNA: 2,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "5/1/2017",
                AssessmentDate: "10/11/2016",
                OverallRiskWeight: 80,
                OverallFindingWeight: 16,
                Title: "Assessment 2016",
                FindingsTotal: 4
            },
            {
                RiskCategory: "Security Policy",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 3,
                ResponsesNumNo: 13,
                ResponseNumNA: 10,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "6/1/2017",
                AssessmentDate: "11/11/2016",
                OverallRiskWeight: 24,
                OverallFindingWeight: 24,
                Title: "Assessment 2015",
                FindingsTotal: 6
            },
            {
                RiskCategory: "Organizational Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 8,
                ResponsesNumNo: 7,
                ResponseNumNA: 10,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "7/1/2017",
                AssessmentDate: "12/11/2016",
                OverallRiskWeight: 64,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Asset Management",
                RiskSource: "SIG",
                ControlPeriod: 2014,
                ResponsesNumYes: 1,
                ResponsesNumNo: 2,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "8/1/2017",
                AssessmentDate: "13/11/2016",
                OverallRiskWeight: 140,
                OverallFindingWeight: 92,
                Title: "Assessment 2014",
                FindingsTotal: 23
            },
            {
                RiskCategory: "Human Resource Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 2,
                ResponsesNumNo: 10,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "9/1/2017",
                AssessmentDate: "14/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 20,
                Title: "Assessment 2015",
                FindingsTotal: 5
            },
            {
                RiskCategory: "Physical and Environmental Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 6,
                ResponsesNumNo: 3,
                ResponseNumNA: 8,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "10/1/2017",
                AssessmentDate: "15/11/2016",
                OverallRiskWeight: 48,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Communications and Operations Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 2,
                ResponsesNumNo: 1,
                ResponseNumNA: 28,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "11/1/2017",
                AssessmentDate: "16/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 36,
                Title: "Assessment 2015",
                FindingsTotal: 9
            },
            {
                RiskCategory: "Access Control",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 7,
                ResponsesNumNo: 3,
                ResponseNumNA: 16,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "12/1/2017",
                AssessmentDate: "17/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 60,
                Title: "Assessment 2015",
                FindingsTotal: 15
            },
            {
                RiskCategory: "Information Systems Acquisition Development & Maintenance",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 25,
                ResponsesNumNo: 20,
                ResponseNumNA: 12,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "13/1/2017",
                AssessmentDate: "18/11/2016",
                OverallRiskWeight: 200,
                OverallFindingWeight: 4,
                Title: "Assessment 2015",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Incident Event and Communications Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 12,
                ResponsesNumNo: 8,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "14/1/2017",
                AssessmentDate: "19/11/2016",
                OverallRiskWeight: 109,
                OverallFindingWeight: 12,
                Title: "Assessment 2015",
                FindingsTotal: 3
            },
            {
                RiskCategory: "Business Continuity and Disaster Recovery",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 14,
                ResponsesNumNo: 9,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "15/1/2017",
                AssessmentDate: "20/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 32,
                Title: "Assessment 2015",
                FindingsTotal: 8
            },
            {
                RiskCategory: "Compliance",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 2,
                ResponsesNumNo: 15,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "16/1/2017",
                AssessmentDate: "21/11/2016",
                OverallRiskWeight: 16,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Mobile",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 18,
                ResponsesNumNo: 18,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "17/1/2017",
                AssessmentDate: "22/11/2016",
                OverallRiskWeight: 144,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Privacy",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 9,
                ResponsesNumNo: 26,
                ResponseNumNA: 4,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "18/1/2017",
                AssessmentDate: "23/11/2016",
                OverallRiskWeight: 72,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Software Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 14,
                ResponsesNumNo: 31,
                ResponseNumNA: 6,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "19/1/2017",
                AssessmentDate: "24/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 4,
                Title: "Assessment 2016",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Cloud",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 7,
                ResponsesNumNo: 3,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "Oracle",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "20/1/2017",
                AssessmentDate: "25/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 0,
                Title: "Assessment 2016",
                FindingsTotal: 0
            },
            {
                RiskCategory: "Risk Assessment and Treatment",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 9,
                ResponsesNumNo: 4,
                ResponseNumNA: 2,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "5/1/2017",
                AssessmentDate: "10/11/2016",
                OverallRiskWeight: 80,
                OverallFindingWeight: 16,
                Title: "Assessment 2016",
                FindingsTotal: 4
            },
            {
                RiskCategory: "Security Policy",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 3,
                ResponsesNumNo: 21,
                ResponseNumNA: 11,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "6/1/2017",
                AssessmentDate: "11/11/2016",
                OverallRiskWeight: 24,
                OverallFindingWeight: 24,
                Title: "Assessment 2015",
                FindingsTotal: 6
            },
            {
                RiskCategory: "Organizational Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 8,
                ResponsesNumNo: 7,
                ResponseNumNA: 10,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "7/1/2017",
                AssessmentDate: "12/11/2016",
                OverallRiskWeight: 64,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Asset Management",
                RiskSource: "SIG",
                ControlPeriod: 2014,
                ResponsesNumYes: 6,
                ResponsesNumNo: 2,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "8/1/2017",
                AssessmentDate: "13/11/2016",
                OverallRiskWeight: 140,
                OverallFindingWeight: 92,
                Title: "Assessment 2014",
                FindingsTotal: 23
            },
            {
                RiskCategory: "Human Resource Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 1,
                ResponsesNumNo: 20,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "9/1/2017",
                AssessmentDate: "14/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 20,
                Title: "Assessment 2015",
                FindingsTotal: 5
            },
            {
                RiskCategory: "Physical and Environmental Security",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 6,
                ResponsesNumNo: 5,
                ResponseNumNA: 8,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "10/1/2017",
                AssessmentDate: "15/11/2016",
                OverallRiskWeight: 48,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Communications and Operations Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 1,
                ResponsesNumNo: 1,
                ResponseNumNA: 28,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "11/1/2017",
                AssessmentDate: "16/11/2016",
                OverallRiskWeight: 8,
                OverallFindingWeight: 36,
                Title: "Assessment 2015",
                FindingsTotal: 9
            },
            {
                RiskCategory: "Access Control",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 7,
                ResponsesNumNo: 7,
                ResponseNumNA: 7,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "12/1/2017",
                AssessmentDate: "17/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 60,
                Title: "Assessment 2015",
                FindingsTotal: 15
            },
            {
                RiskCategory: "Information Systems Acquisition Development & Maintenance",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 5,
                ResponsesNumNo: 20,
                ResponseNumNA: 12,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "13/1/2017",
                AssessmentDate: "18/11/2016",
                OverallRiskWeight: 200,
                OverallFindingWeight: 4,
                Title: "Assessment 2015",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Incident Event and Communications Management",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 12,
                ResponsesNumNo: 0,
                ResponseNumNA: 1,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "14/1/2017",
                AssessmentDate: "19/11/2016",
                OverallRiskWeight: 109,
                OverallFindingWeight: 12,
                Title: "Assessment 2015",
                FindingsTotal: 3
            },
            {
                RiskCategory: "Business Continuity and Disaster Recovery",
                RiskSource: "SIG",
                ControlPeriod: 2015,
                ResponsesNumYes: 9,
                ResponsesNumNo: 9,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "15/1/2017",
                AssessmentDate: "20/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 32,
                Title: "Assessment 2015",
                FindingsTotal: 8
            },
            {
                RiskCategory: "Compliance",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 2,
                ResponsesNumNo: 3,
                ResponseNumNA: 15,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "16/1/2017",
                AssessmentDate: "21/11/2016",
                OverallRiskWeight: 16,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Mobile",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 9,
                ResponsesNumNo: 9,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "17/1/2017",
                AssessmentDate: "22/11/2016",
                OverallRiskWeight: 144,
                OverallFindingWeight: 40,
                Title: "Assessment 2016",
                FindingsTotal: 10
            },
            {
                RiskCategory: "Privacy",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 9,
                ResponsesNumNo: 26,
                ResponseNumNA: 4,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "18/1/2017",
                AssessmentDate: "23/11/2016",
                OverallRiskWeight: 72,
                OverallFindingWeight: 8,
                Title: "Assessment 2016",
                FindingsTotal: 2
            },
            {
                RiskCategory: "Software Security",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 9,
                ResponsesNumNo: 8,
                ResponseNumNA: 2,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "19/1/2017",
                AssessmentDate: "24/11/2016",
                OverallRiskWeight: 112,
                OverallFindingWeight: 4,
                Title: "Assessment 2016",
                FindingsTotal: 1
            },
            {
                RiskCategory: "Cloud",
                RiskSource: "SIG",
                ControlPeriod: 2016,
                ResponsesNumYes: 7,
                ResponsesNumNo: 3,
                ResponseNumNA: 0,
                VendorId: null,
                VendorName: "FaceBook",
                DocType: "SIG - Survey",
                RiskType: "VendorRisk",
                ApprovedDate: "20/1/2017",
                AssessmentDate: "25/11/2016",
                OverallRiskWeight: 56,
                OverallFindingWeight: 0,
                Title: "Assessment 2016",
                FindingsTotal: 0
            }
        ];

        $scope.VendList = {};
        $scope.VendOpts = [];

        RawModel.forEach(function (v) {
            if (!$scope.VendList.hasOwnProperty(v.VendorName)) {
                $scope.VendOpts.push(v.VendorName);
                $scope.VendList[v.VendorName] = [];
            }
            $scope.VendList[v.VendorName].push(v);
        });

        $scope.CurrVendor = $scope.VendOpts[0];
        $scope.$watch('CurrVendor', function (nv) {
            setupChart(nv);
        });

        $scope.selectVendor = function (v) {
            $scope.CurrVendor = v
        };

        function setupChart(vend) {

            var XCategories = ['ResponsesNumYes', 'ResponsesNumNo', 'ResponseNumNA', 'FindingsTotal', 'OverallRiskWeight', 'OverallFindingWeight'];
            var ChartOpts = {
                Title: vend + ' Risk  Ratings',
                XCategories: ['RY', 'RN', 'RNA', 'TF', 'RS', 'TFW'],
                YCategories: [],
                SeriesName: 'Risk Ratings',
                SeriesData: []
            };

            $scope.VendList[vend].reverse().forEach(function (li, i) {
                ChartOpts.YCategories.push(li.RiskCategory);
                XCategories.forEach(function (xc, j) {
                    ChartOpts.SeriesData.push({y: i, x: j, value: li[xc], color: cellColor(li[xc])});
                });
            });

            console.log(ChartOpts);
            ChartFactory.BuildHeatMap('vendorHeatMap', ChartOpts);
        }

        function cellColor(val) {
            var ranges = [0, 20, 40, 60, 80, 100, 120, 150, 180];
            var colors = ['#F34A4D', '#E3500A', '#FF9109', '#FFDB27', '#D3FF12', '#35D321', '#92F115', '#229C00'];
            var resCol = '#E3001F';

            for (var i in ranges) {
                if (i > 0) {
                    if (val > ranges[i]) resCol = colors[i - 1];
                }
            }

            return resCol;
        }

        //RiskDataService.GetRiskMetrics().then(function(data){
        //   console.log(data);
        // console.log('Done');
        //});

    }
})();