import fs from 'fs';
import path from 'path';

const appTsx = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf-8');
const match = appTsx.match(/const setlist = (\[[\s\S]*?\]);\n\n    try \{/);
if (match) {
  // Use new Function to parse the JS array definition into an actual object
  const setlistArray = new Function(`return ${match[1]}`)();
  fs.writeFileSync(path.join(process.cwd(), 'database.json'), JSON.stringify(setlistArray, null, 2));
  fs.writeFileSync(path.join(process.cwd(), 'public/database.json'), JSON.stringify(setlistArray, null, 2));
  console.log("Valid JSON generated in public/database.json and root");
} else {
  console.log("Could not find setlist");
}
