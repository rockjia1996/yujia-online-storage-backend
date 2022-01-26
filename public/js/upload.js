document.getElementById("ajaxBtn").addEventListener("click", sendFile);
let httpRequest;

async function sendFile() {
  httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert("Giving up: (Cannot create an XMLHTTP instance");
    return false;
  }

  httpRequest.onreadystatechange = uploadStatus;

  // Create a new FormData obj and get the
  // file from the form
  const formData = new FormData();
  const file = document.getElementById("upload-file");

  // Append the selected file
  // file.files is an array, since this is single
  // file upload, so the first on file is the
  // selected file
  formData.append("upload-file", file.files[0]);

  // Setup the reqeest type, and address
  httpRequest.open("POST", "/api/upload/file", true);
  httpRequest.send(formData);
}

function uploadStatus() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      alert(httpRequest.responseText);
    } else {
      alert("There was a problem with the request.");
    }
  }
}
