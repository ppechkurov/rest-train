import { compare, hash } from 'bcrypt';
export class User {
  constructor(private readonly _email: string, private readonly _nickname: string, hash?: string) {
    if (hash) this._password = hash;
  }

  get email(): string {
    return this._email;
  }

  get nickname(): string {
    return this._nickname;
  }

  private _password: string;
  get password(): string {
    return this._password;
  }

  public async setPassword(password: string, salt: string): Promise<void> {
    this._password = await hash(password, Number(salt));
  }

  public async compareHash(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
