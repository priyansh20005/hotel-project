document.getElementById('fileUploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        // You can now upload the file or process it as needed
    } else {
        console.log('No file selected');
    }
});