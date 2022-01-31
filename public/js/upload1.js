const submitButton = document.getElementById("submitFetch");
submitButton.addEventListener("click", sendFile);

async function getFileList() {
  const list = await fetch("http://localhost:3333/api/upload/file-list", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) console.log("HTTP error" + response.status);
      return response.json();
    })
    .then((json) => {
      const filenames = json.filenames;
      filenames.forEach((name) => {
        addFileUI(name);
      });
    });
}

getFileList();

// When user press the submit button
async function sendFile() {
  const formData = new FormData();
  const data = document.getElementById("upload-file").files[0];

  formData.append("upload-file", data);

  // In order for this to work, the input tag must not in the form tags
  const response = await fetch("http://localhost:3333/api/upload", {
    method: "POST",
    header: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (response.status === 200) addFileUI(data.name);
  else console.log("status is not 200");
}

// Add UI component for CRUD the file
/*
  The following is the inserted element
  <div>
    some_filename_in_text
    <button>Delete</button>
    <button>Download</button>
  </div>

*/
function addFileUI(filename) {
  const container = document.createElement("div");
  const filenameTag = document
    .createElement("span")
    .appendChild(document.createTextNode(filename));
  const deleteButton = document.createElement("button");
  const downloadButton = document.createElement("button");

  deleteButton.appendChild(document.createTextNode("Delete"));
  downloadButton.appendChild(document.createTextNode("Download"));

  container.appendChild(filenameTag);
  container.appendChild(deleteButton);
  container.appendChild(downloadButton);

  const target = document.getElementById("files-list");
  target.appendChild(container);

  deleteButton.addEventListener("click", async () => {
    deleteUI(container);
    await deleteFile(filename);
  });

  downloadButton.addEventListener("click", async () => {
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", `/api/upload/download/${filename}`);
    downloadLink.setAttribute("target", "_blank");
    downloadLink.click();
  });
}

function deleteUI(component) {
  component.remove();
}

// Request the server to remove the given user file
async function deleteFile(filename) {
  await fetch(`http://localhost:3333/api/upload/delete/${filename}`, {
    method: "DELETE",
  });
}
