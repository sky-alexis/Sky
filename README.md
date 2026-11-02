# SkyScript

Un langage de programmation pour le web, écrit en JavaScript.

```
SkyScript  =>  interpréteur (JavaScript)  =>  JavaScript
```

## Exemple

```
function Test() {
  const name: string = "Alexis";
  const age: number = 13;
  console.log(name);
  console.log(age);
  console.log(age + 5);
}

Test();
```

Une fonction ne s'exécute que lorsqu'on l'appelle (`Test();`).

## Syntaxe (version 0.1.0)

| Élément | Syntaxe |
|---|---|
| Variables | `const`, `let`, `var` |
| Types | `number`, `string`, `any` |
| Fonctions | `function Nom() { }` |
| Console | `console.log(...)` |
| Maths | `+`  `-`  `×`  `÷` |

Les types sont vérifiés sur les déclarations (`const age: number = "abc"` donne une erreur avec le numéro de ligne), puis retirés du JavaScript généré. Le symbole `×` devient `*` et `÷` devient `/`.

## Utilisation dans une page HTML

```html
<script src="skyscript.js"></script>
<script type="text/skyscript">
  function Test() {
    console.log("Bonjour depuis SkyScript");
  }
  Test();
</script>
```

On peut aussi charger un fichier : `<script type="text/skyscript" src="examples/hello.sky"></script>`.

Ouvre `index.html` pour essayer le langage dans un éditeur en ligne.

## Utilisation en JavaScript

```js
const SkyScript = require("./skyscript.js");

SkyScript.compile('const a: number = 2 × 3;'); // "const a = 2 * 3;"
SkyScript.run('console.log(10 ÷ 2);');          // affiche 5
```

## Limites de la version 0.1.0

- Les expressions dans les gabarits `` `${...}` `` ne sont pas traduites (`×` et `÷` y restent tels quels).
- Les types ne sont vérifiés que pour les littéraux dans les déclarations.
- Pas encore de syntaxe HTML intégrée : le DOM s'utilise comme en JavaScript (`document.querySelector`, etc.).

## Licence

MIT
