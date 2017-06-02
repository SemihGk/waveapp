"use strict";

module.exports = function(sequelize, DataTypes) {
    var Report = sequelize.define("Report", {
        "report id": DataTypes.INTEGER
    });

    return Report;
};
