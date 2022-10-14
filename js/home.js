    $(document).ready(function () {
    loadAllDvds();
    addDvd();
    updateDvd();
    createDvdButton();
    searchButtonCategory();
    searchWithEnterKey();
});
function loadAllDvds() {
    clearDvdTable();
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
        success: function (dvdArray) {
            $.each(dvdArray, (index, dvd) => {
                var id = dvd.id;
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;

                var row = '<tr>';
                row += '<td><a href="#" onclick="showDvdDetails(' + id + ')">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + id + ')">Edit</button></td>';
                row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            displayError('Error calling web service. You may need to turn off your add blocker. Please try again later.');
        }
    });
}

function addDvd() {
    $('#addCreateDvdButton').click(function (event) {
        var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));

        if (haveValidationErrors) {
            return false;
        }
        if ($('#addReleaseYear').val().length != 4) {
            displayError("Please enter a 4-digit year.");
        } else {
            $.ajax({
                type: 'POST',
                url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
                data: JSON.stringify({
                    title: $('#addTitle').val(),
                    releaseYear: $('#addReleaseYear').val(),
                    director: $('#addDirector').val(),
                    rating: $('#addRatingSelector').val(),
                    notes: $('#addNotes').val()
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'dataType': 'json',
                success: function () {
                    hideAddForm();
                    loadAllDvds();
                },
                error: function () {
                    displayError('Error calling web service. Please try again later.');
                }
            })
        }
    });

}

function clearDvdTable() {
    $('#contentRows').empty();
}

function deleteDvd(dvdId) {
    if (window.confirm("Are you sure you would like to delete this dvd from your collection?")) {
        $.ajax({
            type: 'DELETE',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
            success: function () {
                loadAllDvds();
            }
        });
    }
}

function showEditForm(id) {
    $('#errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + id,
        success: function (data, status) {
            $('#editTitle').val(data.title);
            $('#editReleaseYear').val(data.releaseYear);
            $('#editDirector').val(data.director);
            $('#editRatingSelector').val(data.rating);
            $('#editNotes').val(data.notes);
            $('#editDvdId').val(data.id);

            $('#customHeaderDiv').append(
                '<div class="row"><h3>Edit Dvd: ' + data.title + '</h3></div>'
            );
        },
        error: function () {
            displayError('Error calling web service. Please try again later');
        }
    })

    $('#dvdTableDiv').hide();
    $('#navigation').hide();

    $('#customHeaderDiv').show();
    $('#editFormDiv').show();

}

function hideEditForm() {
    $('#errorMessages').empty();

    $('#editTitle').val('');
    $('#editReleaseYear').val('');
    $('#editDirector').val('');
    $('#editRatingSelector').val('Choose Rating');
    $('#editNotes').val('');

    $('#customHeaderDiv').hide();
    $('#customHeaderDiv').empty();
    $('#editFormDiv').hide();
    $('#dvdTableDiv').show();
    $('#navigation').show();
    $('#categorySelector').val('Search Category');
    $('#searchField').val('');
}

function updateDvd(id) {
    $('#editSaveChangesButton').click(function (event) {
        var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));

        if (haveValidationErrors) {
            return false;
        }
        if ($('#editReleaseYear').val().length != 4) {
            displayError("Please enter a 4-digit year.");
        } else {
            $.ajax({
                type: 'PUT',
                url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + $('#editDvdId').val(),
                data: JSON.stringify({
                    id: $('#editDvdId').val(),
                    title: $('#editTitle').val(),
                    releaseYear: $('#editReleaseYear').val(),
                    director: $('#editDirector').val(),
                    rating: $('#editRatingSelector').val(),
                    notes: $('#editNotes').val()
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'dataType': 'json'
                },
                success: function () {
                    hideEditForm();
                    loadAllDvds();
                },
                error: function () {
                    displayError('Error calling web service. Please try again later.');
                }
            })
        }
    });
}
function createDvdButton() {
    $('#createDvdButton').click(function (event) {
        $('#customHeaderDiv').empty();
        $('#errorMessages').empty();
        $('#dvdTableDiv').hide();
        $('#navigation').hide();

        $('#customHeaderDiv').append('<div class="row"><h3>Create Dvd</h3></div>');
        $('#customHeaderDiv').show();
        $('#addFormDiv').show();
    })
}
function hideAddForm() {
    $('#errorMessages').empty();

    $('#addTitle').val('');
    $('#addReleaseYear').val('');
    $('#addDirector').val('');
    $('#addNotes').val('');

    $('#customHeaderDiv').hide();
    $('#customHeaderDiv').empty();
    $('#addFormDiv').hide();
    $('#dvdTableDiv').show();
    $('#navigation').show();
    $('#categorySelector').val('Search Category');
    $('#searchField').val('');
}

function dvdsByTitle() {
    var title = "";
    var contentRows = $('#contentRows');
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/title/' + $('#searchField').val(),
        success: function (dvdArray) {
            clearDvdTable();
            $.each(dvdArray, (index, dvd) => {
                var id = dvd.id;
                title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;

                var row = '<tr>';
                row += '<td><a href="#" onclick="showDvdDetails(' + id + ')">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + id + ')">Edit</button></td>';
                row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            displayError('Error calling web service. Please try again later');
        }

    });
}

function displayError(message) {
    $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' })
        .text(message));
}

function searchButtonCategory() {
    $('#searchButton').click(function (event) {
        searchButtonFunctionality()
    });

}

function searchWithEnterKey() {
    $('#searchField').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            searchButtonFunctionality();
        }
    });
}

function searchButtonFunctionality() {
    $('#errorMessages').empty();
    if ($('#searchField').val() != "" && $('#categorySelector').val() != "" && $('#categorySelector').val() != "Search Category") {
        switch ($('#categorySelector').val()) {
            case 'Title': dvdsByTitle();
                break;
            case 'Release Year': dvdsByReleaseYear();
                break;
            case 'Director Name': dvdsByDirector();
                break;
            case 'Rating': dvdsByRating();
                break;
            default: displayError("Search Category Not Found");
        }

    } else {
        displayError("Both Search Category and Search Term are required.");
        $('#categorySelector').val('Search Category');
        $('#searchField').val('');
    }
}

function showDvdDetails(id) {
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + id,
        success: function (data, status) {
            $('#year').text(data.releaseYear);
            $('#director').text(data.director);
            $('#rating').text(data.rating);
            $('#notes').text(data.notes);

            $('#customHeaderDiv').append(
                '<div class="row"><h3>' + data.title + '</h3></div>'
            );
            $('#customHeaderDiv').show();
            $('#dvdDetailsForm').show();
            $('#dvdTableDiv').hide();
            $('#navigation').hide();
        },
        error: function () {
            displayError('Error calling web service. Please try again later');
        }
    })
}

function hideDetailView() {
    $('#errorMessages').empty();
    $('#dvdDetailsForm').hide();

    $('#year').val('');
    $('#director').val('');
    $('#director').val('');
    $('#rating').val('');
    $('#notes').val('');

    $('#customHeaderDiv').hide();
    $('#customHeaderDiv').empty();
    $('#dvdTableDiv').show();
    $('#navigation').show();
    $('#categorySelector').val('Search Category');
    $('#searchField').val('');
}

function showHome() {
    loadAllDvds();
    $('#categorySelector').val('Search Category');
    $('#searchField').val('');
    $('#customHeaderDiv').empty();
    $('#errorMessages').empty();
}

function dvdsByReleaseYear() {
    var contentRows = $('#contentRows');
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/year/' + $('#searchField').val(),
        success: function (dvdArray) {
            clearDvdTable();
            $.each(dvdArray, (index, dvd) => {
                var id = dvd.id;
                title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;

                var row = '<tr>';
                row += '<td><a href="#" onclick="showDvdDetails(' + id + ')">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + id + ')">Edit</button></td>';
                row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            displayError('Error calling web service. Please try again later');
        }

    });
}

function dvdsByDirector() {
    var contentRows = $('#contentRows');
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/director/' + $('#searchField').val(),
        success: function (dvdArray) {
            clearDvdTable();
            $.each(dvdArray, (index, dvd) => {
                var id = dvd.id;
                title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;

                var row = '<tr>';
                row += '<td><a href="#" onclick="showDvdDetails(' + id + ')">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + id + ')">Edit</button></td>';
                row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            displayError('Error calling web service. Please try again later');
        }

    });
}

function dvdsByRating() {
    var contentRows = $('#contentRows');
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/rating/' + $('#searchField').val(),
        success: function (dvdArray) {
            clearDvdTable();
            $.each(dvdArray, (index, dvd) => {
                var id = dvd.id;
                title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;

                var row = '<tr>';
                row += '<td><a href="#" onclick="showDvdDetails(' + id + ')">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + id + ')">Edit</button></td>';
                row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            displayError('Error calling web service. Please try again later');
        }

    });
}
function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        return true;
    } else {
        return false;
    }
}







//Refactor code into smaller pieces
//Refactor naming convention







