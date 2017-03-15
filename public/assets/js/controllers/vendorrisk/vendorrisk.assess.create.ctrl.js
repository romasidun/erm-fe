/**
 Desc: Controller for Create and View the Vendor Assessment Data
 author: Roma
 */
(function () {
    'use strict';
    VendorAssessmentController.$inject = ['$rootScope', '$state', 'VendorService', 'Utils', '$filter', 'UniqueID'];
    app.controller('VendorAssessmentCtrl', VendorAssessmentController);
    function VendorAssessmentController($rootScope, $state, VendorService, Utils, $filter, UniqueID) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        var asId = $state.params.asId;
        var vrId = $state.params.vrId;
        var page = $state.params.page;
        vm.page = page;

        VendorService.GetRimById(asId).then(function (data) {
            $rootScope.app.Mask = true;
            vm.assessmentsDate = data.assessmentsDate;
            data.approvedDate = Utils.GetDPDate(data.approvedDate);
            data.assessmentsDate = Utils.GetDPDate(data.assessmentsDate);
            vm.formData = data;
            return VendorService.GetVendorById(vrId);
        }).then(function(re) {
            vm.vendor = re;
            return VendorService.GetVRCollectByVendor(asId, vm.vendor.vendorName);
        }).then(function(re){
            if(angular.isArray(re) && re.length > 0){
                vm.gridData = re;
                vm.data_flag = 'assessment';
                $rootScope.app.Mask = false;
            } else {
                vm.data_flag = 'new';
                VendorService.GetVRCollectionFromControl(vm.formData.vendorRiskType).then(function(re){
                    vm.gridData = re;
                    $rootScope.app.Mask = false;
                });
            }
        }).finally(function (re) {
            if(page === 'email')
                setStatus('Waiting for response');
        });

        vm.saveVendorData = function () {
            $rootScope.app.Mask = true;

            //Vendor Status Update
            if(page === 'email')
                setStatus('Submitted Successfully');

            angular.forEach(vm.gridData, function (obj, ind) {
                var asData = vm.formData;
                if(vm.data_flag === 'new'){
                    var category = obj.category;
                    var rname = obj.name;
                } else {
                    var category = obj.control_Category;
                    var rname = obj.control_Name;
                }
                var sendData = {
                    assessmentDate: vm.assessmentsDate,
                    assessmentDtStr: asData.assessmentDtStr,
                    vraid: asId,
                    comments: obj.comments || '',
                    control_Ref_ID: '',
                    control_Category: category,
                    control_Name: rname,
                    control_Source: asData.vendorRiskType,
                    docType: asData.docType,
                    finding: obj.finding || 0,
                    response: obj.response || '',
                    riskScore: asData.riskScore,
                    riskType: asData.vendorRiskType,
                    riskWeight: 0,
                    status: asData.status,
                    title: asData.title,
                    vendor: vm.vendor
                };
                if(vm.data_flag === 'new') {
                    VendorService.PostVRCollection(sendData).then(function () {
                        if ((vm.gridData.length - 1) === ind) {
                            closeWindow();
                        }
                    });
                } else {
                    VendorService.PutVRCollection(obj.id, sendData).then(function () {
                        if ((vm.gridData.length - 1) === ind) {
                            closeWindow();
                        }
                    });
                }
            });

        };

        function closeWindow(){
            $rootScope.app.Mask = false;
            if(page == 'email'){
                alert('Assessment Submitted Successfully.');
            }
        }

        function setStatus(msg){
            //Vendor Status Update----------------------
            var arr = $filter('filter')(vm.formData.vendors, {id: vrId});
            if(angular.isArray(arr) && arr.length > 0){
                arr[0].statusMsg = msg;
            } else {
                if(vm.vendor.vendorId == null || vm.vendor.vendorId == '')
                    vm.vendor.vendorId = vm.generateId();
                vm.vendor.statusMsg = msg;
                vm.formData.vendors.push(vm.vendor);
            }
            
            /*angular.forEach(vm.formData.vendors, function (item, ind) {
                if(item.id == vrId){
                    console.log(111);
                    item.statusMsg = msg;
                }
            });
*/
            var params = {
                vendors: vm.formData.vendors
            };
            VendorService.PutAseessmentList(asId, params).then(function (res) {

            });
            //-------------------------------------------
        }

        vm.goBack = function () {
            $state.go('app.vendorrisk.stinfo.update', {id: asId});
        };

        vm.generateId = function () {
            var uid = UniqueID.new();
            return uid;
        };

        vm.downloadExcel = function () {
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
                col: 2, row: 3, text: 'Vendor: ' + vm.vendor.vendorName, align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 3, height: 25});

            data.body.push({
                col: 2, row: 4, text: 'Primary Contact: ' + vm.vendor.primaryContact, align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 4, height: 25});

            data.body.push({
                col: 2,
                row: 5,
                text: 'Assessment Date: ' + vm.formData.assessmentsDate + '  Assessment By: ' + vm.formData.assessmentBy,
                align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 5, height: 25});

            data.body.push({
                col: 2,
                row: 6,
                text: 'Doc Title: ' + vm.formData.title + '  Doc Type: Survey' + vm.formData.docType,
                align: 'center',
                font: {name: 'Calibri', sz: '13', family: '3', scheme: '-', bold: 'true'}
            });
            data.heights.push({row: 6, height: 25});

            data.body.push({
                col: 2, row: 7, text: 'Risk Score: ' + vm.formData.riskScore, align: 'center',
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
            angular.forEach(vm.gridData, function (obj, ind) {
                var yesStr = '';
                var noStr = '';
                if (obj.response == 'Y') {
                    yesStr = "Y";
                }
                if (obj.response == 'N') {
                    noStr = "N";
                }
                var vendor_comment = obj.comments || '';
                var vendor_Findings = obj.finding || '';
                var vendor_Category = obj.category || obj.control_Category;
                var name = obj.name || obj.control_Name;
                newObj.push([vendor_Category, name, yesStr, noStr, vendor_Findings, vendor_comment]);
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
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl+ '/downloadExcel/' + response.data);
            }).catch(function (error) {
                console.log('error!');
            });
        };
    }
})();