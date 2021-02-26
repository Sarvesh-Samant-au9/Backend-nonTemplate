// // FileSystem Module
// const fsModule = require("fs");
// // Http Module
// const httpModule = require("http");
// // URL MODULE
// const urlModule = require("url");

// // Synchronous Code
// // Reading File
// // const textInput = fsModule.readFileSync("./txt/input.txt", "utf-8");
// // // Getting Output of File
// // // console.log(textInput);

// // // Creating a file
// // const textOutput = `This is avacado:  ${textInput} \nCreated ${Date.now()}`;

// // // New file created with above content at described path
// // fsModule.writeFileSync("./txt/output.txt", textOutput);

// // // async Code
// // // Callback Hell
// // fsModule.readFile("./txt/start.txt", "utf-8", (err, data1) => {
// //   if (err) throw err;
// //   fsModule.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
// //     console.log(data2);
// //     fsModule.readFile("./txt/append.txt", "utf-8", (err, data3) => {
// //       console.log(data3);

// //       fsModule.writeFile(
// //         "./txt/output.txt",
// //         `${data2}\n ${data3}`,
// //         "utf-8",
// //         (err) => {
// //           console.log("File Written");
// //         }
// //       );
// //     });
// //   });
// // });
// // console.log("Sarvesh");

// // Create A Server

// // For Api sync code is more easy and efficient
// const data = fsModule.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// // console.log(datap)
// const dataObj = JSON.parse(data);
// const server = httpModule.createServer((req, res) => {
//   // console.log(res);
//   // console.log(req, "This is Request");
//   const pathName = req.url;
//   if (pathName === "/overview" || pathName === "/") {
//     res.end("Overview Here");
//   } else if (pathName === "/product") {
//     res.end("Get products Here");
//   } else if (pathName === "/api") {
//     // fsModule.readFile(`./dev-data/data.json`, "utf-8", (err, data) => {
//     //   const productData = JSON.parse(data);
//     //   console.log(data);
//     //   // console.log(productData);
//     res.writeHead(200, { "Content-type": "application/json" });
//     //   res.end(data);
//     // });
//     res.end(data);
//   } else {
//     res.writeHead(404, {
//       //      // Header is a piece of information
//       "Content-type": "text/html",
//       newHeader: "my own defined header",
//     });
//     res.end("<h1>Page Canoot Be Found</h1>");
//   }
//   // console.log(req.url);
// });
// // //server.listen("Port Number", "Host", Optional Call Back Function)
// server.listen(8008, "127.0.0.1", () => {
//   console.log("Welcome to the Port 8008");
// });

const fsModule = require("fs");
// _________________TEMPLATE DISPLAY _______________ PART 15
const httpModule = require("http");

// const replaceTemplate = (temp, product) => {
//   // using regex
//   let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//   output = output.replace(/{%IMAGE%}/g, product.image);
//   output = output.replace(/{%PRICE%}/g, product.price);
//   output = output.replace(/{%FROM%}/g, product.from);
//   output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//   output = output.replace(/{%QUANTITY%}/g, product.quantity);
//   output = output.replace(/{%DESCRIPTION%}/g, product.description);
//   output = output.replace(/{%ID%}/g, product.id);
//   if (!product.organic) {
//     output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
//   }
//   return output;
// };

const urlModule = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

const templateOverView = fsModule.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);

const templateCard = fsModule.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);

const templateProduct = fsModule.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const data = fsModule.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// 3rd party module
// CHAPTER 20
// const slugify = require("slugify");
// const slugs = dataObj.map((element) =>
//   slugify(element.productName, { lower: true })
// );
// console.log(slugs);

const server = httpModule.createServer((req, res) => {
  // const pathName = req.url;

  // console.log(req.url);
  // console.log(urlModule.parse(req.url, true));
  const { query, pathname, path } = urlModule.parse(req.url, true);

  // OVERview PAge
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "html" });

    const cardsHtml = dataObj
      .map(function (element) {
        return replaceTemplate(templateCard, element);
      })
      .join("");
    // console.log(cardsHtml);
    const output = templateOverView.replace(`{%PRODUCT_CARDS%}`, cardsHtml);

    // res.end(templateOverView);
    res.end(output);
  }

  // Product Page
  else if (pathname === "/product") {
    console.log(query);
    res.writeHead(200, {
      "Content-type": "html",
    });
    console.log(dataObj[2]);
    const product = dataObj[query.id];
    console.log("This IS PRoduct", product);
    const output = replaceTemplate(templateProduct, product);
    // res.end("Get products Here");
    res.end(output);
  }

  // API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  // Error Or NotFound
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      newHeader: "my own defined header",
    });
    res.end("<h1>Page Canoot Be Found</h1>");
  }
});

server.listen(8028, "127.0.0.1", () => {
  console.log("Welcome to the Port 8028");
});
