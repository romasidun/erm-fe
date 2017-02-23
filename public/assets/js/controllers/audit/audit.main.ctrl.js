(function () {
    AuditMainController.$inject = ['$scope', '$rootScope', '$state', 'AuditService', 'ChartFactory', 'Utils', '$filter'];
    app.controller('AuditMainCtrl', AuditMainController);

    function AuditMainController($scope, $rootScope, $state, AuditService, ChartFactory, Utils, $filter) {
        // $('.Audit_Main_Table').DataTable();

        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "AUDIT MANAGEMENT";
        // $scope.TopicToggleVal = false;

        // $scope.TopicToggle = function(item, topicId){
        //     $scope.TopicToggleVal = $scope.TopicToggleVal ? false : true;
        //     console.log('$scope.TopicToggleVal',$(item).parent('tr'));
        // };

        // $scope.OpList = [5, 10, 25, 50, 100];
        // $scope.VM = {
        //     PerPage: 10,
        //     CurrPage: 1,
        //     Column: 'riskName',
        //     IsAsc: true,
        //     Filter: "",
        //     Total: 0,
        //     Data: [],
        //     SortMe: function(col){
        //         if($scope.VM.Column === col)
        //             $scope.VM.IsAsc = !$scope.VM.IsAsc;
        //         else
        //             $scope.VM.Column = col;
        //     },
        //     GetIco: function(col){
        //         if($scope.VM.Column === col){
        //             return $scope.VM.IsAsc? 'fa-sort-up' : 'fa-sort-down';
        //         } else {
        //             return 'fa-unsorted';
        //         }
        //     }
        // };
        // $scope.$watch('VM.Filter', function(n, o){
        //     var searchedData = $filter('filter')($scope.VM.Data, $scope.VM.Filter);
        //     $scope.VM.Total = searchedData.length;
        // });

        AuditService.GetManageDept()
            .then(function (data) {
                ChartFactory.CreateDepartMentChart('Management Department', 'Audit Management Department', data, 'audit_MGDeptChart');
                return AuditService.GetFindingOpen();
            })
            .then(function (data) {
                ChartFactory.CreateFindingChart('By FindingOpen', data, audit_FDOpenChart);
                return AuditService.GetManageStatus();
            })
            .then(function (data) {
                ChartFactory.CreateStatusChart('Management Status', 'Management Status', data, 'audit_MGStatus');
                return AuditService.GetManagePeriod();
            })
            .then(function (data) {
                ChartFactory.CreatePeriodChart('By FindingOpen', data, 'audit_MGPeriod');
                return AuditService.GetManageRegion();
            })
            .then(function (data) {
                ChartFactory.CreateRegionChart(data, 'openFinding_periodChart', $filter );
                return AuditService.GetActionStatus();
            })
            .then(function (data){
                ChartFactory.CreateStatusChart('By Status', 'action status', data, 'status_department');
                loadData();
            });

            var loadData = function(){
                AuditService.GetAudits()
                    .then(function (data){
                        data.forEach(function (r) {
                            r.dueDate = new Date(r.dateOccurance);
                        });
                        console.log('datadatadatadatadata',data);
                        // $scope.VM.Total = data.length;
                        $rootScope.app.Mask = false;
                        $scope.VM.Data = data;
                    });
            };
    }
})();