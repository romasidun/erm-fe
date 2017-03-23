(function () {
    AuditUpdateTopicController.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$uibModal', '$filter', 'AuditService', 'Utils'];
    app.controller('AuditUpdate_TopicCtrl', AuditUpdateTopicController);

    function AuditUpdateTopicController($scope, $stateParams, $rootScope, $state, $uibModal, $filter, AuditService, Utils) {
        var vm = this;
        vm.mainTitle = $state.current.title;
        vm.mainDesc = "Update Audit Topic";
        var topic_id = $stateParams.topic_id;
        vm.topic_id = topic_id;
        var audit_id = '';

        $rootScope.app.Mask = true;

        vm.OpList = [5, 10, 25, 50, 100];
        vm.Grid1 = {
            PerPage: 10,
            CurrPage: 1,
            Column: 'findingName',
            IsAsc: true,
            Filter: "",
            Total: 0,
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

        AuditService.GetEachTopic(topic_id).then(function (res) {
            audit_id = res.auditId;
            vm.formdata = res;
            return AuditService.GetEachAudit(audit_id)
        }).then(function(data){
            vm.auditName = data.auditName;
            return AuditService.GetFindingByTopic(topic_id);
        }).then(function (data) {
            vm.Grid1.Total = data.length;
            vm.Grid1.Data = data;

            $rootScope.app.Mask = false;
        });

        vm.submitAction = function(){
            if(vm.Form.addTopic.$invalid) return false;
            console.log(vm.formdata);
            // return;
            $rootScope.app.Mask = true;
            // var dtype = 'YYYY-MM-DD';
            // var d1 = moment(vm.formdata.dateOccurance);
            // var d2 = moment(vm.formdata.dueDate);
            // vm.formdata.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
            // vm.formdata.dueDate = (d2.isValid()) ? d2.format(dtype) : '';
            // console.log(vm.formdata);
            var fileModel = vm.formdata.topicfileModel;
            var d = new Date();
            var idd = 'Top' + d.getTime();
            AuditService.FileUpload(idd, fileModel).then(function(res){
                if(res.status === 200) {
                    for (var i in fileModel) {
                        fileModel[i].id = res.data.fileId;
                        fileModel[i].filePath = res.data.path;
                    }
                }
            }).finally(function () {
                var topic_id = "";
                console.log('vm.formdata',vm.formdata);
                // return;
                AuditService.AddTopic(vm.formdata).then(function (res) {
                    console.log('res',res);
                    topic_id = res.data.id
                }).finally(function () {
                    $rootScope.app.Mask = false;
                    $state.go('app.audit.update_audit', {audit_id: audit_id});
                });
            });
        };

        vm.cancelAction = function () {
            if (vm.Form.addTopic.$dirty) {
                var confirm = Utils.CreateConfirmModal("Confirmation", "Do you want to cancel and if yes you should go back to previous screen", "Yes", "No");
                confirm.result.then(function () {
                    $state.go('app.audit.update_audit', {audit_id: audit_id});
                });
                return false;
            }
            $state.go('app.audit.update_audit', {audit_id: audit_id});
        };
    }
})();