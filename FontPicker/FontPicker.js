'use strict';

const GOOGLE_FONTS_API_KEY = 'AIzaSyDC83sH4A4hXAVwH0I9go22peI9zFR2isY';

angular.module('myApp.FontPicker', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/FontPicker', {
    templateUrl: 'FontPicker/FontPicker.html',
    controller: 'FontPickerCtrl'
  });
}])

.controller('FontPickerCtrl', function($scope, $http) {

  /**
   * Filter values
   */
  $scope.filters = {
    keyword: '',
  };

  $scope.modifiers = {
    fontSize: '18px'
  };

  $scope.fontsRequestCompleted = false;
  $scope.fontsCollection = [];
  $scope.filteredFonts = [];

  $scope.previewText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod ac massa in suscipit. Donec ac pharetra nisi. Vestibulum vel turpis imperdiet, feugiat metus ac, eleifend massa.';

  /**
   * Pagination config
   */
  $scope.currentPage = 1;
  $scope.fontsPerPage = 18;

  /**
   * Selected font
   */
  $scope.selectedFont = null;

  $http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=' + GOOGLE_FONTS_API_KEY)
        .then(async (response) => {
          $scope.fontsCollection = response.data.items;
          $scope.filteredFonts = response.data.items.slice(0, $scope.fontsPerPage);
          $scope.fontsRequestCompleted = true;

          $scope.pagesCount = Math.ceil(parseInt($scope.fontsCollection.length) / $scope.fontsPerPage);
          var pages = [];
          for(var i = 1; i <= $scope.pagesCount; i++) {
            pages.push(i);
          }
          $scope.pages = pages;

          await createImports($scope.filteredFonts);
  })


  /**
   * User has selected a font
   */
  $scope.selectFont = function(font) {
    $scope.selectedFont = font;
  }

  /**
   * Navigate to a page
   */
  $scope.goToPage = function(pageNumber) {
    $scope.currentPage = pageNumber;
    var toSkip = parseInt(pageNumber * $scope.fontsPerPage);
    var toStopAt = toSkip + $scope.fontsPerPage;

    $scope.filteredFonts = $scope.fontsCollection.slice(toSkip, toStopAt);
    createImports($scope.filteredFonts);

    // perform some clean-up.
  }

  /**
   * Go to next page
   */
  $scope.nextPage = function() {
    if($scope.currentPage < $scope.pagesCount) {
      $scope.goToPage($scope.currentPage + 1);
    }
  }

  /**
   * Go to previous page
   */
  $scope.previousPage = function() {
    if($scope.currentPage > 1) {
      $scope.goToPage($scope.currentPage - 1);
    }
  }

  /**
   * Filter by keyword
   */
  $scope.filterByKeyword = function() {
    $scope.filteredFonts = $scope.fontsCollection.filter(function(item){
      return item.family.indexOf($scope.filters.keyword) !== -1;
    });

    createImports($scope.filteredFonts);
  }
});

/**
 * Create css @import rules for provided list of fonts.
 * 
 * @param {Array} fonts 
 */
async function createImports(fonts) {

  var existingNode = document.querySelector('#dynamic-fonts-styles');
  
  if(existingNode !== null) {
    existingNode.parentNode.removeChild(existingNode);
  }

  var css = '';
  fonts.forEach(function(font, i){
    console.log(font);
    css += `@import url('https://fonts.googleapis.com/css?family=${encodeURIComponent(font.family)}');`;
  });

  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.id = 'dynamic-fonts-styles';
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
}

function paginateResults(items, currentPage, fontsPerPage) {

}