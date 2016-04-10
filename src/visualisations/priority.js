angular.module('project')
.controller('PriorityController', ['$scope', function($scope) {
    $scope.processesAutoIncrement = 0;
    $scope.process = {
        'priority': 0,
        'burst_time': 0
    };
    $scope.processes = [];
    $scope.schedule = [];

    $scope.createProcess = function(formProcess) {
        $scope.processesAutoIncrement++;
        var process = {};
        process.name = 'P' + $scope.processesAutoIncrement;
        process.priority = formProcess.priority;
        process.burst_time = formProcess.burst_time;
        $scope.processes.push(process);
        $scope.processes.sort(function(a,b) {
            if (a.priority === b.priority) {
                return a.burst_time > b.burst_time ? 1 : -1;
            }
            return a.priority > b.priority ? 1 : -1;
        });

        //$scope.createSchedule(process, $scope.processes.length - 1);
        $scope.generateSchedule();
        $scope.resetProcess();
    };
    $scope.generateSchedule = function() {
        // reset what's done
        $scope.dropSchedule();

        // generate a new one
        for(var key in $scope.processes) {
            var process = $scope.processes[key];
            if (!$scope.schedule.length) {
                $scope.schedule.push({
                    'name': process.name,
                    'start_time' : 0,
                    'end_time' : 0 + process.burst_time
                });
            } else {
                var lastSchedule = $scope.schedule[$scope.schedule.length - 1];
                $scope.schedule.push({
                    'name': process.name,
                    'start_time' : lastSchedule.end_time,
                    'end_time' : lastSchedule.end_time + process.burst_time
                });
            }
        }
        // reset total scheduled seconds
        $scope.updateSeconds();
    };

    $scope.resetProcess = function() {
        $scope.process.priority = 0;
        $scope.process.burst_time = 0;
    };

    $scope.dropProcesses = function() {
        // while not empty process list
        while($scope.processes.length) {
            // remove process
            $scope.processes.pop();
        }
        // reset autoincrement
        $scope.processesAutoIncrement = 0;

        $scope.dropSchedule();
    };

    $scope.dropSchedule = function() {
        // while not empty process list
        while($scope.schedule.length) {
            // remove process
            $scope.schedule.pop();
        }
        // reset total scheduled seconds
        $scope.updateSeconds();
    };


    $scope.fillProcessesWithTestData = function() {
        for(var key = 0; key < 5; key++) {
            $scope.createProcess({
                priority: Math.floor((Math.random() * 10) + 1),
                burst_time: Math.floor((Math.random() * 5) + 1)
            });

        }
    };

    $scope.updateSeconds = function() {
        if (!$scope.schedule.length) {
            $scope.seconds = 0;
            $scope.secondsRange = [];
        } else {
            $scope.seconds = $scope.schedule[$scope.schedule.length - 1].end_time;
            $scope.secondsRange = _.range(0,$scope.seconds + 1);
        }
    };
}]);