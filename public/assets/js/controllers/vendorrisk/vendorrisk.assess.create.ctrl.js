(function () {
    'use strict';
    VendorAssessmentController.$inject = ['$rootScope', '$scope', '$state', 'VendorService', 'Utils', '$filter'];
    app.controller('VendorAssessmentCtrl', VendorAssessmentController);
    function VendorAssessmentController($rootScope, $scope, $state, VendorService, Utils, $filter) {
        $scope.mainTitle = $state.current.title;
        var asId = $state.params.asId;
        var vrId = $state.params.vrId;
        var page = $state.params.page;

        VendorService.GetRimById(asId).then(function (data) {
            $rootScope.app.Mask = true;
            $scope.VM = data;
            data.approvedDate = new Date(data.approvedDate);
            $scope.VM.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.VM.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            //$scope.vendor = $filter('filter1')($scope.VM.vendors, {id: vrId});
            var foundVendor = $filter('filter')($scope.VM.vendors, {id: vrId});

            if(angular.isArray(foundVendor) && foundVendor.length > 0)
                $scope.vendor = foundVendor[0];

            return VendorService.GetVendorAssessment($scope.VM.vendorRiskType);

        }).then(function (data) {
            $scope.vrStinfoCT = data;
            $rootScope.app.Mask = false;

            //Vendor Status Update
            if(page === 'email')
                setStatus('Waiting For Response');

            //return VendorService.GetVendorById(vrId);
        });/*.then(function (data) {
            $scope.vendor = data;
            $rootScope.app.Mask = false;
        })*/

        $scope.vendorResponseVal = function (para, ele, event) {
            if ($(event.target).prop('checked') == true) {
                $(event.target).prop('checked', true);
                $(event.target).parent('td').siblings('.res').children('input:checkbox').prop('checked', false);
            }
        };

        $scope.saveVendorData = function () {
            /*            var date = new Date();
             var current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
             var current_user = $('.dropdown.current-user .username').text();*/
            $rootScope.app.Mask = true;
            angular.forEach($scope.vrStinfoCT, function (obj, ind) {
                var asData = $scope.VM;
                var vendor_response = "NA";
                if (obj.responseN == false && obj.responseY == false) {
                    vendor_response = "NA";
                }
                if (obj.responseN == true) {
                    obj.responseY = false;
                    vendor_response = "N";
                }
                if (obj.responseY == true) {
                    obj.responseN = false;
                    vendor_response = "Y";
                }
                var vendor_comment = angular.isDefined(obj.comments) ? obj.comments : "";
                var vendor_Findings = angular.isDefined(obj.findings) ? obj.findings : 0;
                var vendor_Category = angular.isDefined(obj.category) ? obj.category : "";
                var sendData = {
                    assessmentDate: asData.assessmentDate,
                    assessmentDtStr: asData.assessmentDtStr,
                    vraid: asId,
                    comments: vendor_comment,
                    control_Ref_ID: '',
                    control_Category: vendor_Category,
                    control_Name: asData.actualName,
                    control_Source: asData.vendorRiskType,
                    docType: asData.docType,
                    finding: vendor_Findings,
                    response: vendor_response,
                    riskScore: asData.riskScore,
                    riskType: asData.vendorRiskType,
                    riskWeight: 0,
                    status: asData.status,
                    title: asData.title,
                    vendor: $scope.vendor
                };
                VendorService.PostVendorData(sendData).then(function () {
                    //Vendor Status Update
                    if(page === 'email')
                        setStatus('Completed');

                    if(($scope.vrStinfoCT.length-1) === ind){
                        $rootScope.app.Mask = false;
                    }
                })
            });
        };

        function setStatus(msg){
            //Vendor Status Update----------------------
            angular.forEach($scope.VM.vendors, function (item, ind) {
                if(item.id == vrId){
                    item.statusMsg = msg;
                }
            });

            var params = {
                vendors: $scope.VM.vendors
            };
            return VendorService.PutAseessmentList(asId, params);
            //-------------------------------------------
        }

        $scope.goBack = function () {
            $state.go('app.vendorrisk.stinfo.update', {id: asId});
        };

        $scope.downloadExcel = function () {
            var data = {};
            data.heights = [];
            data.sheetName = "Vendor Risk Assessment";
            data.body = [];

            data.body.push({
                col: 1, row: 1, text: 'Vendor Risk Assessment', valign: 'center', align: 'center',
                merge: {to: {col: 1, row: 1}, from: {col: 6, row: 1}},
                fill: {type: 'solid', fgColor: '457BE6'},
                font: {name: 'Calibri', sz: '24', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 1, height: 60});

            data.body.push({
                col: 2, row: 3, text: 'Vendor: ' + $scope.vendor.vendorName, align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 3, height: 25});

            data.body.push({
                col: 2, row: 4, text: 'Primary Contact: ' + $scope.vendor.primaryContact, align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 4, height: 25});

            data.body.push({
                col: 2,
                row: 5,
                text: 'Assessment Date: ' + $scope.VM.assessmentsDate + '  Assessment By: ' + $scope.VM.assessmentBy,
                align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 5, height: 25});

            data.body.push({
                col: 2,
                row: 6,
                text: 'Doc Title: ' + $scope.VM.title + '  Doc Type: Survey' + $scope.VM.docType,
                align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 6, height: 25});

            data.body.push({
                col: 2, row: 7, text: 'Risk Score: ' + $scope.VM.riskScore, align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 7, height: 25});

            var head_txt = ['Vendor Risk Category', 'Vendor Risk Assessment', 'Yes', 'No', 'Findings', 'Comments'];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 1),
                    row: 9,
                    text: head_txt[i],
                    font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                    fill: {type: 'solid', fgColor: '457BE6'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                    wrap: 'true'
                });
            }
            data.heights.push({row: 9, height: 30});

            var num = 10;
            var newObj = []
            angular.forEach($scope.vrStinfoCT, function (obj, ind) {
                var yesStr = '';
                var noStr = '';
                if (obj.responseN == true) {
                    noStr = "N";
                }
                if (obj.responseY == true) {
                    yesStr = "Y";
                }
                var vendor_comment = angular.isDefined(obj.comments) ? obj.comments : "";
                var vendor_Findings = angular.isDefined(obj.findings) ? obj.findings : 0;
                var vendor_Category = angular.isDefined(obj.category) ? obj.category : "";
                newObj.push([vendor_Category, obj.name, yesStr, noStr, vendor_Findings, vendor_comment]);
                num++;
            });

            data.commonData = {
                data: newObj,
                font: {name: 'Calibri', sz: '11', family: '2', scheme: '-'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                fill: {type: 'solid', fgColor: 'd1daed'},
                wrap: 'true',
                height: 30,
                srow: 10,
                scol: 1
            };

            data.cols = 7;
            data.rows = num * 1 + 5;

            var wval = [25, 100, 10, 10, 15, 25];
            data.widths = [];
            for (var i = 0; i < wval.length; i++) {
                data.widths.push({col: +i + 1, width: wval[i]});
            }

            VendorService.DownloadExcel(data).then(function (response) {
                location.assign('/downloadExcel/' + response.data);
            }).catch(function (error) {
                alert('error!');
            });
        };
    }

})();