const Hapi = require('@hapi/hapi');
const Sequelize = require('sequelize');
const { Model } = Sequelize;

const server = Hapi.server({
  port: 4000,
  host: '0.0.0.0'
});

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

class Person extends Model { }
Person.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
}, {
    timestamps: false,
    sequelize
});

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
})();

server.route({
  path: '/person',
  method: 'POST',
  handler: async (request, handler) => {
    const { name } = request.payload;
    if (!name) return handler.response('Name not provided.').code(400);
    try {
      const person = await Person.create({ name });
      return handler.response(person);
    } catch (err) {
      console.error(err);
    }
  }
});

server.route({
  path: '/person',
  method: 'GET',
  handler: async (request, handler) => {
    try {
      const people = await Person.findAll();
      return handler.response(people);
    } catch (err) {
      console.error(err);
    }
  },
});

(async () => {
  try {
    await server.start();
    console.log(`Server's running on ${server.info.uri}...`);
  } catch (err) {
    console.error(err);
  }
})();
