(function () {
    'use strict';

    angular
        .module(HygieiaConfig.module)
        .controller('productEnvironmentCommitController', productEnvironmentCommitController);

    productEnvironmentCommitController.$inject = ['modalData', '$modalInstance'];
    function productEnvironmentCommitController(modalData, $modalInstance) {
        /*jshint validthis:true */
        var ctrl = this;

        var stageData = modalData.team.stages[modalData.stage];
        if(!stageData) {
            swal({
                title: "No data",
                text: "Unable to find data for the provided stage",
                type: "error",
                closeOnConfirm: true
            }, function() {
                $modalInstance.close();
            });

            return;
        }

        // set data
        ctrl.stages = _(modalData.stages).filter(function(stage) { return stage != 'PROD'}).value();
        ctrl.displayTeamName = modalData.team.customName || modalData.team.name;
        ctrl.currentStageName = modalData.stage;
        ctrl.totalCommits = stageData.summary.commitsInsideTimeframe + stageData.summary.commitsOutsideTimeframe;

        ctrl.headingPieData = {
            labels: ['',''],
            series: [
                stageData.summary.commitsInsideTimeframe / ctrl.totalCommits,
                stageData.summary.commitsOutsideTimeframe / ctrl.totalCommits
            ]
        };

        ctrl.headingPieOptions = {
            donut: true,
            donutWidth: 6
        };

        ctrl.commits = _(stageData.commits).sortBy('timestamp').value();

        // methods
        ctrl.toggleCommitDetails = toggleCommitDetails;
        ctrl.viewCommitInRepo = viewCommitInRepo;
        ctrl.getCommitDisplayAge = function(commit) {
            return moment(commit.timestamp).dash('ago');
        };
        ctrl.getCommitStageTimeDisplay = function(commit, stage) {
            if(!commit.in || !commit.in[stage]) {
                return '';
            }

            var time = moment(commit.in[stage]),
                days = time.days(),
                hours = time.hours(),
                minutes = time.minutes();

            if (days > 0) {
                return days + 'd';
            }
            else if (hours > 0) {
                return hours + 'h';
            }
            else if (minutes > 0) {
                return minutes + 'm';
            }

            return '< 0m';
        };

        function toggleCommitDetails(index) {
            ctrl.commits[index].expanded = !ctrl.commits[index].expanded;
        }

        function viewCommitInRepo(commit, $event) {
            alert(commit);
            $event.stopPropagation();
            //window.open(url);
        }
    }
})();