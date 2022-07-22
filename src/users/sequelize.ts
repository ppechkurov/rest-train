import { DataTypes, Model, Sequelize } from 'sequelize';

const sequelize = new Sequelize('rest_train', 'rest_train', '0015', { dialect: 'postgres' });

class User extends Model {}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    testField: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize },
);

await User.sync({ alter: true });

const toUpdate = await User.findByPk(3);
const updated = await toUpdate?.update({ firstName: 'updated twice firstName' });

console.log(updated?.toJSON());

sequelize.close();
