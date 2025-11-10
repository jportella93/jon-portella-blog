import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixClosingCodeBlocks(content) {
  const lines = content.split('\n');
  const fixedLines = [];
  let inCodeBlock = false;
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this is a code block delimiter
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        // Opening code block - keep as is
        inCodeBlock = true;
        fixedLines.push(line);
      } else {
        // Closing code block - should be just ```
        if (trimmed !== '```') {
          // Has extra content (like language identifier), remove it
          // Preserve indentation
          const indent = line.match(/^(\s*)/)[1];
          fixedLines.push(`${indent}\`\`\``);
          modified = true;
        } else {
          fixedLines.push(line);
        }
        inCodeBlock = false;
      }
    } else {
      fixedLines.push(line);
    }
  }
  
  return { content: fixedLines.join('\n'), modified };
}

function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: fixedContent, modified } = fixClosingCodeBlocks(content);
    
    if (modified) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findMarkdownFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.md');
      if (fs.existsSync(indexPath)) {
        files.push(indexPath);
      }
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main execution
const blogDir = path.join(__dirname, '..', 'content', 'blog');
const markdownFiles = findMarkdownFiles(blogDir);

console.log(`Found ${markdownFiles.length} markdown files`);
let fixedCount = 0;

for (const file of markdownFiles) {
  if (processMarkdownFile(file)) {
    fixedCount++;
    console.log(`Fixed: ${path.relative(blogDir, file)}`);
  }
}

console.log(`\nFixed ${fixedCount} out of ${markdownFiles.length} files`);

