(function () {
    "use strict";

    ArtifactMgmCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', '$uibModal', 'DynListService', 'Utils'];
    app.controller('ArtifactMgmCtrl', ArtifactMgmCtrl);

    function ArtifactMgmCtrl($scope, $rootScope, $state, $filter, $uibModal, ArtifactService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Artifact Management";

        vm.DynTypeList = [];
        vm.allDynLists = [];

        $rootScope.app.Mask = false;

        vm.OpList = [5, 10, 25, 50, 100];
        vm.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'dylistCode',
            IsAsc: true,
            Filter: "",
            Total: 1,
            Data: [],
            SortMe: function (col) {
                if (vm.Grid1.Column === col)
                    vm.Grid1.IsAsc = !vm.Grid1.IsAsc;
                else
                    vm.Grid1.Column = col;
            },
            GetIco: function (col) {
                if (vm.Grid1.Column === col) {
                    return vm.Grid1.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
                } else {
                    return 'fa-unsorted';
                }
            }
        };
        $scope.$watch('vm.Grid1.Filter', function (n, o) {
            var searchedData = $filter('filter')(vm.Grid1.Data, vm.Grid1.Filter);
            vm.Grid1.Total = searchedData.length;
        });

        vm.doSearch = function () {

        };
    }
})();
