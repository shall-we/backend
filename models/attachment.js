/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        "attachment",
        {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            note_id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: "note",
                    key: "id"
                }
            },
            url: {
                type: DataTypes.STRING(300),
                allowNull: false
            }
        },
        {
            tableName: "attachment"
        }
    );
};
