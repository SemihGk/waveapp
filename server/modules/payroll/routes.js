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
                console.log(result);
                // new Promise((resolve, reject) => {
                //
                // })
                res.send({
                    success: 'File is uploaded!'
                });
            });
            // getFileStatus(function(err, donut, bar) {
            //     if (err) return res.status(400).send(err);
            //     res.send({
            //         bar: bar,
            //         donut: donut
            //     });
            // });
        });

    app.route('/payroll/table')
        .get((req, res) => {
            console.log('done');
            // getFileStatus(function(err, donut, bar) {
            //     if (err) return res.status(400).send(err);
            //     res.send({
            //         bar: bar,
            //         donut: donut
            //     });
            // });
        });
};
