import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by,  } from 'protractor';

describe('Login Page', function() {

  it('should display login page title', () => {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
    browser.sleep(500);
    browser.get('/#/login');
    expect(element(by.css('.page-title')).getText()).toEqual("Connexion à l'espace admin");
  });

  // it('should stay on login page - empty form', () => {
  //   element(by.css('form button')).click();
  //   expect(element(by.css('form')).getAttribute('class')).toMatch('ng-invalid');
  // });
  //
  // it('should stay on login page - wrong email ', () => {
  //   element(by.css('.email')).sendKeys('email.com');
  //   element(by.css('form button')).click();
  //   expect(element(by.css('form')).getAttribute('class')).toMatch('ng-invalid');
  //   expect(element(by.css('form')).getAttribute('class')).toMatch('ng-dirty');
  // });
  //
  // it('should stay on login page - wrong password ', () => {
  //   element(by.css('.email')).clear();
  //   element(by.css('.password')).clear();
  //
  //   element(by.css('.email')).sendKeys('email@net.com');
  //   element(by.css('.password')).sendKeys('blabla');
  //   element(by.css('form button')).click();
  //   expect(element(by.css('form')).getAttribute('class')).toMatch('ng-valid');
  //   expect(element(by.css('.negative > h3')).getText()).toEqual("Connexion refusée");
  // });

  it('should login successfully', () => {
    element(by.css('.email')).clear();
    element(by.css('.password')).clear();
    element(by.css('.email')).sendKeys('gui.deconinck@gmail.com');
    element(by.css('.password')).sendKeys('azerty9');
    expect(element(by.css('form')).getAttribute('class')).toMatch('ng-valid');
    element(by.css('form button')).click();
    // browser.sleep(30000);
    return browser.driver.wait(function() {
          return browser.driver.getCurrentUrl().then(function(url) {
              return /admin/.test(url);
          });
    }, 10000);
  });
});
