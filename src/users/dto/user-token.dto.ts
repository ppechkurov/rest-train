import { UserModel } from '../../sequelize/models/user.model';

export class UserTokenDto {
  uid: string;
  email: string;
  constructor({ uid, email }: UserModel) {
    this.uid = uid;
    this.email = email;
  }
}
