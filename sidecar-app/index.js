import Parser from "@postlight/parser";

const command = process.argv[2];
const data = process.argv[3];

const parseHTMLContent = async (url) => {
  const response = await fetch(url);
  const html = await response.text();

  try {
    const document = await Parser.parse(url, {
      html: html
    });
    console.log(JSON.stringify(document));
  } catch (error) {
    console.error("Parse FAILED")
    process.exit(1);
  }
}

// switch (command) {
//   case 'postlight-parse':
//     const html = process.argv[3];

//     console.log(`pong, ${message}`);
//     break;
//   default:
//     console.error(`unknown command ${command}`);
//     process.exit(1);
// }

parseHTMLContent(data);
