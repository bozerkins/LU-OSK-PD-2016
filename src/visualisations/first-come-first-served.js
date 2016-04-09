angular.module('project')
.controller('FirstComeFirstServedController', ['$scope', function($scope) {
    $scope.template = 'first-come-first-served';

    $scope.processesAutoIncrement = 0;
    $scope.process = {
      'arrival_time': 0,
      'burst_time': 0
    };
    $scope.processes = [];
    $scope.schedule = [];

    $scope.createProcess = function(formProcess) {
        $scope.processesAutoIncrement++;
        var process = {};
        process.name = 'P' + $scope.processesAutoIncrement;
        process.arrival_time = formProcess.arrival_time;
        process.burst_time = formProcess.burst_time;
        $scope.processes.push(process);
        $scope.createSchedule(process, $scope.processes.length - 1);
        $scope.resetProcess();
    };
    $scope.createSchedule = function(process, key) {
      if (!$scope.schedule.length) {
        $scope.schedule.push({
          'name': process.name,
          'arrival_time' : process.arrival_time,
          'start_time' : 0,
          'end_time' : process.burst_time
        });
      } else {
        var lastSchedule = $scope.schedule[$scope.schedule.length - 1];
        $scope.schedule.push({
          'name': process.name,
          'arrival_time' : process.arrival_time,
          'start_time' : lastSchedule.end_time,
          'end_time' : lastSchedule.end_time + process.burst_time
        });
      }
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
      // while not empty process list
      while($scope.schedule.length) {
        // remove process
        $scope.schedule.pop();
      }
      // reset autoincrement
      $scope.processesAutoIncrement = 0;
      // reset total scheduled seconds
      $scope.updateSeconds();
    };

    $scope.fillProcessesWithTestData = function() {
      for(var key = 0; key < 5; key++) {
        $scope.createProcess({
          arrival_time: Math.floor((Math.random() * 10) + 1),
          burst_time: Math.floor((Math.random() * 10) + 1)
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
