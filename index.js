const fs = require("fs");
const path = require("path");

const downloadsFolder = "../../Downloads"; // path to my downloads from current directory

// move files to respective folders
const moveFileToFolder = (file, destinationFolder) => {
  const sourcePath = path.join(downloadsFolder, file);
  const destinationPath = path.join(downloadsFolder, destinationFolder, file);

  fs.rename(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error(`Error moving ${file}: ${err}`);
    } else {
      console.log(`${file} moved to ${destinationFolder}`);
    }
  });
};

// create the necessary folders to group the files
const createFolderIfNotExists = (folder) => {
  const folderPath = path.join(downloadsFolder, folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

const organizeFiles = () => {
  // create necessary folders
  createFolderIfNotExists("images");
  createFolderIfNotExists("videos");
  createFolderIfNotExists("documents");
  createFolderIfNotExists("music");
  createFolderIfNotExists("compressed");
  createFolderIfNotExists("executables");
  createFolderIfNotExists("svg");
  createFolderIfNotExists("others");

  fs.readdir(downloadsFolder, (err, files) => {
    if (err) {
      console.error("error reading downloads folder", err);
    }

    files.forEach((file) => {
      const ext = path.extname(file).toLocaleLowerCase();

      if (fs.statSync(path.join(downloadsFolder, file)).isDirectory()) {
        return;
      }
      const destinationFolder = getDestinationFolder(ext);
      moveFileToFolder(file, destinationFolder);
    });
  });
};

const getDestinationFolder = (extension) => {
  // List the file formats and their corresponding destination folders here
  const fileFormats = {
    images: [".jpg", ".png", ".gif", ".webp", ".jfif"],
    videos: [".mp4", ".avi", ".mov"],
    documents: [".pdf", ".doc", ".docx", ".txt", ".csv"],
    music: [".mp3", ".wav"],
    compressed: [".zip", ".rar", ".7z"],
    executables: [".exe", ".msi", ".iso"],
    svg: [".svg"],
    others: [], // Fallback for all other file types
  };
  for (const folder in fileFormats) {
    if (fileFormats[folder].includes(extension)) {
      return folder;
    }
  }

  return "others";
};

organizeFiles();
