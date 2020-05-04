import { browser, by, element } from 'protractor';

export class LoginPage {
    public async navigateTo(): Promise<void> {
        await browser.get(browser.baseUrl);
    }

    public async getTitleText(): Promise<string> {
        return element(by.css('#login h1')).getText();
    }
}
