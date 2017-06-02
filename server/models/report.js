"use strict";

module.exports = function(sequelize, DataTypes) {
    var Report = sequelize.define("Report", {
        "report id": {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        }
    });

    return Report;
};
