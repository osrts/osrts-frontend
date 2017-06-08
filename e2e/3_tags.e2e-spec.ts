// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by,  } from 'protractor';
var path = require('path');

describe('Tags Page', function() {

  it('should open dashboard page', () => {
    browser.get('/#/admin/tags');
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/#/admin/tags');
  });

  it('should remove all tags', () => {
    element(by.name('tag-from')).clear();
    element(by.name('tag-to')).clear();
    element(by.name('tag-color')).clear();
    element(by.name('tag-from')).sendKeys("1");
    element(by.name('tag-to')).sendKeys("1000");
    element(by.name('remove-tags')).click();
    browser.sleep(500);
    expect(element(by.css('.total-tags')).getText()).toEqual('0');
  });

  it('should add 250 tags "bleu"', () => {
    element(by.name('tag-from')).clear();
    element(by.name('tag-to')).clear();
    element(by.name('tag-from')).sendKeys("1");
    element(by.name('tag-to')).sendKeys("250");
    element(by.name('tag-color')).sendKeys("Bleu");
    element(by.name('add-tags')).click();
    browser.sleep(500);
    expect(element(by.css('.total-tags')).getText()).toEqual('250');
  });

  it('should add 250 tags "orange"', () => {
    element(by.name('tag-from')).clear();
    element(by.name('tag-to')).clear();
    element(by.name('tag-from')).sendKeys("1");
    element(by.name('tag-to')).sendKeys("250");
    element(by.name('tag-color')).sendKeys("Orange");
    element(by.name('add-tags')).click();
    browser.sleep(500);
    expect(element(by.css('.total-tags')).getText()).toEqual('500');
  });

  it('should show only assigned tags (before assign)', () => {
    element(by.name('onlyAssigned')).click();
    browser.sleep(500);
    expect(element(by.css('.total-tags')).getText()).toEqual('500');
    element(by.name('onlyAssigned')).click();
  });

  it('should assign automatically all tags', () => {
    expect(element.all(by.css('.red.icon')).count()).toEqual(10);
    expect(element.all(by.css('.green.icon')).count()).toEqual(0);
    element(by.name('assign-tags')).click();
    browser.sleep(5000);
    expect(element.all(by.css('.red.icon')).count()).toEqual(0);
    expect(element.all(by.css('.green.icon')).count()).toEqual(10);
  });

   it('should show only assigned tags (after assign)', () => {
    element(by.name('onlyAssigned')).click();
    browser.sleep(500);
    expect(element(by.css('.total-tags')).getText()).toEqual('219');
  });
});
