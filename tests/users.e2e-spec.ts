import { App } from '../src/app';
import { boot } from '../src/run';
import request from 'supertest';
import { UserModel } from '../src/sequelize/models/user.model';
import { User } from '../src/users/user.entity';
import { Repository } from 'sequelize-typescript';

let application: App;
let testUser: UserModel;
let usersRepository: Repository<UserModel>;

beforeAll(async () => {
  const { app } = await boot;
  application = app;

  usersRepository = application['repositoryService'].getRepository(UserModel);
  await usersRepository.destroy({ where: {} });
});

describe('Users e2e', () => {
  it('register - success', async () => {
    const user = new User('p@p.com', 'pat');
    user.setPassword('1', 'salt');
    const { name, email } = user;

    const res = await request(application.app)
      .post('/users/register')
      .send({ name, email, password: '1' });

    expect(res.statusCode).toBe(201);
    expect(res.body).not.toHaveProperty('error');
    testUser = res.body;
  });

  it('register - error', async () => {
    const user = new User('p@p.com', 'pat');
    user.setPassword('1', 'salt');

    const { name, email, passwordHash } = user;
    testUser = await usersRepository.create({ nickname, email, password: passwordHash });

    const res = await request(application.app)
      .post('/users/register')
      .send({ name: testUser.name, email: testUser.email, password: '1' });

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('error');
  });
});

afterEach(async () => {
  await usersRepository.destroy({ where: { id: testUser.id } });
});

afterAll(async () => {
  await application.close();
});
