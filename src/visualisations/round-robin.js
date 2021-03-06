angular.module('project')
.controller('RoundRobinController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.processesAutoIncrement = 0;
    $scope.process = {
        'arrival_time': 0,
        'burst_time': 0
    };
    $scope.timeQuantum = 2;
    $scope.processes = [];
    $scope.schedule = [];
    $scope.myAnimation = null;

    $scope.createProcess = function(formProcess) {
        $scope.processesAutoIncrement++;
        var process = {};
        process.name = 'P' + $scope.processesAutoIncrement;
        process.arrival_time = formProcess.arrival_time;
        process.burst_time = formProcess.burst_time;
        $scope.processes.push(process);
        $scope.processes.sort(function(a,b) {
            return a.arrival_time > b.arrival_time ? 1 : -1;
        });

        //$scope.createSchedule(process, $scope.processes.length - 1);
        $scope.generateSchedule();
        $scope.resetProcess();
    };

    $scope.stopScheduleGeneration = function() {
        if ($scope.myAnimation) {
            $timeout.cancel($scope.myAnimation);
        }
    };

    $scope.generateSchedule = function(delay) {

        // reset what's done
        $scope.dropSchedule();

        // drop animation
        $scope.myAnimation = null;

        // get total amount of seconds
        $scope.seconds = 0;

        var lastProcess = _.max($scope.processes, function(process) {
            return process.arrival_time + process.burst_time;
        });
        var secondsForExecution = $scope.processes
            ? lastProcess.arrival_time + lastProcess.burst_time
            : 0;

        // generate
        $scope.generateScheduleRecursively(secondsForExecution, delay ? 1000 : 0);
    };

    $scope.generateScheduleRecursively = function(secondsForExecution, timeoutInSeconds) {

        // get second
        var second = $scope.seconds;

        // check each process state
        for(var key in $scope.processes) {
            var process = $scope.processes[key];
            // detect processes that start
            if (process.arrival_time === second) {
                var lastSchedule = $scope.schedule.length ? $scope.schedule[$scope.schedule.length - 1] : null;
                var startTime = lastSchedule ? (process.arrival_time < lastSchedule.end_time ? lastSchedule.end_time : process.arrival_time) : second;
                // put process in schedule
                $scope.schedule.push({
                    name: process.name,
                    start_time: startTime,
                    end_time: startTime + ($scope.timeQuantum < process.burst_time ? $scope.timeQuantum : process.burst_time),
                    burst_time_left: process.burst_time - ($scope.timeQuantum < process.burst_time ? $scope.timeQuantum : process.burst_time)
                });
            }
        }

        // check ending processes
        for(var key in $scope.schedule) {
            var schedule = $scope.schedule[key];
            // detect processes that end
            if (schedule.end_time === second && schedule.burst_time_left) {
                var lastSchedule = $scope.schedule[$scope.schedule.length - 1];
                var startTime = schedule.end_time < lastSchedule.end_time ? lastSchedule.end_time : schedule.end_time;
                // put process in schedule
                $scope.schedule.push({
                    name: schedule.name,
                    start_time: startTime,
                    end_time: startTime + ($scope.timeQuantum < schedule.burst_time_left ? $scope.timeQuantum : schedule.burst_time_left),
                    burst_time_left: schedule.burst_time_left - ($scope.timeQuantum < schedule.burst_time_left ? $scope.timeQuantum : schedule.burst_time_left)
                });
            }
        }

        // update waiting times
        for(var key in $scope.processes) {
            var process = $scope.processes[key];
            process.waiting_time = 0;
            for(var scheduleKey in $scope.schedule) {
                var schedule = $scope.schedule[scheduleKey];
                var scheduleWaitingTime = schedule.end_time - (process.arrival_time + process.burst_time);
                if (schedule.name === process.name && (process.waiting_time < scheduleWaitingTime)) {
                    process.waiting_time = scheduleWaitingTime;
                }
            }
        }

        // find max schedule end time
        for(var key in $scope.schedule) {
            var schedule = $scope.schedule[key];
            if (secondsForExecution < schedule.end_time) {
                secondsForExecution = schedule.end_time;
            }
        }

        $scope.seconds++;
        $scope.secondsRange = _.range(0, $scope.seconds);

        if ($scope.seconds <= secondsForExecution) {
            if (timeoutInSeconds) {
                $scope.myAnimation = $timeout(function() {
                    $scope.generateScheduleRecursively(secondsForExecution, timeoutInSeconds);
                }, timeoutInSeconds);
            } else {
                $scope.generateScheduleRecursively(secondsForExecution, timeoutInSeconds);
            }
        } else {
            // update seconds range
            $scope.secondsRangeHeaders = _.range(0, $scope.seconds);
        }
    };

    $scope.isScheduleActive = function(process, second) {
        if ($scope.secondsRange.indexOf(second) === -1) {
            return false;
        }

        for(var key in $scope.schedule) {
            var schedule = $scope.schedule[key];
            if (schedule.name === process.name
                && (second >= schedule.start_time && second < schedule.end_time)
            ) {

                return true;
            }
        }
        return false;
    };

    $scope.isScheduleWaiting = function(process, second) {
        if ($scope.secondsRange.indexOf(second) === -1) {
            return false;
        }

        if ($scope.isScheduleActive(process,second)) {
            return false;
        }

        for(var key in $scope.schedule) {
            var schedule = $scope.schedule[key];
            if (schedule.name === process.name
                && (second >= process.arrival_time && second < schedule.start_time)
            ) {
                return true;
            }
        }
        return false;
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

        // reset total scheduled seconds
        $scope.updateSeconds();
    };

    $scope.dropSchedule = function() {
        // while not empty process list
        while($scope.schedule.length) {
            // remove process
            $scope.schedule.pop();
        }
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
            $scope.secondsRangeHeaders = [];
        } else {
            $scope.seconds = $scope.schedule[$scope.schedule.length - 1].end_time;
            $scope.secondsRange = _.range(0,$scope.seconds + 1);
            $scope.secondsRangeHeaders = _.range(0,$scope.seconds + 1);
        }
    };

}]);