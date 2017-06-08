// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by,  } from 'protractor';
var path = require('path');

describe('Dashboard Page', function() {

  it('should open dashboard page', () => {
    browser.get('/#/admin/dashboard');
    expect(browser.getCurrentUrl()).toContain('/#/admin/dashboard');
  });

  it('should be step "Import runners"', () => {
      expect(element(by.css('.step-create-race')).getAttribute('class')).toMatch('completed');
      expect(element(by.css('.step-import-runners')).getAttribute('class')).toMatch('active');
      expect(element(by.css('.step-assign-tags')).getAttribute('class')).toMatch('disabled');
      expect(element(by.css('.step-start-waves')).getAttribute('class')).toMatch('disabled');
  });

  it('should open modal "import runners"', () => {
    element(by.name('import-runners')).click();
    var fileToUpload = '../test-data.xlsx';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    element(by.css('input[type="file"]')).sendKeys(absolutePath);
    browser.sleep(500)
    element(by.css('.swal2-confirm')).click();
    browser.sleep(5000)
    expect(element(by.css('#swal2-title')).getText()).toEqual('Données sauvegardées !');
    browser.sleep(500)
    element(by.css('.swal2-confirm')).click();
  });

  it('should be step "Assign tags"', () => {
      expect(element(by.css('.step-create-race')).getAttribute('class')).toMatch('completed');
      expect(element(by.css('.step-import-runners')).getAttribute('class')).toMatch('completed');
      expect(element(by.css('.step-assign-tags')).getAttribute('class')).toMatch('active');
      expect(element(by.css('.step-start-waves')).getAttribute('class')).toMatch('disabled');
  });

});
