import { browser, logging } from 'protractor';
import { LoginPage } from './login.po';

describe('Login page', (): void => {
    let page: LoginPage;

    beforeEach((): void => {
        page = new LoginPage();
    });

    it('should display login message', (): void => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Log in to Diplomatiq');
    });

    afterEach(
        async (): Promise<void> => {
            // Assert that there are no errors emitted from the browser
            const logs = await browser
                .manage()
                .logs()
                .get(logging.Type.BROWSER);
            expect(logs).not.toContain(
                jasmine.objectContaining({
                    level: logging.Level.SEVERE,
                } as logging.Entry),
            );
        },
    );
});
