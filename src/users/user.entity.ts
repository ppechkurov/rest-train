import { hash } from 'bcrypt';
export class User {
  constructor(private readonly _email: string, private readonly _name: string) {}

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  private _password: string;
  get password(): string {
    return this._password;
  }

  public async setPassword(password: string, salt: string): Promise<void> {
    this._password = await hash(password, Number(salt));
  }
}
