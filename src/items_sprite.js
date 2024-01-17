import downloadImages from "./lib/download.js";
import gen_sprite from "./lib/gen_sprite.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import inquirer from "inquirer";
dotenv.config();

// const images = [
//   {
//     id: 3,
//     url: "https://storage.googleapis.com/rmnt/bromide_49aa8a368b/bromide_49aa8a368b.png",
//   },
//   {
//     id: 4,
//     url: "https://storage.googleapis.com/rmnt/Cactus_6d226c0cc2/Cactus_6d226c0cc2.png",
//   },
// ];

async function main() {
  try {
    const res = await fetch(process.env.API_URL + "/api/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    const data = await res.json();

    const list = data.map(({ id, rid, items }) => ({
      id,
      rid,
      items: items.map(({ id, image }) => ({
        id,
        url: image.url,
      })),
    }));

    const dest = `output/room`;

    for (const { id, rid, items } of list) {
      await downloadImages(items, `${dest}/${id}_${rid}`);
    }
    for (const { id, rid } of list) {
      await gen_sprite(`${dest}/${id}_${rid}`);
    }
    // await upload
  } catch (err) {
    console.log(err);
  }
  console.log("done");
}

main();
