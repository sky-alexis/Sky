/*!
 * SkyScript 0.1.0 - langage de programmation pour le web
 * SkyScript => interpréteur (JavaScript) => JavaScript
 * Licence MIT
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SkyScript = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const VERSION = "0.1.0";
  const TYPES = ["number", "string", "any"];

  class SkyScriptError extends Error {
    constructor(message, line) {
      super(line ? "Ligne " + line + " : " + message : message);
      this.name = "SkyScriptError";
      this.line = line || null;
    }
  }

  // Sépare le code des chaînes et des commentaires pour ne jamais modifier ces derniers.
  function split(src) {
    const parts = [];
    let buf = "", bufLine = 1, line = 1, i = 0;
    const flush = () => {
      if (buf) parts.push({ type: "code", text: buf, line: bufLine });
      buf = "";
    };
    while (i < src.length) {
      const c = src[i], n = src[i + 1];
      let end = -1, type = null;
      if (c === "/" && n === "/") {
        end = src.indexOf("\n", i);
        if (end < 0) end = src.length;
        type = "comment";
      } else if (c === "/" && n === "*") {
        end = src.indexOf("*/", i + 2);
        end = end < 0 ? src.length : end + 2;
        type = "comment";
      } else if (c === '"' || c === "'" || c === "`") {
        let j = i + 1;
        while (j < src.length && src[j] !== c) {
          if (src[j] === "\\") j++;
          j++;
        }
        if (j >= src.length) throw new SkyScriptError("chaîne de caractères non fermée", line);
        end = j + 1;
        type = "string";
      }
      if (type) {
        flush();
        const text = src.slice(i, end);
        parts.push({ type, text, line });
        line += text.split("\n").length - 1;
        i = end;
      } else {
        if (!buf) bufLine = line;
        if (c === "\n") line++;
        buf += c;
        i++;
      }
    }
    flush();
    return parts;
  }

  // Vérifie les types des déclarations : const nom: type = valeur
  const DECL = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*([A-Za-z_$][\w$]*)\s*=\s*(.+?);?\s*$/;

  function checkTypes(src) {
    src.split("\n").forEach((text, idx) => {
      if (/^\s*\/\//.test(text)) return;
      const m = text.match(DECL);
      if (!m) return;
      const name = m[1], type = m[2], value = m[3].trim();
      const line = idx + 1;
      if (!TYPES.includes(type)) {
        throw new SkyScriptError('type inconnu "' + type + '" (types disponibles : number, string, any)', line);
      }
      if (type === "number" && /^(["'`]).*\1$/.test(value)) {
        throw new SkyScriptError('"' + name + '" est de type number mais reçoit une chaîne', line);
      }
      if (type === "string" && /^-?\d+(\.\d+)?$/.test(value)) {
        throw new SkyScriptError('"' + name + '" est de type string mais reçoit un nombre', line);
      }
    });
  }

  // Transforme un morceau de code SkyScript en JavaScript.
  function transform(code) {
    return code
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\)\s*:\s*(?:number|string|any)\b(?=\s*\{)/g, ")")
      .replace(/([A-Za-z_$][\w$]*)\s*:\s*(?:number|string|any)\b(?=\s*(?:[=,);]|$))/gm, "$1");
  }

  function compile(src) {
    if (typeof src !== "string") throw new SkyScriptError("le code source doit être du texte");
    checkTypes(src);
    return split(src)
      .map((p) => (p.type === "code" ? transform(p.text) : p.text))
      .join("");
  }

  function run(src, options) {
    options = options || {};
    const js = compile(src);
    return new Function("console", js)(options.console || console);
  }

  // Dans une page HTML : <script type="text/skyscript"> ... </script>
  // ou <script type="text/skyscript" src="app.sky"></script>
  async function runPage() {
    const scripts = document.querySelectorAll('script[type="text/skyscript"]');
    for (const s of scripts) {
      try {
        const src = s.src ? await (await fetch(s.src)).text() : s.textContent;
        run(src);
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", runPage);
    else runPage();
  }

  return { version: VERSION, compile, run, runPage, SkyScriptError };
});
   
