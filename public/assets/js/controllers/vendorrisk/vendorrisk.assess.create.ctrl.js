(function () {
    'use strict';
    VendorAssessmentController.$inject = ['$rootScope', '$scope', '$state', 'VendorService', 'Utils', 'ExcelFactory', '$timeout'];
    app.controller('VendorAssessmentCtrl', VendorAssessmentController);
    function VendorAssessmentController($rootScope, $scope, $state, VendorService, Utils, ExcelFactory, $timeout) {
        $scope.mainTitle = $state.current.title;
        var asId = $state.params.asId;
        var vrId = $state.params.vrId;

        VendorService.GetRimById(asId).then(function (data) {
            $rootScope.app.Mask = true;
            $scope.VM = data;
            data.approvedDate = new Date(data.approvedDate);
            $scope.VM.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.VM.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);

            return VendorService.GetVendorById(vrId);

        }).then(function (data) {
            $scope.vendor = data;
            return VendorService.GetVendorAssessment($scope.VM.vendorRiskType);
        }).then(function (data) {
            $scope.vrStinfoCT = data;
            $rootScope.app.Mask = false;
        });

        $scope.vendorResponseVal = function (para, ele, event) {
            if ($(event.target).prop('checked') == true) {
                $(event.target).prop('checked', true);
                $(event.target).parent('td').siblings('.res').children('input:checkbox').prop('checked', false);
            }
        };

        $scope.downloadExcel = function () {
            var head_row = $('table.VendorAssessment thead tr');
            var body_row = $('table.VendorAssessment tbody tr');
            var head_row_col = head_row.children('th');
            var tableHtml = '<table>';
            tableHtml += '<tr>';
            head_row_col.slice(0, head_row_col.length - 4).each(function (i) {
                tableHtml += '<td>' + $(this).text() + '</td>';
            });
            tableHtml += '</tr>';

            body_row.each(function (i) {
                tableHtml += '<tr>';
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (j) {
                    if (j > tdObj.length - 2) {
                        return;
                    }
                    tableHtml += '<td>' + $(this).text() + '</td>';
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';
            var exportHref = ExcelFactory.tableToExcel(tableHtml, 'sheet1');
            $timeout(function () {
                location.href = exportHref;
            }, 100);
        };

        $scope.saveVendorData = function () {
/*            var date = new Date();
            var current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            var current_user = $('.dropdown.current-user .username').text();*/
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
                    assessmentId: asId,
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
                    $rootScope.app.Mask = false;
                })
            });

            /*for (var i in $scope.vrStinfoCT) {
                /!*var post_data = {
                    comments: vendor_comment + "",
                    control_Category: vendor_Category + "",
                    docType: $scope.VM.docType + "",
                    finding: vendor_Findings,
                    response: vendor_response + "",
                    riskScore: $scope.VM.riskScore * 1,
                    riskType: $scope.VM.vendorRiskType + "",
                    vendor: {
                        id: $scope.vendor.id + "",
                        primaryContact: $scope.vendor.primaryContact + "",
                        vendorName: $scope.vendor.vendorName + ""
                    }
                };*!/
            }*/
        }

        $scope.goBack = function () {
            $state.go('app.vendorrisk.stinfo.update', {id: asId});
        }
    }

})();