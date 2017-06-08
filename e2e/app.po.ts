// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { browser, element, by } from 'protractor';

export class RealTimeRacingSystemPage {
  navigateTo() {
    return browser.get('/#/');
  }

  getTitle() {
    return element(by.css('.text-title')).getText();
  }
}
