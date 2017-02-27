(function () {
    AuditMainController.$inject = ['$scope', '$rootScope', '$state', 'AuditService', 'ChartFactory', 'Utils', '$filter'];
    app.controller('AuditMainCtrl', AuditMainController);

    function AuditMainController($scope, $rootScope, $state, AuditService, ChartFactory, Utils, $filter) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "AUDIT MANAGEMENT";
        $scope.Audittable = null;
        $scope.Top = [];
        $scope.topicId = null;
        $scope.auditId = null;

        var headerTemplates = {
            format_level_2: function(rowIdent) {
                // `d` is the original data object for the row - i.e. take finding ID, get JSON and render
                return  '<div class="holder">'+
                    '<table id="'+rowIdent+'" class="topicTable table table-striped table-bordered table-hover nested_table" style="width: 100%;" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class="table-striped table-bordered table-hover nested_table">' +
                        '<thead>' +
                            '<tr>' +
                                '<th> <input type="checkbox"> </th>' +
                                '<th> Topic Names </th>' +
                                '<th> Occur Date </th>' +
                                '<th> Responsilbe </th>' +
                                '<th> Status </th>'+
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '</tbody>' +
                    '</table>' +
                '</div>';
            },
            format_level_2_columns: function(){
                return [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": 'X'
                    },
                    {data: "topicName"},
                    {data: "createdOn"},
                    {data: "resUserName"},
                    {data: "cur_status"}
                ]
            },
            format_level_3: function(rowIdent) {
                // `d` is the original data object for the row - i.e. take finding ID, get JSON and render
                return  '<div class="holder">'+
                            '<table id="'+rowIdent+'" class="FindingTable table table-striped table-bordered table-hover nested_table" style="width: 100%;" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;" class="table-striped table-bordered table-hover nested_table">' +
                                '<thead>' +
                                    '<tr>' +
                                    '<th> <input type="checkbox"> </th>' +
                                    '<th> Topic Names </th>' +
                                    '<th> Occur Date </th>' +
                                    '<th> Responsilbe </th>' +
                                    '<th> Status </th>'+
                                    '</tr>' +
                                    '</thead>' +
                                '<tbody>' +
                                '</tbody>' +
                            '</table>';
                        '</div>'        ;
            },
            format_level_3_columns: function(){
                return [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": 'X'
                    },
                    {data: "findingName"},
                    {data: "createdOn"},
                    {data: "findDesc"},
                    {data: "findStatus"}
                ]
            }
        };

        $(document).on('click', 'table.Audit_Main_Table div.table_actions .deleteButton', function(){
            $scope.AuditData = [];
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

        $('table.Audit_Main_Table').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var tableElem = tr.closest('table');
            var theTable = tableElem.DataTable();
            var row = theTable.row(tr);
            if (row.child.isShown()) {
                row.child.hide();
            }
            else {
                var level = null;
                var d = new Date();
                var newTableId = d.getTime().toString();
                var dataRow = row.data();
                var AssoData = [];

                if($(tableElem).hasClass('topicTable')){
                    $scope.topicId = dataRow.id;
                    level = "3";
                    row.child(headerTemplates['format_level_3']('T'+newTableId)).show();
                    $scope.FindingData.forEach(function(key){
                            console.log('keykey',key);
                            console.log('$scope.topicId',$scope.topicId);
                            console.log('$scope.auditId',$scope.auditId);
                        if(key.topicId == $scope.topicId && key.auditId == $scope.auditId){
                            alert()
                            AssoData.push(key);
                            key.createdOn = Utils.createDate(key.createdOn) + "";
                            var split = key.createdOn.split(' ');
                            key.createdOn = split[1] + " " + split[2] + " " + split[3];
                        }
                    });
                    console.log('AssoDataAssoData',AssoData);
                }
                else{
                    console.log(tr);
                    console.log(dataRow);
                    $scope.auditId = dataRow.id;
                    level = "2";
                    row.child(headerTemplates['format_level_2']('T'+newTableId)).show();

                    $scope.TopicData.forEach(function(key){
                        if(key.auditId == $scope.auditId){
                            AssoData.push(key);
                            key.createdOn = Utils.createDate(key.createdOn) + "";
                            var split = key.createdOn.split(' ');
                            key.createdOn = split[1] + " " + split[2] + " " + split[3];
                            key.cur_status = key.status.statusMsg
                        }
                    })
                }


                var theTable2 = $('#T'+ newTableId).DataTable(
                    {
                        "data": AssoData,
                        "columns": headerTemplates['format_level_' + level + '_columns'](),
                        "order": []
                    }
                )
            }
        });

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
                $scope.AuditData = [];
                $scope.FindingData = [];
                $scope.TopicData = [];
                AuditService.GetAudits()
                    .then(function (datas){
                        $scope.AuditData = datas;
                        var dtype = 'MM-DD-YYYY';
                        $scope.AuditData.forEach(function (r) {
                            console.info(r.id);
                            r.action = '<div class="table_actions" id=' + r.id + ' ><a class="btn editButton btn-xs btn-squared btn-dark-azure"><i class="ti-pencil"></i></a><a class="btn btn-xs btn-squared btn-red deleteButton"><i class="ti-trash"></i></a></div>';
                            var d1 = moment(r.dateOccurance);
                            r.dateOccurance = (d1.isValid()) ? d1.format(dtype) : '';
                            r.dateOccurance = Utils.createDate(r.dateOccurance) + "";
                            var split = r.dateOccurance.split(' ');
                            r.dateOccurance = split[1] + " " + split[2] + " " + split[3];
                        });

                        $scope.Audittable = $('.Audit_Main_Table').DataTable( {
                            "data": $scope.AuditData,
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
                        return AuditService.GetTopics();
                    })
                    .then(function(data){
                       $scope.TopicData = data;
                       return AuditService.GetFindings();
                    })
                    .then(function(data){
                       $scope.FindingData = data;
                       $rootScope.app.Mask = false;
                    });
            };
    }
})();