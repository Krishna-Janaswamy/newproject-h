import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";

export const testZip = (urlsList) => {
  const urls = urlsList;
  const zip = new JSZip();
  let count = 0;
  const zipFilename = "downloadAll.zip";
  urls.forEach(async function (url) {
    const urlArr = url.split("/");
    const filename = urlArr[urlArr.length - 1];
    try {
      const file = await JSZipUtils.getBinaryContent(url);
      zip.file(filename, file, { binary: true });
      count++;
      if (count === urls.length) {
        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, zipFilename);
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
};
