// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('real-time-racing-system App', function() {
  it('should display home page title', () => {
    browser.ignoreSynchronization = true;
    browser.waitForAngular();
    browser.sleep(500);
    browser.get('/');
    expect(element(by.css('.page-title')).getText()).toEqual("Bienvenue sur la page des résultats de Game of Trails");
  });
});
