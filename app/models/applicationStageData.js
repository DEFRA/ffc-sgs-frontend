
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('grants', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    appref: { type: DataTypes.STRING },
    stageid: { type: DataTypes.BIGINT },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'grants'
  })
}
