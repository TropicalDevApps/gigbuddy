import fs from 'fs';

const lines = fs.readFileSync('src/App.tsx', 'utf-8').split('\n');

const extract = (name, start, end) => {
  const code = lines.slice(start - 1, end).join('\n');
  fs.writeFileSync(`src/components/${name}.tsx`, code);
};

extract('LyricLine', 38, 146);
extract('DraggableStageBlock', 148, 188);
extract('GlobalSettingsView', 190, 533);
extract('UserConfigView', 535, 626);
extract('BandConfigView', 629, 850);

// We need to add imports to these new files
const lyricLineImports = `import React from 'react';\nimport { motion } from 'motion/react';\nimport { cn } from '../lib/utils';\nimport { transposeChord } from '../lib/musicUtils';\nimport { LyricsLine } from '../types';\n\n`;
fs.writeFileSync('src/components/LyricLine.tsx', lyricLineImports + 'export ' + fs.readFileSync('src/components/LyricLine.tsx', 'utf-8'));

const draggableImports = `import React from 'react';\nimport { Reorder, useDragControls } from 'motion/react';\nimport { Eye, EyeOff, GripVertical } from 'lucide-react';\nimport { cn } from '../lib/utils';\n\n`;
fs.writeFileSync('src/components/DraggableStageBlock.tsx', draggableImports + 'export ' + fs.readFileSync('src/components/DraggableStageBlock.tsx', 'utf-8'));

const globalSettingsImports = `import React from 'react';\nimport { Reorder } from 'motion/react';\nimport { X, Layers, ExternalLink, AlignLeft, GripVertical, Check } from 'lucide-react';\nimport { cn } from '../lib/utils';\nimport { DraggableStageBlock } from './DraggableStageBlock';\n\n`;
fs.writeFileSync('src/components/GlobalSettingsView.tsx', globalSettingsImports + 'export ' + fs.readFileSync('src/components/GlobalSettingsView.tsx', 'utf-8'));

const userConfigImports = `import React, { useState } from 'react';\nimport { X, UserCircle, Users } from 'lucide-react';\nimport { Button } from './ui/Button';\nimport { UserProfile } from '../types';\n\n`;
fs.writeFileSync('src/components/UserConfigView.tsx', userConfigImports + 'export ' + fs.readFileSync('src/components/UserConfigView.tsx', 'utf-8'));

const bandConfigImports = `import React, { useState, useEffect } from 'react';\nimport { X, Shield, Copy, Trash2, LogOut, Globe, Users, UserCircle } from 'lucide-react';\nimport { cn } from '../lib/utils';\nimport { bandService } from '../services/bandService';\nimport { Band, UserProfile } from '../types';\nimport { User } from 'firebase/auth';\n\n`;
fs.writeFileSync('src/components/BandConfigView.tsx', bandConfigImports + 'export ' + fs.readFileSync('src/components/BandConfigView.tsx', 'utf-8'));

// Now we need to remove them from App.tsx and add the imports
let appTsx = fs.readFileSync('src/App.tsx', 'utf-8');
const appLines = appTsx.split('\n');

const newAppLines = [
  ...appLines.slice(0, 29),
  "import { LyricLine } from './components/LyricLine';",
  "import { DraggableStageBlock } from './components/DraggableStageBlock';",
  "import { GlobalSettingsView } from './components/GlobalSettingsView';",
  "import { UserConfigView } from './components/UserConfigView';",
  "import { BandConfigView } from './components/BandConfigView';",
  ...appLines.slice(29, 37),
  // skip 38 to 850
  ...appLines.slice(851) // export default function App()
];

fs.writeFileSync('src/App.tsx', newAppLines.join('\n'));
