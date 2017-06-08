// Open Source Race Timing System - Front-end
// Wojciech Grynczel & Guillaume Deconinck

import { browser, element, by, Key} from 'protractor';

export class RacesPage {
  navigateTo() {
    return browser.get('/#/admin/races');
  }

  editRace(){
      element(by.css('.edit-race')).click();
      browser.sleep(1000)
  }

  createRace(){
      element(by.css('.create-race')).click();
      browser.sleep(1000)
  }

  closeModal(){
      element(by.name('cancel')).click();
      browser.sleep(1000)
  }

  saveModal(){
      element(by.name('create')).click();
      browser.sleep(1000)
  }
  upadateModal(){
      element(by.name('edit')).click();
      browser.sleep(1000)
  }

  getModalTitle(){
      return element(by.css('.modal h2')).getText();
  }

  getModalClass(){
      return element(by.css('.modals')).getAttribute('class')
  }

  getSweetTitle(){
      return element(by.css('.swal2-title')).getText();
  }

  getSweetContent(){
      return element(by.css('.swal2-content')).getText();
  }

  closeSweet(){
      element.all(by.css('.swal2-confirm')).first().click();
      browser.sleep(1000);
  }

  setValue(name, val){
      element(by.name(name)).clear()
      element(by.name(name)).sendKeys(val);
  }
}
