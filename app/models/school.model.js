const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Teacher = sequelize.define("teacher", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
    },

    subject: {
      type: Sequelize.STRING,
    },
  });

  const Class = sequelize.define("class", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
    },

    class_teacher: {
      type: DataTypes.UUID,
      references: {
        model: "teachers",
        key: "id",
      },
    },
  });
  Teacher.hasOne(Class, { foreignKey: "class_teacher" });

  const Students = sequelize.define("students", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    joined_at: {
      type: DataTypes.DATE,
    },
    class_id: {
      allowNull: true,
      type: DataTypes.UUID,
      onDelete: "SET NULL",
      references: {
        model: "classes",
        key: "id",
      },
    },
  });

  Students.belongsTo(Class, { foreignKey: "class_id", onDelete: "SET NULL" });
  Class.hasMany(Students, { foreignKey: "class_id", onDelete: "SET NULL" });

  const Teaching = sequelize.define("teaching", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    class_id: {
      type: DataTypes.UUID,
      references: {
        model: "classes",
        key: "id",
      },
    },

    teacher_id: {
      type: DataTypes.UUID,
      references: {
        model: "teachers",
        key: "id",
      },
    },
  });

  Teacher.hasMany(Teaching, { foreignKey: "teacher_id" });
  Teaching.belongsTo(Teacher, { foreignKey: "teacher_id" });

  Class.hasMany(Teaching, { foreignKey: "class_id", onDelete: "cascade" });
  Teaching.belongsTo(Class, { foreignKey: "class_id" });

  return { Teacher, Class, Students, Teaching };
};
