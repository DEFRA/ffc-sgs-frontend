
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('usergroups', {
    name: { type: DataTypes.STRING },
    users: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'usergroups'
  })
}
