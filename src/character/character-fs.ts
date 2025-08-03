addEventListener('message', (message) => {
  switch (message.data.command) {
    case 'save': {
      saveCharacter(message.data.file);
      break;
    }
    case 'load': {
      loadCharacter(message.data.file);
      break;
    }
    case 'delete': {
      deleteCharacter(message.data.file);
    }
  }
});

async function saveCharacter(file: File) {
  const root = await navigator.storage.getDirectory();
  const fileHandle: FileSystemFileHandle = await root.getFileHandle(file.name, {
    create: true,
  });
  const writeHandle = await fileHandle.createSyncAccessHandle();
  writeHandle.truncate(0);
  writeHandle.write(await file.arrayBuffer());
  writeHandle.close();
  postMessage(true);
}

async function loadCharacter(file: string) {
  const root = await navigator.storage.getDirectory();
  const fileHandle: FileSystemFileHandle = await root.getFileHandle(file, {
    create: false,
  });
  const readHandle = await fileHandle.createSyncAccessHandle();
  // Get size of the file.
  const fileSize = readHandle.getSize();
  // Read file content to a buffer.
  const buffer = new DataView(new ArrayBuffer(fileSize));
  readHandle.read(buffer, { at: 0 });
  readHandle.close();
  postMessage({ command: 'load', file: buffer });
}

async function deleteCharacter(file: string) {
  const root = await navigator.storage.getDirectory();
  let result = true;
  try {
    root.removeEntry(file);
  } catch {
    result = false;
  }
  postMessage({ command: 'delete', result: result });
}
