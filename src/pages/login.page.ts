import { BasePage } from '@src/pages/base.page';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.getByTestId('username');
  readonly passwordInput = this.page.getByTestId('password');
  readonly loginButton = this.page.getByTestId('login-button');
  readonly errorMessage = this.page.getByTestId('error');

  async open(): Promise<void> {
    await this.navigate('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
