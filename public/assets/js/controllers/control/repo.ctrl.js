(function () {
    RepoController.$inject = ['$scope', '$rootScope', '$state', '$filter', 'ControlService', 'Utils', '$timeout'];
    app.controller('RepoCtrl', RepoController);

    function RepoController($scope, $rootScope, $state, $filter, ControlService, Utils, $timeout) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Add Edit Search Delete & Download Controls";

        $scope.OpList = [5, 10, 25, 50, 100];
        $scope.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'riskName',
            IsAsc: true,
            Filter: "",
            Total: 0,
            Data: [],
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
        $scope.$watch('Grid1.Filter', function(n, o){
            var searchedData = $filter('filter')($scope.Grid1.Data, $scope.Grid1.Filter);
            $scope.Grid1.Total = searchedData.length;
        });
        loadRepos();

        $scope.delete = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                ControlService.DeleteRepo(r.id).then(function (data) {
                    if (data.status === 200) loadRepos();
                });
            }, function () {
                $rootScope.app.Mask = false;
            });
        };

        function loadRepos() {
            ControlService.GetRepos($scope.PerPage, $scope.CurrPage).then(function (data) {

                $scope.Grid1.Total = data.length;
                $scope.Grid1.Data = data;

                $rootScope.app.Mask = false;
            });
        }

        $scope.selectAll = function () {
            var chk = $scope.all_check;
            angular.forEach($scope.Grid1.Data, function (value, key) {
                value.checked = chk;
            });
        }

        $scope.downloadExcel = function () {
            var data = {};
            data.heights = [];
            data.sheetName = "CONTROL REPOSITORY";
            data.body = [];

            var head_txt = [
                'Control Name',
                'Control Desc',
                'Control Source',
                'Control Category',
                'Control Version',
                'Control Active',
                'Business Process',
                'Sub Process',
                'Start Date',
                'End Date',
                'Control Type',
                'Risk Type',
                'Nature of Control',
                'Control Frequency',
                'Supporting IT Application',
                'Control Owner',
                'Control Test Plan',
                'Control Ref ID',
                'Control Definition'
            ];
            for (var i = 0; i < head_txt.length; i++) {
                data.body.push({
                    col: (+i + 2),
                    row: 3,
                    text: head_txt[i],
                    font: {name: 'Calibri', sz: '11', family: '3', scheme: '-', bold: 'true'},
                    fill: {type: 'solid', fgColor: 'D9D4D1'},
                    border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                    wrap: 'true',
                    align: 'center'
                });
            }
            data.heights.push({row: 3, height: 30});

            var num = 4;
            var newData = $filter('filter')($scope.Grid1.Data, {checked: true});
            if(newData.length < 1){
                alert('Please select at least one record');
                return false;
            }
            var newObj = []
            angular.forEach(newData, function (obj, ind) {
                newObj.push([
                    obj.controlName,
                    obj.controlDescription,
                    obj.controlSource,
                    obj.controlCategory,
                    obj.controlVersionNumber,
                    obj.active,
                    obj.businessProcess,
                    obj.subprocess,
                    obj.controlEffectiveStartdateStr,
                    obj.controlEffectiveEnddateStr,
                    obj.controlType,
                    obj.riskTypes,
                    obj.natureOfControl,
                    obj.controlFrequency,
                    obj.supportingITApplication,
                    obj.controlOwner,
                    obj.controlTestPlan,
                    obj.controlRefID,
                    obj.controlDefinition
                ]);
                num++;
            });

            data.commonData = {
                data: newObj,
                font: {name: 'Calibri', sz: '11', family: '2', scheme: '-'},
                border: {left: 'thin', top: 'thin', right: 'thin', bottom: 'thin'},
                wrap: 'true',
                align: 'center',
                height: 20,
                srow: 4,
                scol: 2
            };

            data.cols = 21;
            data.rows = num * 1 + 2;

            var wval = [10,50, 40, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
            data.widths = [];
            for (var i = 0; i < wval.length; i++) {
                data.widths.push({col: +i + 1, width: wval[i]});
            }

            ControlService.DownloadExcel(data).then(function (response) {
                var nodeUrl = $rootScope.app.NodeApi;
                location.assign(nodeUrl+ '/downloadExcel/' + response.data);
            }).catch(function (error) {
                console.log('error!');
            });
        };
    }
})();