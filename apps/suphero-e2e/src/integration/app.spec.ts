import {getGreeting, getMessage} from '../support/app.po';

describe('suphero', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getMessage().contains('Welcome to suphero!');
  });

  it('should display a greeting message', () => {
    getGreeting().contains('Welcome to sup-code-mono api!');
  });
});
