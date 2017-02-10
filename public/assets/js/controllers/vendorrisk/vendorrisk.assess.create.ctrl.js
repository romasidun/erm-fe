(function () {
    'use strict';
    VendorAssessmentController.$inject = ['$rootScope','$scope', '$state', 'VendorService', 'Utils', 'ExcelFactory', '$timeout'];
    app.controller('VendorAssessmentCtrl', VendorAssessmentController);
    function VendorAssessmentController($rootScope, $scope, $state, VendorService, Utils, ExcelFactory, $timeout) {
        $scope.mainTitle = $state.current.title;
        VendorService.GetRimById($state.params.id).then(function(data){
            data.approvedDate = new Date(data.approvedDate);
            $scope.approvedDate = Utils.GetDPDate(data.approvedDate);
            $scope.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            $scope.VM = data;
            $rootScope.app.Mask = false;

            VendorService.GetVendor().then(function(data){
                var selectedVendor = data.filter(function(a){
                    return a.vendorName == $scope.VM.vendorName;
                });

                $scope.vendor = selectedVendor[0];
                console.log($scope.vendor);
            });
        });

        $scope.downloadExcel = function(){
            var head_row = $('table.VendorAssessment thead tr');
            var body_row = $('table.VendorAssessment tbody tr');
            var head_row_col = head_row.children('th');
            var tableHtml = '<table>';
            tableHtml += '<tr>';
            head_row_col.each(function (i) {
                tableHtml += '<td>' + $(this).text() + '</td>';
            });
            tableHtml += '</tr>';

            body_row.each(function (i) {
                tableHtml += '<tr>';
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (i) {
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

        var vm = this;
        $scope.vendorResponseVal =  function(para, ele, event){
            if($(event.target).prop('checked') == true){
                $(event.target).prop('checked', true);
                $(event.target).parent('td').siblings('.res').children('input:checkbox').prop('checked', false);
            }
        };

        function getAssessment() {
            var AssessmentData = VendorService.GetAssessmentData();
            console.log('AssessmentData',AssessmentData);
            vm.Vendor_data_selected = angular.fromJson(AssessmentData.Vendor_data_selected);
            vm.Vendor_data_title = AssessmentData.Enter_title;
            vm.AssessmentData_by_vendorName = angular.fromJson(AssessmentData.AssessmentData_by_vendorName);
            vm.amdata_by_filter = angular.fromJson(AssessmentData.AssessmentData_by_vendorName);
            vm.vendorrisk = [];
            VendorService.GetVendorAssessment(AssessmentData.RiskAssessmentType_selected.riskType).then(function (response) {
                vm.vendorrisk = angular.fromJson(response);
                $rootScope.app.Mask = false;
            });
        }

        $scope.saveVendorData = function() {
            var date = new Date();
            var current_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            var current_user = $('.dropdown.current-user .username').text();
            var vendor_docType = vm.amdata_by_filter.docType;
            var vendor_riskScore = vm.amdata_by_filter.riskScore;
            var vendor_riskType = vm.amdata_by_filter.vendorRiskType;
            var vendor_contact = vm.amdata_by_filter.vendorContact;
            var vendor_id = vm.amdata_by_filter.id;
            var vendor_name = vm.amdata_by_filter.vendorName;
            for(var i in vm.vendorrisk){
                var vendor_response = "NA";
                if(vm.vendorrisk[i].responseN == false && vm.vendorrisk[i].responseY == false){
                    vendor_response = "NA";
                }
                if(vm.vendorrisk[i].responseN == true){
                    vm.vendorrisk[i].responseY = false;
                    vendor_response = "N";
                }
                if(vm.vendorrisk[i].responseY == true){
                    vm.vendorrisk[i].responseN = false;
                    vendor_response = "Y";
                }
                var vendor_comment = angular.isDefined(vm.vendorrisk[i].comments) ? vm.vendorrisk[i].comments : "";
                var vendor_Findings = angular.isDefined(vm.vendorrisk[i].findings) ? vm.vendorrisk[i].findings : 0;
                var vendor_Category = angular.isDefined(vm.vendorrisk[i].category) ? vm.vendorrisk[i].category : "";

                $rootScope.app.Mask = false;
                var post_data = {
                    "approvedDate": current_date,
                    "approver": current_user,
                    "comments": vendor_comment,
                    "control_Category": vendor_Category,
                    "docType": vendor_docType,
                    "findings": vendor_Findings,
                    "response": vendor_response,
                    "riskScore": vendor_riskScore,
                    "riskTypes": vendor_riskType,
                    "vendorContact": vendor_contact,
                    "vendorId": vendor_id,
                    "vendorName": vendor_name
                };
                    // title
                    // Period
                    // Approval Status
                    // Approved Ddate
                    // Version
                    // Assessments date
                    // Assessment By
                    // Email/Link
                    // Aggregated Risk Score
                    // Overall Risk Score
                VendorService.PostVendorData(post_data).then(function () {
                    $rootScope.app.Mask = false;
                })
            }
        }

        function initFunc() {
            getAssessment();
        }

        initFunc();
    }

})();