"use strict";
const fs = require('fs');
const ReportModel = require('../../models/report');
const PayrollModel = require('../../models/payroll');

module.exports = () => {
    return {
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
                        // header order and validation is guaranteed according to doc. Otherwise, make it dynamic.
                        const [date, hours_worked, employee_id, job_group] = modifiedLine.split(',');
                        chunks.push({
                            date,
                            "hours worked": hours_worked,
                            "employee id": employee_id,
                            "job group": job_group,
                            "_created": new Date()
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

function saveChunksToDB (chunks, reportId, callback) {
    const saveCunks = PayrollModel.bulkCreate(chunks);
    const saveReport = ReportModel.create({
        "report id": reportId
    });

    Promise
    .all([saveCunks, saveReport])
    .then(([chunksResp, reportResp]) => {
        console.log(chunksResp, reportResp);
        callback(null, 'success');
    })
    .catch((err) => {
        callback(err);
    });

}
