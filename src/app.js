/**
 * Created by bogdans on 3/31/16.
 */
// define application
var project = angular.module('project', [
    'ngRoute'
]);

project.config(['$routeProvider',
function($routeProvider) {
    $routeProvider.
    when('/homepage', {
        templateUrl: '/homepage.html',
        controller: 'HomepageController'
    }).
    when('/about', {
        templateUrl: '/about.html',
        controller: 'AboutController'
    }).
    when('/collaborators', {
        templateUrl: '/collaborators.html',
        controller: 'CollaboratorsController'
    }).
    when('/visualisations', {
        templateUrl: '/visualisations.html',
        controller: 'VisualisationsController'
    }).
    when('/visualisations/first-come-first-served', {
        templateUrl: '/visualisations/first-come-first-served.html',
        controller: 'FirstComeFirstServedController'
    }).
    when('/visualisations/shortest-job-first', {
        templateUrl: '/visualisations/shortest-job-first.html',
        controller: 'ShortestJobFirstController'
    }).
    when('/visualisations/round-robin', {
        templateUrl: '/visualisations/round-robin.html',
        controller: 'RoundRobinController'
    }).
    when('/visualisations/priority', {
        templateUrl: '/visualisations/priority.html',
        controller: 'PriorityController'
    }).
    otherwise({
        redirectTo: '/homepage'
    });
}]);