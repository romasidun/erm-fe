(function () {
    RepoController.$inject = ['$scope', '$rootScope', '$state', 'ControlService', 'Utils', 'ExcelFactory', '$timeout'];
    app.controller('RepoCtrl', RepoController);

    function RepoController($scope, $rootScope, $state, ControlService, Utils, ExcelFactory, $timeout) {
        $scope.mainTitle = $state.current.title;
        $scope.mainDesc = "Add Edit Search Delete & Download Controls";

        $scope.CurrCol = 'riskName';
        $scope.IsAsc = true;

        $scope.OpList = [10, 25, 50, 100];
        $scope.PerPage = 10;

        $scope.$watch('PerPage', function (n, o) {
            $rootScope.app.Mask = true;
            loadRepos();
        });

        $scope.sortMe = function (col) {
            if ($scope.CurrCol === col)
                $scope.IsAsc = !$scope.IsAsc;
            else
                $scope.CurrCol = col;
        };

        $scope.resSort = function (col) {
            if ($scope.CurrCol === col) {
                return $scope.IsAsc ? 'fa-sort-up' : 'fa-sort-down';
            } else {
                return 'fa-unsorted';
            }
        };

        $scope.delete = function (r) {
            var confirmation = Utils.CreateConfirmModal("Confirm Deletion", "Are u sure you want to delete the seleced item?", "Yes", "No");
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
                $scope.Repos = data;
                $rootScope.app.Mask = false;
            });
        }

        $scope.selectAll = function () {
            var chk = $scope.all_check;
            $('.table>tbody').find('input:checkbox').each(function (i) {
                this.checked = chk;
            });
        }

        $scope.do_download = function (e) {
            var checkedRow = $('.table>tbody').find('input:checkbox:checked');
            if (checkedRow.length < 1) {
                alert('Please select at least one record');
                return;
            }
            var tableHtml = '<table>';
            tableHtml += '<tr>';
            $('.table>thead>tr').find('th').slice(1, 7).each(function (i) {
                tableHtml += '<td>' + $(this).html() + '</td>';
            });
            tableHtml += '</tr>';

            checkedRow.each(function (i) {
                tableHtml += '<tr>';
                var tdObj = $(this).closest('tr').find('td');
                tdObj.each(function (i) {
                    tableHtml += '<td>' + $(this).html() + '</td>';
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table>';
            var exportHref = ExcelFactory.tableToExcel(tableHtml, 'sheet1');
            $timeout(function () {
                location.href = exportHref;
            }, 100); // trigger download
            /*window.open('data:application/vnd.ms-excel,'+tableHtml);
            e.preventDefault();*/
        }
    }
})();