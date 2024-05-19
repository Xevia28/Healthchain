function clearPatientCard() {
    $('#patient-message').text("");
    $('#editPatientForm')[0].reset();
    $('#editPatientForm').addClass('d-none');
}
function clearHospitalCard() {
    $('#hospital-message').text("");
    $('#editHospitalForm')[0].reset();
    $('#editHospitalForm').addClass('d-none');
}
function clearInsuranceCard() {
    $('#insurance-message').text("");
    $('#editInsuranceForm')[0].reset();
    $('#editInsuranceForm').addClass('d-none');
}

function formattedDate(rfc3339Date) {
    var date = new Date(rfc3339Date);
    var day = date.getDate(); // day of the month
    var month = date.getMonth() + 1; // month (getMonth() returns 0-11, so add 1)
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    var year = date.getFullYear(); // year
    // format date as MM/DD/YYYY
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}

// Function to call when 'No' is clicked
function noFunction() {
    $('#confirmModal').modal('hide');
}

// Add Patient record to ledger
function createPatientRecord() {
    // Get form data
    var patientId = $('#patientId').val();
    var patientName = $('#patientName').val();
    var patientAge = $('#patientAge').val();
    var patientNotes = $('#patientNotes').val();

    var data = {
        id: patientId,
        name: patientName,
        age: patientAge,
        notes: patientNotes,
    };
    // Send a POST request to the server
    $.ajax({
        url: '/api/patient', // replace with your URL
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            // Show the modal
            var myModal = new bootstrap.Modal($('#successModal'), {});
            myModal.show();
        },
        error: function (error) {
            console.log(error);
        }
    }).always(function () {
        // This function is always called, regardless of whether the request was successful or not
        // Clear the form
        $('form')[0].reset();
        $('#confirmModal').modal('hide');
        $('#yesButton').off("click");
    });
}

// Add Hospital record to ledger
function createHospitalRecord() {
    // Get form data
    var hospitalId = $('#hospitalId').val();
    var hospitalName = $('#hospitalName').val();
    var hospitalAddress = $('#hospitalAddress').val();
    var hospitalPhone = $('#hospitalPhone').val();

    var data = {
        id: hospitalId,
        name: hospitalName,
        address: hospitalAddress,
        phoneNumber: hospitalPhone,
    };
    // Send a POST request to the server
    $.ajax({
        url: '/api/hospital', // replace with your URL
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            // Show the modal
            var myModal = new bootstrap.Modal($('#successModal'), {});
            myModal.show();
        },
        error: function (error) {
            console.log(error);
        }
    }).always(function () {
        // This function is always called, regardless of whether the request was successful or not
        // Clear the form
        $('form')[0].reset();
        $('#confirmModal').modal('hide');
        $('#yesButton').off("click");
    });
}

// Add Insurance record to ledger
function createInsuranceRecord() {
    // Get form data
    var claimId = $('#claimId').val();
    var insuranceId = $('#insuranceId').val();
    var pId = $('#pId').val();
    var hId = $('#hId').val();
    var treatment = $('#treatment').val();
    var IAmount = $('#IAmount').val();

    var data = {
        claimId: claimId,
        insuranceId: insuranceId,
        treatment: treatment,
        patientId: pId,
        hospitalId: hId,
        amount: IAmount,
    };
    // Send a POST request to the server
    $.ajax({
        url: '/api/insurance', // replace with your URL
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            // Show the modal
            var myModal = new bootstrap.Modal($('#successModal'), {});
            myModal.show();
        },
        error: function (error) {
            console.log(error);
        }
    }).always(function () {
        // This function is always called, regardless of whether the request was successful or not
        // Clear the form
        $('form')[0].reset();
        $('#confirmModal').modal('hide');
        $('#yesButton').off("click");
    });
}


// Edit a Patient record in the ledger
function updatePatientRecord() {
    var editPatientName = $('#editPatientName').val();
    var editPatientAge = $('#editPatientAge').val();
    var editPatientNotes = $('#editPatientNotes').val();

    var data = {
        name: editPatientName,
        age: editPatientAge,
        notes: editPatientNotes
    };

    var patientId = $('#editPatientId').text();
    $.ajax({
        url: '/api/patient/' + patientId, // append the patientId to your API endpoint
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            console.log(result)
            var myModal = new bootstrap.Modal($('#successModal'), {});
            myModal.show();
            clearPatientCard()
            console.log(result);
        },
        error: function (error) {
            // Handle error
            console.log(error);
        }
    }).always(function () {
        // This function is always called, regardless of whether the request was successful or not
        // Clear the card
        clearPatientCard();
        $('#confirmModal').modal('hide');
        $('#yesButton').off("click");
    });
}

// Edit a Hospital record in the ledger
function updateHospitalRecord() {
    var editHospitalName = $('#editHospitalName').val();
    var editHospitalAddress = $('#editHospitalAddress').val();
    var editHospitalPhone = $('#editHospitalPhone').val();

    var data = {
        name: editHospitalName,
        address: editHospitalAddress,
        phoneNumber: editHospitalPhone
    };

    var hospitalId = $('#editHospitalId').text();
    $.ajax({
        url: '/api/hospital/' + hospitalId, // append the hospitalId to your API endpoint
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
            console.log(result)
            var myModal = new bootstrap.Modal($('#successModal'), {});
            myModal.show();
            clearHospitalCard()
            console.log(result);
        },
        error: function (error) {
            // Handle error
            console.log(error);
        }
    }).always(function () {
        // This function is always called, regardless of whether the request was successful or not
        // Clear the card
        clearHospitalCard();
        $('#confirmModal').modal('hide');
        $('#yesButton').off("click");
    });
}

$(document).ready(function () {
    //Add event Handlers
    // Event listener for when the modal is hidden
    $('#confirmModal').on('hidden.bs.modal', function () {
        console.log(result); // Outputs: true if 'Yes' was clicked, false if 'No' was clicked
    });
    // Attach event listeners to the buttons
    $('#noButton').click(noFunction);
    // Fetch all confectionarys and display them
    // Handle form submission
    $('#createPatientForm').on('submit', function (e) {
        e.preventDefault();
        $('#yesButton').off("click");
        $('#yesButton').click(createPatientRecord);
        $('#confirmModal').modal('show');
    });
    $('#getPatientForm').on('submit', function (e) {
        e.preventDefault();
        var searchId = $('#searchPatientId').val();
        $.ajax({
            url: 'api/patient/' + searchId,
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data); // Parse into an object
                $('#editPatientId').text(data.id);
                $('#editPatientName').val(data.name);
                $('#editPatientAge').val(data.age);
                $('#editPatientNotes').val(data.notes);
                $('#editPatientForm').removeClass('d-none');
            },
            error: function (error) {
                clearPatientCard()
                $('#patient-message').text("Not Found");
                console.log(error);
            }
        });
    });
    $('#updatePatientButton').click(function () {
        $('#yesButton').off("click");
        $('#yesButton').click(updatePatientRecord);
        $('#confirmModal').modal('show');
    });

    $('#createHospitalForm').on('submit', function (e) {
        e.preventDefault();
        $('#yesButton').off("click");
        $('#yesButton').click(createHospitalRecord);
        $('#confirmModal').modal('show');
    });
    $('#getHospitalForm').on('submit', function (e) {
        e.preventDefault();
        var searchId = $('#searchHospitalId').val();
        $.ajax({
            url: 'api/hospital/' + searchId,
            type: 'GET',
            success: function (data) {
                data = JSON.parse(data); // Parse into an object
                $('#editHospitalId').text(data.id);
                $('#editHospitalName').val(data.name);
                $('#editHospitalAddress').val(data.address);
                $('#editHospitalPhone').val(data.phoneNumber);
                $('#editHospitalForm').removeClass('d-none');
            },
            error: function (error) {
                clearHospitalCard()
                $('#hospital-message').text("Not Found");
                console.log(error);
            }
        });
    });
    $('#updateHospitalButton').click(function () {
        $('#yesButton').off("click");
        $('#yesButton').click(updateHospitalRecord);
        $('#confirmModal').modal('show');
    });
});