import { browser, element, by } from 'protractor';

export class RealTimeRacingSystemPage {
  navigateTo() {
    return browser.get('/#/');
  }

  getTitle() {
    return element(by.css('.text-title')).getText();
  }
}
