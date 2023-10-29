var alerts = document.querySelectorAll('.alert-dismissible');
alerts.forEach(function(alert) {
    new bootstrap.Alert(alert);
});