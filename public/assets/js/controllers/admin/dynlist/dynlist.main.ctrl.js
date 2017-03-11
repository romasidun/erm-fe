(function () {
    "use strict";

    DynListMgmCtrl.$inject = ['$scope', '$rootScope', '$state', '$filter', '$uibModal', 'DynListService', 'Utils'];
    app.controller('DynListMgmCtrl', DynListMgmCtrl);

    function DynListMgmCtrl($scope, $rootScope, $state, $filter, $uibModal, DynListService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Dynamic List Management";

        vm.DynTypeList = [];
        vm.allDynLists = [];

        DynListService.Get().then(function (data) {
            vm.allDynLists = data;
            console.log(data);

            return DynListService.GetTypeList();
        }).then(function (data) {
            vm.DynTypeList = data;

            if($state.params.dynTypeCode !== ''){
                var tmpobj = $filter('filter')(vm.DynTypeList, {dylistTypecode : $state.params.dynTypeCode});
                if(angular.isArray(tmpobj)){
                    vm.currDynType = tmpobj[0];
                    vm.dynTypeChange();
                }
            }

            $rootScope.app.Mask = false;
        });

        vm.dynTypeChange = function () {
            if(vm.currDynType === '' || typeof vm.currDynType !== 'object'){
                vm.Grid1.Data = [];
                vm.Grid1.Total = 1;
                return;
            }
            var tmpary = $filter('filter')(vm.allDynLists, {dylistTypecode  : vm.currDynType.dylistTypecode});
            vm.Grid1.Data = tmpary;
            vm.Grid1.Total = tmpary.length;
        };

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

        vm.deleteAction = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                $rootScope.app.Mask = true;
                var rowId = r.id;
                DynListService.Delete(r.id).then(function (data) {
                    if (data.status === 200){
                        for(var i in vm.allDynLists){
                            if(vm.allDynLists[i].id === rowId){
                                delete vm.allDynLists[i];
                                vm.dynTypeChange();
                                $rootScope.app.Mask = false;
                                break;
                            }
                        }
                    }
                });
            });
        };

        vm.goAddForm = function () {
            if(vm.currDynType === '' || typeof vm.currDynType === 'undefined'){
                alert('Please select Dynamic List Type.');
                return;
            }
            $state.go('app.admin.misc.dynlist.add', {dynTypeCode: vm.currDynType.dylistTypecode, dynTypeDesc: vm.currDynType.dylistTypedesc })
        };
    }
})();
