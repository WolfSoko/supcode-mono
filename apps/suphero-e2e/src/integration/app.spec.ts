import { getGreeting } from '../support/app.po';

describe('suphero', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to suphero!');
  });
});
