// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by, Key } from 'protractor';
import { Utils } from './utils.po';

var path = require('path');

describe('Waves Page', function() {
    it('should open runners page', () => {
        browser.get('/#/admin/waves-management');
        expect(browser.getCurrentUrl()).toContain('/#/admin/waves-management');
    });

    it('should see 1 waves by default (saturday)', () => {
        expect(element.all(by.css('tbody > tr')).count()).toEqual(1);
    });

    it('should see the competitive wave first', () => {
        expect(element.all(by.css('tbody tr td div')).first().getText()).toEqual("compet");
    });

    it('should add a new wave', () => {
        element.all(by.css('.add-wave')).get(0).click();
        browser.sleep(500);
        element.all(by.css('.dropdown .item')).get(0).click();
        browser.sleep(500);
        element(by.name('wave-num')).sendKeys(2);
        element.all(by.css('.ui .dropdown')).get(3).click();
        browser.sleep(500);
        element.all(by.css('.dropdown .item')).get(3).click();
        browser.sleep(500);
        element.all(by.css('.ui .positive')).get(0).click();
        browser.sleep(500);
    });

    it('should see two waves', () => {
        expect(element.all(by.css('tbody > tr')).count()).toEqual(2);
    });

    it('should modify the second wave and make it a timed wave', () => {
        element.all(by.css('tbody button')).get(2).click();
        browser.sleep(500);
        element(by.name('wave-chrono')).click();
        browser.sleep(500);
        element.all(by.css('.ui .positive')).get(0).click();
        browser.sleep(500);
        expect(element.all(by.css('tbody > tr')).get(1).all(by.css('.green.checkmark')).count()).toEqual(1);
    });

    it('should remove the second wave', () => {
        element.all(by.css('tbody button')).get(3).click();
        element.all(by.css('.swal2-confirm')).first().click();
        browser.sleep(500);
        expect(element.all(by.css('tbody > tr')).count()).toEqual(1);
        expect(element.all(by.css('tbody tr td div')).first().getText()).toEqual("compet");
    });
});
