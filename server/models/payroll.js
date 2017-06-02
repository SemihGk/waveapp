"use strict";

module.exports = function(sequelize, DataTypes) {
    var Payroll = sequelize.define("Payroll", {
        "date": DataTypes.DATE,
        "hours worked": DataTypes.FLOAT,
        "employee id": DataTypes.INTEGER,
        "job group": DataTypes.STRING,
        "_created": DataTypes.DATE
    });

    return Payroll;
};
