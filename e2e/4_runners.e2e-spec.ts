// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { RealTimeRacingSystemPage } from './app.po';
import { browser, element, by, Key } from 'protractor';
var path = require('path');
import { RunnersPage } from './runners.po';

describe('Runners Page', function() {
    let page: RunnersPage;

    beforeEach(() => {
        page = new RunnersPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain('/#/admin/runners');
    });

    it('should sort runners by name (asc, desc)', () => {
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
        page.sortBy('name');
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday9');
        page.sortBy('name');
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
    });

    it('should filter runners by name (4)', () => {
        page.filterBy('name', '1')
        expect(page.countTable()).toEqual(4);
    });

    it('should sort filtered runners by name (4)', () => {
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
        page.sortBy('name');
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday12');
        page.sortBy('name');
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
    });

    it('should reset filter (name)', () => {
        page.resetFilter('name');
        expect(page.countTable()).toEqual(10);
        expect(element.all(by.css('tbody > tr')).count()).toEqual(10);
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
    });

    it('should filter runners by age (age 31)', () => {
        page.filterBy('age', '31');
        browser.sleep(3000);
        expect(page.countTable()).toEqual(2);
    });


    it('should sort filtered runners by age (age 31)', () => {
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
        page.sortBy('name');
        browser.sleep(3000);
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday10');
        browser.sleep(3000);
        page.sortBy('name');
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
    });

    it('should reset filter (age)', () => {
        page.resetFilter('age')
        expect(page.countTable()).toEqual(10);
        expect(page.getTab(0, 0).getText()).toEqual('Runner_saturday1');
    });

    it('should filter runners by tag id (1)', () => {
        page.filterBy('tag_id', '1')
        expect(page.countTable()).toEqual(1);
    });

    it('should reset filter (tag_id)', () => {
        page.resetFilter('tag_id')
        expect(page.countTable()).toEqual(10);
    });
    it('should filter runners by team_name (Team A)', () => {
        page.filterBy('team_name', 'Team A')
        expect(page.countTable()).toEqual(4);
    });
    it('should reset filter (team_name)', () => {
        page.resetFilter('team_name')
        expect(page.countTable()).toEqual(10);
    });

    it('should change to the sunday page', () => {
        element.all(by.css('button')).get(2).click();
        browser.sleep(500);
        expect(page.getTab(0, 0).getText()).toEqual('Runner_sunday1');
    });

    it('should edit the first runner (name = AA_Testing Name)', () => {
        page.edit(0);
        expect(page.getValue('name')).toEqual('Runner_sunday1');
        page.setValue('name', 'AA_Testing Name')
        browser.sleep(1000);
        page.save();
        browser.sleep(1000);
        expect(page.getTab(0, 0).getText()).toEqual('AA_Testing Name');
        browser.sleep(1000);
    });

    it('should restore the first runner (name = Runner_sunday1)', () => {
        page.edit(0);
        expect(page.getValue('name')).toEqual('AA_Testing Name');
        page.setValue('name', 'Runner_sunday1')
        page.save();
        expect(page.getTab(0, 0).getText()).toEqual('Runner_sunday1');
    });

    it('should edit the first runner (Use used tag)', () => {
        page.edit(0);
        page.setValue('tag_id', '5')
        page.setValue('couleur', 'Orange')
        element(by.css('.save-modal')).click();
        browser.sleep(1000);
        expect(page.getSweetTitle()).toEqual('Erreur');
        expect(page.getSweetContent()).toEqual('Déjà un coureur avec ce tag !');
        page.closeSweet()
    });

    it('should edit the first runner (Inexistant tag)', () => {
        page.edit(0);
        page.setValue('tag_id', '556')
        page.setValue('couleur', 'Orange')
        page.save();
        expect(page.getSweetTitle()).toEqual('Erreur');
        expect(page.getSweetContent()).toEqual('Ce tag n\'existe pas !');
        page.closeSweet()
    });

    it('should remove the tag of the first runner', () => {
        page.edit(0);
        page.clearValue('tag_id');
        page.clearValue('couleur');
        page.save()
        expect(page.getTab(0, 3).getText()).toEqual('');
    });

    it('should edit the second runner (Team name)', () => {
        page.edit(0);
        page.setValue('team_name', 'Super Ultra Team')
        page.save();
        expect(page.getTab(0, 4).getText()).toEqual('Super Ultra Team');
    });


    it('should change all the team name of all others members', () => {
        page.filterBy('team_name', 'Super Ultra Team')
        expect(page.countTable()).toEqual(5);
    });

    it('should edit the second runner (Team name)', () => {
        page.edit(1);
        page.setValue('team_name', 'Les all starks')
        page.save()
        expect(page.getTab(0, 4).getText()).toEqual('Les all starks');
        expect(page.getTab(1, 4).getText()).toEqual('Les all starks');
        expect(page.getTab(2, 4).getText()).toEqual('Les all starks');

        page.resetFilter('team_name')
        expect(page.getTab(0, 4).getText()).toEqual('Les all starks');

    });

    it('should edit the first runner (Wave)', () => {
        page.edit(0);
        page.setValue('wave', '4')
        page.save()
        expect(page.getSweetTitle()).toEqual('Erreur');
        expect(page.getSweetContent()).toEqual('Il n\'y a pas de vague avec ce type et ce numéro !');
        page.closeSweet()
    });
});
