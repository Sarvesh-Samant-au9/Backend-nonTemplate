const fsModule = require("fs");
const httpModule = require("http");
const { element } = require("prop-types");
const urlModule = require("url");

const templateOverview = fsModule.readFileSync(
  `${__dirname}/template/template--Overview.html`,
  "utf-8"
);

const templateCard = fsModule.readFileSync(
  `${__dirname}/template/template--Card.html`,
  "utf-8"
);

const EachCountryInfo = fsModule.readFileSync(
  `${__dirname}/template/singleCountryCard.html`,
  "utf-8"
);

const BorderNations = fsModule.readFileSync(
  `${__dirname}/template/BorderElementSingle.html`,
  "utf-8"
);

const childBorder = fsModule.readFileSync(
  `${__dirname}/template/mappedBorders.html`,
  "utf-8"
);
// UTF-8 is important so keep it otherwise we will get Buffer
const replaceTemplate = (temp, country) => {
  // using regex
  console.log(temp);
  // console.log(country.name);
  let output = temp.replace(/{%COUNTRY_NAME%}/g, country.name);
  output = output.replace(/{%COUNTRY_FLAG%}/g, country.flag);
  output = output.replace(/{%COUNTRY_CAPITAL%}/g, country.capital);
  output = output.replace(/{%COUNTRY_REGION%}/g, country.region);
  output = output.replace(/{%COUNTRY_SUB_REGION%}/g, country.subregion);
  output = output.replace(/{%COUNTRY_POPULATION%}/g, country.population);
  output = output.replace(/{%COUNTRY_AREA%}/g, country.area);
  output = output.replace(/{%ID%}/g, country.cioc);
  output = output.replace(/{%COUNTRY_ID%}/g, country.id);

  return output;
};
//
const replaceBorder = (temp, singleBorderCountryEle) => {
  // console.log(singleBorderCountryEle);
  let output = temp;
  output = output.replace(/{%COUNTRY-BORDER%}/g, singleBorderCountryEle);
  // console.log(output);
  return output;
};

const data = fsModule.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObject = JSON.parse(data);
// console.log(dataObject);

const server = httpModule.createServer((req, res) => {
  // const pathname = req.url;
  const { query, pathname } = urlModule.parse(req.url, true);

  //
  // OverView Page
  //
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "html" });

    const cardHtml = dataObject
      .map(function (element) {
        return replaceTemplate(templateCard, element);
      })
      .join(" ");
    // console.log(cardHtml);
    const output = templateOverview.replace(`{%COUNTRY_CARDS%}`, cardHtml);
    res.end(output);
  }

  // More Country Info
  else if (pathname === "/country") {
    // console.log(query);
    const borderHTML = dataObject[query.id].borders
      .map((border) => replaceBorder(BorderNations, border))
      .join(" ");
    // console.log(borderHTML);
    const allBorders = childBorder.replace(`{%BORDER-NATIONS%}`, borderHTML);

    // console.log(allBorders);
    // console.log(res);
    // console.log(dataObject[query.id].borders);

    res.writeHead(200, { "Content-type": "html" });
    // console.log(countryName);
    const country = dataObject[query.id];
    const outputCountry = replaceTemplate(EachCountryInfo, country);
    const finalDisplay = outputCountry + allBorders;
    // console.log(outputCountry);
    // res.send(`${outputCountry}, ${allBorders}`);
    res.end(finalDisplay);
  }

  // Calling  API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  // Error Page Not Found
  else {
    res.end("<> Page Cannot Be Found </>");
    res.writeHead(404, {
      "Content-type": "html/text",
    });
  }
});

server.listen(8008, "127.0.0.1", () => {
  console.log("Welcome to the Port 8008");
});
