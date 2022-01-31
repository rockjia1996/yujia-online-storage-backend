document.getElementById("ajaxBtn").addEventListener("click", sendFile);
let httpRequest;

getFileList();

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
      const item = document.createElement("p");

      const file = document.getElementById("upload-file");
      const node = document.createTextNode(`${file.files[0].name}`);
      item.appendChild(node);

      const deleteLink = document.createElement("a");
      deleteLink.setAttribute("href", "/api/upload/delete");
      const deleteTextNode = document.createTextNode("         Delete");
      deleteLink.appendChild(deleteTextNode);

      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", "/api/upload/download");
      const downloadTextNode = document.createTextNode("      Download");
      downloadLink.appendChild(downloadTextNode);

      item.appendChild(deleteLink);
      item.appendChild(downloadLink);

      const element = document.getElementById("files-list");
      element.appendChild(item);
    } else {
      alert("There was a problem with the request. Please try to login again!");
    }
  }
}

function getFileList() {
  const request = new XMLHttpRequest();
  if (!request) {
    alert("Giving up: (Cannot create an XMLHTTP instance");
    return false;
  }

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      const filenames = request.response.split("/");

      filenames.forEach((name) => {
        const item = document.createElement("a");
        const filenameTextNode = document.createTextNode(name);
        item.appendChild(filenameTextNode);

        const deleteLink = document.createElement("a");
        deleteLink.setAttribute("href", "/api/upload/delete");
        const deleteTextNode = document.createTextNode("         Delete");
        deleteLink.appendChild(deleteTextNode);

        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", "/api/upload/download");
        const downloadTextNode = document.createTextNode("      Download");
        downloadLink.appendChild(downloadTextNode);

        item.appendChild(deleteLink);
        item.appendChild(downloadLink);

        const element = document.getElementById("files-list");
        element.appendChild(item);
      });
    }
  };

  request.open("GET", "/api/upload/file-list");
  request.responseType = "text";
  request.send();
}
