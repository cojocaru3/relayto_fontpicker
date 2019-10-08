'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /FontPicker when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/FontPicker");
  });


  describe('FontPicker', function() {

    beforeEach(function() {
      browser.get('index.html#!/FontPicker');
    });


    it('should render FontPicker when user navigates to /FontPicker', function() {
      expect(element.all(by.css('[ng-view] .preview-label')).first().getText()).
        toMatch(/Text to preview/);
    });

  });
});
