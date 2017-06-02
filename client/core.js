import $ from 'jquery';

function App() {
    var self = this;
    self.table = [];
    self.csvFileTypes = [
        'text/csv',
        'text/plain',
        'application/csv',
        'text/comma-separated-values',
        'application/excel',
        'application/vnd.ms-excel',
        'application/vnd.msexcel',
        'text/anytext',
        'application/octet-stream',
        'application/txt',
    ];
}

// initialize events to listen elements
// fetch payrol table
App.prototype.init = function() {
    let self = this;
    $('input[type=file]').on('change', (e) => {
        self.fileUpload(e);
    });

    self.initializeTable();
}

App.prototype.fileUpload = function(event) {
    let self = this,
        data = new FormData(),
        error = null;

    const files = event.target.files;

    self.updateStatus(`${event.target.value} uploading...`);

    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (self.csvFileTypes.indexOf(file.type) === -1) {
            error = "CSV files only. Select another file";
            self.updateStatus(error);
        } else {
            data.append('file', file, file.name);
        }
    }

    if (!error) {
        $.ajax({
            type: 'POST',
            url: 'payroll/upload',
            data,
            processData: false,
            contentType: false,
            success: (response) => {
                self.updateStatus("File Uploaded. Select more files.");
            },
            error: (xhr, status, err) => {
                self.updateStatus("Something went wrong.");
            }
        });
    }
}

App.prototype.updateStatus = function(message) {
    $("#drop-box").html(`<p>${message}</p>`);
}

App.prototype.initializeTable = function() {
    $.ajax({
        type: 'GET',
        url: 'payroll/table',
        success: (response) => {
            self.updateStatus("File Uploaded. Select more files.");
        }
    });
};

let app = new App();

app.init();
