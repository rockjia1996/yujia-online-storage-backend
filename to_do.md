# To Do List

## Tasks

### Long terms

- [] Replace frontend with React.js.
- [] Test more on the file upload / download / deletion.
  There seem to be a directory not found error pops
  up randomly. Try to catch the bug.
- [] Considering / Experimenting more customized middlewares with express
  and mongoose to optmize the pipeline.

### Short terms

- [] Replace the path literal with the actual built-in path object
  (the current implemention is mad ugly and not portable to windows)
- [] Add constraint on the size of the files.
- [] Simulate the bad network connection from the client-end. See
  if any bug that may cause.
- [] Decouple that user-provided filename with file creation.
  In the case that malicious user send a filename as a route.
  The Filetrack should track the user given name of the file,
  but when it stores the file, it uses its internal assigned name.
  So the malicious filename won't interfer with the flow of server.
