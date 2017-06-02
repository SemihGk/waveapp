import $ from 'jquery';
import _ from 'lodash';

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

    self.updateStatus(`${event.target.value} uploading...`, 'info');

    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (self.csvFileTypes.indexOf(file.type) === -1) {
            error = "CSV files only. Select another file";
            self.updateStatus(error, 'error');
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
                self.updateStatus("File Uploaded. Select more files.", 'success');
                if (response.length) {
                    self.createTable(response);
                }
            },
            error: (xhr, status, err) => {
                const errors = _.get(xhr, 'responseJSON.errors', []);
                let error = "Somethint went wrong";
                if (errors) {
                    error = _(errors)
                        .map((error) => error.message)
                        .values()
                        .join('\n');
                }
                self.updateStatus(error, 'error');
            }
        });
    }
}

App.prototype.updateStatus = function(message, type) {
    switch (type) {
        case 'success':
            $("#drop-box").html(`<span class="success-message">${message}</span>`);
            break;
        case 'error':
            $("#drop-box").html(`<span class="error-message">${message}</span>`);
            break;
        case 'info':
            $("#drop-box").html(`<p>${message}</p>`);
            break;
    }
}

App.prototype.initializeTable = function() {
    let self = this;
    $.ajax({
        type: 'GET',
        url: 'payroll/table',
        success: (response) => {
            if (response.length) {
                self.createTable(response);
            } else {
                $(".payroll-table").html(`
                    <span class="no-data-message">
                        Unfortunately, there is no data at the moment.Please a upload file.
                    </span>`);
            }
            // self.updateStatus("File Uploaded. Select more files.");
        },
        error: (xhr, status, err) => {
            $(".payroll-table").html(`<p>Something went wrong.</p>`);
        }
    });
};

App.prototype.createTable = function(payrolls) {
    let self = this;

    const headers = _.keys(_.first(payrolls));
    const tableHeaders = _.map(headers, header => {
        return `<th>${header}</th>`;
    }).join('');

    const tableRows = _.map(payrolls, payroll => {
        const columns = _.map(_.keys(payroll), key => {
            return `<td>${payroll[key]}</td>`
        }).join('');
        return `
            <tr>
                ${columns}
            </tr>
        `
    }).join('');

    const table = `
        <table>
            <thead>
                <tr>
                    ${tableHeaders}
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `
    $('.payroll-table').children('table').remove();
    $('.payroll-table').append(table);
}



let app = new App();

app.init();
