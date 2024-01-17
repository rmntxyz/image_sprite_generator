import nsg from "node-sprite-generator";
import fs from "fs";
import path from "path";

const gen_sprite = async (target) => {
  const input = target + "/*.png";
  const outputPath = path.join(path.resolve(), target, "sprite");

  console.log(target);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // defaults
  const options = {
    compositor: "jimp",
    src: [input],
    spritePath: outputPath + "/items.png",
    stylesheetPath: outputPath + "/items.json",
    layout: "packed",
    stylesheet: function (
      layout,
      stylesheetPath,
      spritePath,
      options,
      callback
    ) {
      const sprites = layout.images.reduce((acc, image) => {
        const filename = image.path.split("/").pop().split(".")[0];
        acc[filename] = {
          x: image.x,
          y: image.y,
          width: image.width,
          height: image.height,
        };

        return acc;
      }, {});

      const spritesheet = {
        meta: {
          image: spritePath.split("/").pop(),
          size: {
            w: layout.width,
            h: layout.height,
          },
        },
        sprites,
      };

      // write to file
      fs.writeFileSync(stylesheetPath, JSON.stringify(spritesheet, null, 2));

      callback();
    },
  };

  return new Promise((resolve, reject) => {
    nsg(options, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

export default gen_sprite;
