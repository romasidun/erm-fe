(function () {
    'use strict';
    VendorAssessController.$inject = ['$rootScope','$scope', '$state', 'VendorService', 'Utils', 'ExcelFactory', '$timeout'];
    app.controller('VendorAssessCtrl', VendorAssessController);
    function VendorAssessController($rootScope, $scope, $state, VendorService, Utils, ExcelFactory, $timeout) {
        $scope.mainTitle = $state.current.title;

        VendorService.GetRimById($state.params.id).then(function(data){
            $rootScope.app.Mask = true;
            $scope.VM = data;
            data.approvedDate = new Date(data.approvedDate);
            $scope.VM.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.VM.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            VendorService.GetVendor()
                .then(function(data){
                    var selectedVendor = data.filter(function(a){
                        return a.vendorName == $scope.VM.vendorName;
                    });

                    $scope.vendor = selectedVendor[0];
                    return VendorService.GetVendorAssessment($scope.VM.vendorRiskType);
                })
                .then(function(data){
                    $scope.vrStinfoCT = data;
                    $rootScope.app.Mask = false;
                })
        });

        $scope.vendorResponseVal =  function(para, ele, event){
            if($(event.target).prop('checked') == true){
                $(event.target).prop('checked', true);
                $(event.target).parent('td').siblings('.res').children('input:checkbox').prop('checked', false);
            }
        };

        $scope.downloadExcel = function(){
            var head_row = $('table.VendorAssessment thead tr');
            var body_row = $('table.VendorAssessment tbody tr');
            var head_row_col = head_row.children('th');
            var tableHtml = '<table>';
            tableHtml += '<tr>';
            head_row_col.slice(0, head_row_col.length-4).each(function (i) {
                tableHtml += '<td>' + $(this).text() + '</td>';
            });
            tableHtml += '</tr>';

            body_row.each(function (i) {
                tableHtml += '<tr>';
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (j) {
                    if(j > tdObj.length-2){
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

        $scope.saveVendorData = function() {
            var date = new Date();
            var current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            var current_user = $('.dropdown.current-user .username').text();
            for(var i in $scope.vrStinfoCT){
                var vendor_response = "NA";
                if($scope.vrStinfoCT[i].responseN == false && $scope.vrStinfoCT[i].responseY == false){
                    vendor_response = "NA";
                }
                if($scope.vrStinfoCT[i].responseN == true){
                    $scope.vrStinfoCT[i].responseY = false;
                    vendor_response = "N";
                }
                if($scope.vrStinfoCT[i].responseY == true){
                    $scope.vrStinfoCT[i].responseN = false;
                    vendor_response = "Y";
                }
                var vendor_comment = angular.isDefined($scope.vrStinfoCT[i].comments) ? $scope.vrStinfoCT[i].comments : "";
                var vendor_Findings = angular.isDefined($scope.vrStinfoCT[i].findings) ? $scope.vrStinfoCT[i].findings : 0;
                var vendor_Category = angular.isDefined($scope.vrStinfoCT[i].category) ? $scope.vrStinfoCT[i].category : "";
                var post_data = {
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
                };

                VendorService.PostVendorData(post_data).then(function () {
                    $rootScope.app.Mask = false;
                })
            }
        }
    }

})();