import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const download = (url, destPath) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => {
        const { status } = res;
        if (status !== 200) {
          reject(new Error(`Request Failed. Status Code: ${status}`));
        }

        const dest = fs.createWriteStream(destPath);
        res.body.pipe(dest);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const createDownloadRequests = (files, path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const requests = [];
  for (const { url, id } of files) {
    requests.push(download(url, `${path}/${id}.png`));
  }
  return requests;
};

const downloadImages = async (files, dest) => {
  try {
    const requests = createDownloadRequests(
      files,
      path.join(path.resolve(), dest)
    );
    await Promise.all(requests);
  } catch (err) {
    throw err;
  }
};

export default downloadImages;
