// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by,  } from 'protractor';

describe('Login Page', function() {

  it('should display login page title', () => {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
    browser.sleep(500);
    browser.get('/#/login');
    expect(element(by.css('.page-title')).getText()).toEqual('Connexion à l\'espace admin');
  });

  it('should login successfully', () => {
    element(by.css('.email')).clear();
    element(by.css('.password')).clear();
    element(by.css('.email')).sendKeys('test@test.test');
    element(by.css('.password')).sendKeys('test');
    expect(element(by.css('form')).getAttribute('class')).toMatch('ng-valid');
    element(by.css('form button')).click();
    browser.sleep(1000);
    // expect(browser.getCurrentUrl()).toContain('/#/admin');
    return browser.driver.wait(function() {
          return browser.driver.getCurrentUrl().then(function(url) {
              return /admin/.test(url);
          });
    }, 5000);
  });
});
