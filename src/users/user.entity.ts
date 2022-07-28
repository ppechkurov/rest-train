import { compare, hash } from 'bcrypt';
export class User {
  constructor(private readonly _email: string, private readonly _name: string, hash?: string) {
    if (hash) this._passwordHash = hash;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  private _passwordHash: string;
  get passwordHash(): string {
    return this._passwordHash;
  }

  public async setPassword(password: string, salt: string): Promise<void> {
    this._passwordHash = await hash(password, Number(salt));
  }

  public async compareHash(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }
}
