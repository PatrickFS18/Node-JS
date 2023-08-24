module.exports = (sequelize, DataTypes) => {
  const empregado = sequelize.define('empregado', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salario_bruto: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    departamento: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  });
  empregado.sync ({force:true})
  return empregado;
};
