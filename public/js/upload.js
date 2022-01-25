/*

document.getElementById("ajaxBtn").addEventListener("click", sendFile);
let httpRequest;

async function sendFile() {
  httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert("Giving up: (Cannot create an XMLHTTP instance");
    return false;
  }

  httpRequest.onreadystatechange = uploadStatus;

  const file = document.getElementById("upload-file");
  console.log(file);
  console.log("File Name: ", file.files[0]);

  const reader = new FileReader();
  reader.addEventListener("loadend", () => {
    console.log(reader.result);
    httpRequest.open("POST", "http://localhost:3333/check", true);
    httpRequest.setRequestHeader("Content-Type", "multipart/form-data");
    httpRequest.send(reader.result);
  });
  reader.readAsBinaryString(file.files[0]);
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

*/
