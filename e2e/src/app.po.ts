import { browser, by, element } from 'protractor';

export class AppPage {
    public async navigateTo(): Promise<void> {
        await browser.get(browser.baseUrl);
    }

    public async getTitleText(): Promise<string> {
        return element(by.css('diplomatiq-frontend .content span')).getText();
    }
}
