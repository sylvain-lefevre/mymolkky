import { MolkkyPage } from './app.po';

describe('molkky App', () => {
  let page: MolkkyPage;

  beforeEach(() => {
    page = new MolkkyPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
