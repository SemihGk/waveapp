"use strict";
const fs = require('fs');
const moment = require('moment');
const model = require('../../models');
const _ = require('lodash');
const {
    job_group_options
} = require('../../../config');

module.exports = () => {
    return {
        getPayrollTable: (callback) => {
            model.Payroll.findAll({
                    raw: true,
                    attributes: {
                        exclude: ['id', 'updatedAt', 'createdAt']
                    }
                })
                .then(results => {
                    callback(null, formatPayrollData(results));
                })
                .catch(callback)
        },
        storeFileData: (path, callback) => {
            let rs = fs.createReadStream(path, {
                encoding: 'utf8'
            });

            let chunks = [],
                reportId;

            rs.on('data', (chunk) => {
                    const lines = chunk.split('\n');
                    chunks = lines.reduce((chunks, line, index) => {
                        if (line.indexOf('report') !== -1) { // remove report id line and take the report Id
                            reportId = line.split(',')[1];
                            return chunks;
                        }

                        if (!index || !line) { // remove header, empty line and

                            return chunks;
                        }

                        const modifiedLine = line.replace('\r', '');
                        // warning!: header order and validation is guaranteed according to doc. Otherwise, make it dynamic.
                        const [date, hours_worked, employee_id, job_group] = modifiedLine.split(',');
                        chunks.push({
                            date: moment(date, 'DD/MM/YYYY'),
                            "hours worked": hours_worked,
                            "employee id": employee_id,
                            "job group": job_group
                        });

                        return chunks;
                    }, chunks);
                })
                .on('end', () => {
                    saveChunksToDB(chunks, reportId, (err, result) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, result);
                    })
                })
                .on('error', (err) => {
                    return callback(err);
                });
        },
    }
}

function saveChunksToDB(chunks, reportId, callback) {
    model.Report.create({
            "report id": reportId
        }).then(() => {
            return model.Payroll.bulkCreate(chunks);
        })
        .then(() => {
            return model.Payroll.findAll({
                raw: true,
                attributes: {
                    exclude: ['id', 'updatedAt', 'createdAt']
                }
            });
        })
        .then((payrolls) => {
            // console.log(payrolls);
            callback(null, formatPayrollData(payrolls));
        })
        .catch(callback);
}

function formatPayrollData(payrolls) {
    let datePeriods = _.reduce(payrolls, (datePeriods, payroll) => {
        const date = payroll.date;
        const hours_worked = payroll['hours worked'];
        const employee_id = payroll['employee id'];
        const job_group = payroll['job group'];
        const startOfMonth = moment(date).startOf('month');
        const endOfMonth = moment(date).endOf('month');
        const isFirstPeriod = moment(date).diff(startOfMonth, 'days') < 15;
        const dayPart = isFirstPeriod ? 15 : 16;
        const middleMonth = moment(date).format(`${dayPart}/MM/YYYY`);
        const datePeriod = isFirstPeriod ?
            (startOfMonth.format('DD/MM/YYYY') + ' - ' + middleMonth) :
            (middleMonth + ' - ' + endOfMonth.format('DD/MM/YYYY'));

        const totalPayrol = parseInt(job_group_options[job_group]) * hours_worked;
        const datePeriodKey = datePeriod + '//' + employee_id;
        if (datePeriods[datePeriodKey] === undefined) {
            datePeriods[datePeriodKey] = totalPayrol;
        } else {
            datePeriods[datePeriodKey] += totalPayrol;
        }
        return datePeriods;
    }, {});
    return _(_.keys(datePeriods))
        .map(key => {
            const [pay_period, employee_id] = key.split('//');
            return {
                "Employee ID": employee_id,
                "Pay Period": pay_period,
                "Amount Paid": datePeriods[key]
            }
        })
        .orderBy(["Employee ID", "Pay Period"])
        .values();
    }
