const Sequelize = require("sequelize");
const { STRING } = Sequelize.DataTypes;
const conn = new Sequelize(
  process.env.DATABASE || "postgres://localhost/workshop"
);

const User = conn.define(
  "user",
  {
    name: STRING,
    bio: STRING,
  },
  {
    hooks: {
      beforeCreate: function (user) {
        if (!user.bio) {
          user.bio = `HELLLLOOO MY NAME IS ${user.name}`;
        }
      },
    },
  }
);

User.createWithName = (name) => User.create({ name });

const syncAndSeed = async () => {
  try {
    await conn.sync({ force: true });
    const [moe, lucy, curly] = await Promise.all(
      ["moe", "lucy", "curly"].map(User.createWithName)
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  models: {
    User,
  },
  syncAndSeed,
};
