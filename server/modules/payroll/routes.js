const multer = require('multer');
const controller = require('./controller')();

const storage = multer.diskStorage({
    destination: 'server/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage
});

module.exports = (app) => {
    app.route('/payroll/upload')
        .post(upload.single('file'), (req, res) => {
            controller.storeFileData(req.file.path, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                console.log(result);
                res.send(result);
            });
        });

    app.route('/payroll/table')
        .get((req, res) => {
            controller.getPayrollTable((err, result) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.send(result);
            });
        });
};
