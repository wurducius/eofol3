const fs = require("fs");
const path = require("path");

NodeHTMLParser = require("node-html-parser");
const { parse } = NodeHTMLParser;
const { minify } = require("html-minifier-terser");
const validator = require("html-validator");

const component = parse("<div>Eofol3 custom component example</div>");

const html = fs.readFileSync(
  path.resolve(fs.realpathSync(process.cwd()), "public", "index.html")
);

const tree = parse(html.toString());

const result = parse(`<!DOCTYPE html><html lang="en"></html>`);
const resultDoc = parse(`<!DOCTYPE html><html lang="en"></html>`);

const treeHead = tree.querySelector("head");
const treeBody = tree.querySelector("body");

const resultHead = result.querySelector("html");
const resultBody = result.querySelector("html");

function transverseTree(source, target) {
  let render;
  if (source.rawTagName === "eofol") {
    render = component;
  } else {
    render = source;
  }
  target.appendChild(render);

  const targetChild = target.childNodes[target.childNodes.length - 1];
  if (source.childNodes) {
    for (let i = 0; i < source.childNodes.length; i++) {
      return transverseTree(
        source.childNodes[source.childNodes.length - 1 - i],
        targetChild
      );
    }
  } else {
    return;
  }
}

transverseTree(treeHead, resultHead);
transverseTree(treeBody, resultBody);

const resultDocx = resultDoc.querySelector("html");
resultDocx.appendChild(resultHead);
resultDocx.appendChild(resultBody);

// @TODO !!!!! hack warning

minify(resultDocx.childNodes[0].toString())
  .then((output) => {
    const options = {
      url: "http://url-to-validate.com",
      format: "text",
      data: output,
    };

    try {
      validator(options);
      console.log("VALID HTML");
    } catch (ex) {
      console.log("INVALID HTML");
    }

    return output;
  })
  .then((output) => {
    const derivedPath = path.resolve(fs.realpathSync(process.cwd()), "derived");

    if (!fs.existsSync(derivedPath)) {
      fs.mkdirSync(derivedPath);
    }

    const indexPath = path.resolve(derivedPath, "index.html");

    fs.writeFileSync(indexPath, output.toString());

    console.log("Eofol3 compilation success!");
  });
