angular.module('project')
.controller('ShortestJobFirstController', ['$scope', function($scope) {
    $scope.processesAutoIncrement = 0;
    $scope.process = {
        'arrival_time': 0,
        'burst_time': 0
    };
    $scope.processes = [];
    $scope.schedule = [];

    $scope.getFormula = function() {
        var names = _.map($scope.processes, function(value, key) {
            return value.name;
        });
        return '(' + names.join('+') + ') / ProcessesCount';
    };
    $scope.getEquation = function() {
        var waitingTimeArray = _.map($scope.processes, function(value, key) {
            return value.waiting_time;
        });
        return '(' + waitingTimeArray.join('+') + ') / ' + waitingTimeArray.length;
    };
    $scope.getAverageWaitingTime = function() {
        var waitingTimeArray = _.map($scope.processes, function(value, key) {
            return value.waiting_time;
        });
        return waitingTimeArray.reduce(function(a, b) { return a + b; }, 0) / waitingTimeArray.length;
    };

    $scope.createProcess = function(formProcess) {
        $scope.processesAutoIncrement++;
        var process = {};
        process.name = 'P' + $scope.processesAutoIncrement;
        process.arrival_time = formProcess.arrival_time;
        process.burst_time = formProcess.burst_time;
        $scope.processes.push(process);

        $scope.generateSchedule();
        $scope.resetProcess();
    };
    $scope.generateSchedule = function() {
        // reset what's done
        $scope.dropSchedule();

        // store all process keys into array
        var processesCache = _.map($scope.processes, function(value, key) {
            return key.toString();
        });

        // choose schedule
        while(processesCache.length) {

            var currentStartTime = 0;
            if ($scope.schedule.length) {
                currentStartTime = $scope.schedule[$scope.schedule.length - 1].end_time;
            }

            var minExpectedEndTime = null;
            var minExpectedEndTimeProcessKey = null;

            for(var key in $scope.processes) {
                // skip the process if not in processesCache
                if (processesCache.indexOf(key) === -1) {
                    continue;
                }

                var process = $scope.processes[key];

                // evaluate the process
                var expectedEndTime = currentStartTime < process.arrival_time
                    ? (process.arrival_time + process.burst_time)
                    : (currentStartTime + process.burst_time);

                // check if min expected time
                if (minExpectedEndTime === null || minExpectedEndTime > expectedEndTime) {
                    minExpectedEndTime = expectedEndTime;
                    minExpectedEndTimeProcessKey = key;
                }
            }

            processesCache.splice(processesCache.indexOf(minExpectedEndTimeProcessKey), 1);

            var process = $scope.processes[minExpectedEndTimeProcessKey];
            var schedule = null;

            if (!$scope.schedule.length) {
                schedule = {
                    'name': process.name,
                    'arrival_time' : process.arrival_time,
                    'start_time' : process.arrival_time,
                    'end_time' : process.arrival_time + process.burst_time
                };
            } else {
                var lastSchedule = $scope.schedule[$scope.schedule.length - 1];
                var startTime = process.arrival_time < lastSchedule.end_time ? lastSchedule.end_time : process.arrival_time;
                schedule = {
                    'name': process.name,
                    'arrival_time' : process.arrival_time,
                    'start_time' : startTime,
                    'end_time' : startTime + process.burst_time
                };
            }
            $scope.schedule.push(schedule);
            process.waiting_time = schedule.start_time - process.arrival_time;
        }

        // reset total scheduled seconds
        $scope.updateSeconds();
    };

    $scope.resetProcess = function() {
        $scope.process.arrival_time = 0;
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
                arrival_time: Math.floor((Math.random() * 10) + 1),
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