(function () {

    "use strict";

    SOXRCMCreateController.$inject = ['$scope', '$rootScope', '$state', 'ComplianceService', 'Utils'];
    app.controller('SOXRCMCreateCtrl', SOXRCMCreateController);


    function SOXRCMCreateController($scope, $rootScope, $state, ComplianceService, Utils) {

        $scope.mainTitle = $state.current.title || 'loading';
        $scope.mainDesc = "Create a Risk Control Matrix Assessment";

        $scope.Form = {};

        $scope.VM = {
            controlDataModel: [],
            actualName: "",
            approval: "",
            asmntType: "ACM012",
            asmntTypeName: "SOXRCM",
            asmntType_name: "",
            assessDesc: "",
            assessId: 0,
            assessName: "",
            business: "",
            createdBy: "",
            createdOn: "",
            due_date: moment().format("MM-DD-YYYY"),
            filemodel: [],
            filename: "",
            frequency: "",
            modifiedBy: "",
            modifiedOn: "",
            period: "",
            priority: "",
            region: "",
            resPerson: ""
        };

        $scope.submitAction = function () {
            if ($scope.Form.SoxRcm.$invalid) return false;

            $scope.VM.assessId = moment().format('X');
            ComplianceService.PostSOXRCMAssessment($scope.VM).then(function (res) {
                if (res.status === 200) $state.go('app.compliance.soxrcm.main');
            });
        };

        $scope.cancelAction = function () {
            if ($scope.Form.SoxRcm.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.compliance.soxrcm.main');
                });
                return false;
            }
            $state.go('app.compliance.soxrcm.main');
        };

        $scope.setOpt = function (op) {
            op.Selected = !op.Selected;
            if (op.Selected) {
                $scope.RiskCategories.SelCount++;
            } else {
                $scope.RiskCategories.SelCount--;
            }

            console.log($scope.RiskCategories.SelCount);
        };

        $scope.addControls = function () {
            var headers = ["Control Category", "Control ID", "Control Name", "Control Source", "Business Procee", "Owner"],
                cols = ["controlCategory", "controlRefID", "controlName", "controlSource", "businessProcess", "controlOwner"];

            $rootScope.app.Mask = true;
            ComplianceService.GetControlData().then(function (data) {
                data.forEach(function (c, i) {
                    c.Selected = false;
                    c.modifiedOn = Utils.createDate(c.modifiedOn);
                });
                var controlModal = Utils.CreateSelectListView("Select Controls", data, headers, cols);
                controlModal.result.then(function (list) {
                    $scope.VM.controlDataModel = $scope.VM.controlDataModel.concat(list);
                });
                $rootScope.app.Mask = false;
            });
        };
        $scope.removeItem = function (type, idx) {
            $scope.VM[type].splice(idx, 1);
        };
        $scope.downloadExcel = function () {
            var data = {};
            data.sheetName = "Risk Control Matrix";
            data.body = [];

            var head_txt = ['Control Ref#', 'Design Effective/Remediate', 'Assertion', 'Risk', 'Control Activity Short Description', 'Name of IT Application', 'Type of Control', '2008 Control Level', 'Effective Date', 'Control Frequency', 'Control Method', 'Testing Size', 'Control Type', 'Est Annual Vol Control Occurrences', 'Control Element', 'Control Owner', 'Owner Supervisor', 'Fraud Control Scenario', 'Control Activity Detailed Description', 'Test Procedures', 'Type of Test', 'Document Request', 'Document Keeper', 'Population Definition', 'Population Source', 'Expected Testing Hours', '2007 Control', 'Control Level Change', 'Detailed Change Reason', 'Financial Reporting Objective'];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 2),
                    row: 11,
                    text: head_txt[i],
                    font: {name: 'Calibri', sz: '11', family: '3', scheme: '-'},
                    fill: {type: 'solid', fgColor: 'FFFF00'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                    wrap: 'true'
                });
            }

            data.body.push({
                col: 2, row: 5, text: 'Any Company', valign: 'top', align: 'left',
                merge: {to: {col: 2, row: 5}, from: {col: 4, row: 6}},
                font: {name: 'Calibri', sz: '18', family: '3', scheme: '-', bold: 'true'}
            });
            data.body.push({
                col: 2, row: 7, text: 'Risk Control Matrix (RCM)', align: 'left',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.body.push({
                col: 2, row: 8, text: 'Business Process', align: 'left',
                merge: {to: {col: 2, row: 8}, from: {col: 3, row: 8}},
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-'}
            });
            data.body.push({
                col: 2, row: 9, text: 'Business Subprocess', align: 'left',
                merge: {to: {col: 2, row: 9}, from: {col: 3, row: 9}},
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-'}
            });
            data.body.push({
                col: 4, row: 8, text: '02 Taxes',
                font: {name: 'Calibri', sz: '12', family: '3', scheme: '-', bold: 'true'}
            });
            data.body.push({
                col: 4, row: 9, text: '02.1 Taxes',
                font: {name: 'Calibri', sz: '12', family: '3', scheme: '-', bold: 'true'}
            });

            data.body.push({
                col: 6, row: 5, text: 'Process Risk Level',
                font: {name: 'Calibri', sz: '10', family: '3', scheme: '-', bold: 'true'},
                fill: {type: 'solid', fgColor: 'BFBFBF'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 6, row: 6, text: 'High',
                merge: {to: {col: 6, row: 6}, from: {col: 6, row: 7}},
                font: {name: 'Calibri', sz: '10', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });


            data.body.push({
                col: 8, row: 5, text: 'Financial Disclosure Areas and Disclosure Objectives',
                merge: {to: {col: 8, row: 5}, from: {col: 14, row: 5}},
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                fill: {type: 'solid', fgColor: 'BFBFBF'},
                border: {left: 'thin', top: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 8, row: 6, text: '* INCOME TAX EXPENSE/BENEFIT: is determined in accordance with tax law, and recorded against the applicable component of net income, or equity.',
                merge: {to: {col: 8, row: 6}, from: {col: 14, row: 8}},
                valign: 'center',
                font: {name: 'Calibri', sz: '10', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin'},
                wrap : 'true'
            });

            data.body.push({
                col: 16, row: 6, text: 'Key Control',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 16, row: 7, text: 'Standard Controls',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 16, row: 8, text: 'Total Controls',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 5, text: 'Count',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                fill: {type: 'solid', fgColor: 'BFBFBF'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 5, text: 'Testing Hours',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                fill: {type: 'solid', fgColor: 'BFBFBF'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 6, text: '5',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 6, text: '15',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 7, text: '0',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 7, text: '0',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });

            data.body.push({
                col: 17, row: 8, text: '5',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });
            data.body.push({
                col: 18, row: 8, text: '15',
                font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'false'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'}
            });


            data.cols = 35;
            data.rows = 15;

            var wval = [14, 21, 15, 24, 25, 26, 17, 14, 11, 19, 16, 14, 14, 16, 20, 15, 13, 12, 30, 30, 16, 24, 25, 16, 23, 12, 14, 24, 19, 23];
            data.widths = [];
            for(var i=0;i<wval.length;i++){
                data.widths.push({col: +i+2, width: wval[i]});
            }

            data.heights = [];
            data.heights.push({row: 5, height: 25});
            data.heights.push({row: 11, height: 45});

            ComplianceService.DownloadExcel(data).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl + '/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };

        $rootScope.app.Mask = false;
    }
})();