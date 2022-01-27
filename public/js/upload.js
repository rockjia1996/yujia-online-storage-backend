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
  httpRequest.open("POST", "/api/upload", true);
  httpRequest.send(formData);
}

function uploadStatus() {
  // If the response is success, we add the file to the list
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      alert(httpRequest.responseText);
      const item = document.createElement("p");

      const file = document.getElementById("upload-file");
      const node = document.createTextNode(`${file.files[0].name}`);
      item.appendChild(node);
      const element = document.getElementById("files-list");
      element.appendChild(item);
    } else {
      alert("There was a problem with the request.");
    }
  }
}
