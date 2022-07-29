import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { UserModel } from '../sequelize/models/user.model';
import { TYPES } from '../types';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { IUsersService } from './interfaces/users.service.interface';
import { User } from './user.entity';
import { UsersService } from './users.service';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
  find: jest.fn(),
  create: jest.fn(),
  getInfo: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
  container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
  usersService = container.get<IUsersService>(TYPES.UsersService);
});

let createdUser: UserModel | null;

describe('UserService', () => {
  describe('method createUser', () => {
    it('creates new user', async () => {
      configService.get = jest.fn().mockReturnValueOnce('1');

      usersRepository.create = jest.fn().mockImplementationOnce(async (user: User) => ({
        name: user.nickname,
        email: user.email,
        password: user.password,
        uid: 'testuid',
      }));

      createdUser = await usersService.createUser({
        email: 'p@p.com',
        nickname: 'patrick',
        password: '1',
      });

      expect(createdUser?.uid).toEqual('testuid');
      expect(createdUser?.password).not.toEqual(1);
    });
  });

  describe('method validateUser', () => {
    describe('returns', () => {
      describe('true when', () => {
        it('found a user', async () => {
          usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

          const result = await usersService.validateUser({
            email: 'p@p.com',
            password: '1',
          });

          expect(result).toBeTruthy();
        });
      });

      describe('false when', () => {
        it('provided wrong password', async () => {
          usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

          const result = await usersService.validateUser({
            email: 'p@p.com',
            password: '2',
          });

          expect(result).toBeFalsy();
        });

        it('not found a user', async () => {
          usersRepository.find = jest.fn().mockReturnValueOnce(null);

          const result = await usersService.validateUser({
            email: 'p@p.com',
            password: '1',
          });

          expect(result).toBeFalsy();
        });
      });
    });
  });

  describe('method getInfo', () => {
    describe('when found a user', () => {
      it('returns result', async () => {
        usersRepository.getInfo = jest.fn().mockReturnValueOnce(createdUser);
        const result = await usersService.getInfo('p@p.com');

        expect(result).not.toBeNull();
      });
    });

    describe('when not found a user', () => {
      it('returns null', async () => {
        usersRepository.getInfo = jest.fn().mockReturnValueOnce(null);
        const result = await usersService.getInfo('p@p.com');

        expect(result).toBeNull();
      });
    });
  });
});
