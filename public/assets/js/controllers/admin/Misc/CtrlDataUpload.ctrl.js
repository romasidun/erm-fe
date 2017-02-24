(function(){
    CtrlDataUploadController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ITRiskService', 'Utils'];
    app.controller('adminCtrlDataUpload', CtrlDataUploadController);
    function CtrlDataUploadController($scope, $rootScope, $state, $filter, ITRiskService, Utils){
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Control Data Upload";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'riskName',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [
                {
                    "fileName": "ControlData for COBIT and SOX.xls",
                    "uploadedBy": "Alan ",
                    "uploadedOn": "2017-02-24T17:38:05.336Z",
                    "status": "success"
                },
                {
                    "fileName": "ControlData for COBIT and SOX.xls",
                    "uploadedBy": "Alan ",
                    "uploadedOn": "2017-02-24T17:38:05.336Z",
                    "status": "success"
                }
            ],
            SortMe: function(col){
                if($scope.Grid1.Column === col)
                    $scope.Grid1.IsAsc = !$scope.Grid1.IsAsc;
                else
                    $scope.Grid1.Column = col;
            },
            GetIco: function(col){
                if($scope.Grid1.Column === col){
                    return $scope.Grid1.IsAsc? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };

        $scope.VM = {
            fileName: '',
            uploadedBy: '',
            uploadedOn: '',
            status: ''
        };

        $scope.$watch('Grid1.Filter', function(n, o){
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });

        $scope.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                ITRiskService.DeleteRim(r.id).then(function (data) {
                    if (data.status === 200) loadRim();
                });
            });
        };

        $scope.submitAction = function () {
            var filename = ($scope.FileModel[0].fileName + "");
            s = filename.substr(filename.length - 4, filename.length);
            if(s !== ".xls"){
                alert('you must select .xls file!');
                angular.element($('input:file[name = fileupload]')).val('');
                return;
            }
            var current_user = $('.dropdown.current-user .username').text();
            var date = new Date();
            var current_date = Utils.createDate(date);
            $scope.VM.fileName = filename;
            $scope.VM.uploadedBy = current_user;
            $scope.VM.uploadedOn = current_date;
            $scope.VM.status = "success";
            console.log($scope.VM);
            loadPage($scope.VM);
            return;
            var fileModel = $scope.VM.auditFileModel;
            var d = new Date();
            var idd = 'Pol' + d.getTime();
            $scope.VM.key = idd;
            ITRiskService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                ITRiskService.AddRim($scope.VM).then(function (res) {
                    console.log('res',res);
                }).finally(function () {
                    $state.go('app.itrisk.incident.main');
                });
            });
        };

        $scope.cancelAction = function(){
            alert('calcel');
            return;
            if($scope.Form.ITRisk.$dirty){
                var confirm = Utils.CreateConfirmModal("Confirmation", "Are you sure you want to cancel?", "Yes", "No");
                confirm.result.then(function(){
                    $state.go('app.itrisk.incident.main');
                });
                return false;
            }
            $state.go('app.itrisk.incident.main');
        };

        // ITRiskService.GetRim().then(function (data) {
        //     data.forEach(function (r) {
        //         r.IDate = Utils.createDate(r.identifiedDate);
        //     });
        //
        //     $scope.Grid1.Total = data.length;
        //     $scope.Grid1.Data = data;
        //
        // });

        loadPage();
        function loadPage(data){
            if(data){
                $scope.Grid1.Data.push(data);
                console.log($scope.Grid1.Data);
            }
            $rootScope.app.Mask = false;
        }
    }
})();