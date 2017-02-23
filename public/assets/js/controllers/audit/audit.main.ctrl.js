(function () {
    AuditMainController.$inject = ['$scope', '$rootScope', '$state', 'AuditService', 'ChartFactory', 'Utils', '$filter'];
    app.controller('AuditMainCtrl', AuditMainController);

    function AuditMainController($scope, $rootScope, $state, AuditService, ChartFactory, Utils, $filter) {
        // $('.Audit_Main_Table').DataTable();

        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "AUDIT MANAGEMENT";
        $scope.ObjectData = [];
        $scope.table = null;

        $(document).on('click', 'table.Audit_Main_Table div.table_actions .deleteButton', function(){
            $scope.ObjectData = [];
            var r = $(this).parent('div.table_actions').attr('id');
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
            confirmation.result.then(function () {
                console.log("U chose Yes");
                $rootScope.app.Mask = true;
                AuditService.DeleteAudit(r).then(function (data) {
                    if (data.status === 200) window.location.reload();
                });
            });
        });

        $('table.Audit_Main_Table tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = $scope.table.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( TopicTable(row.data()) ).show();
                tr.addClass('shown');
                var Audit_id = $(row.selector.rows).children().last().children('div').attr('id');
                console.log(Audit_id)
                AuditService.GetTopic(Audit_id).then(function(data){
                    console.log('datadatadatadatadatadata',data);
                })
            }
        } );

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
                $scope.ObjectData = [];
                AuditService.GetAudits()
                    .then(function (datas){
                        $scope.ObjectData = datas;
                        var dtype = 'MM-DD-YYYY';
                        $scope.ObjectData.forEach(function (r) {
                            r.action = '<div class="table_actions" id=' + r.id + ' ><a class="btn editButton btn-xs btn-squared btn-dark-azure"><i class="ti-pencil"></i></a><a class="btn btn-xs btn-squared btn-red deleteButton"><i class="ti-trash"></i></a></div>';
                            var d1 = moment(r.dateOccurance);
                            r.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
                            r.dateOccurance = Utils.createDate(r.dateOccurance) + "";
                            var split = r.dateOccurance.split(' ');
                            r.dateOccurance = split[1] + " " + split[2] + " " + split[3];
                        });

                        $scope.table = $('.Audit_Main_Table').DataTable( {
                            "data": $scope.ObjectData,
                            "columns": [
                                {
                                    "className": 'details-control',
                                    "orderable": false,
                                    "data": null,
                                    "defaultContent": 'X'
                                },
                                {data: "auditName"},
                                {data: "region"},
                                {data: "department"},
                                {data: "dateOccurance"},
                                {data: "resUserName"},
                                {data: "priority"},
                                {data: "auditStatus"},
                                {data: "action"}
                            ],
                            "aaSorting" : []
                        } );
                        $rootScope.app.Mask = false;
                    });
            };

        function TopicTable ( d ) {
            // `d` is the original data object for the row
            return '<table style="width: 100%;" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class="table-striped table-bordered table-hover nested_table">' +
                        '<thead>' +
                            '<tr>' +
                                '<td> Topic Names </td>' +
                                '<td> Occur Date </td>' +
                                '<td> Responsilbe </td>' +
                                '<td> Status </td>'+
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '</tbody>' +
                    '</table>';
        }
    }
})();