import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language detection patterns (same as in fix-code-blocks.mjs)
const languagePatterns = {
  javascript: [
    /^(const|let|var|function|class|import|export|console\.|window\.|document\.|=>|async|await)/m,
    /\.(js|jsx|mjs)$/,
    /addEventListener|removeEventListener|querySelector|getElementById/,
    /React\.|useState|useEffect|props/,
    /new\s+\w+\(|IntersectionObserver|setTimeout|clearTimeout/,
  ],
  jsx: [
    /<[A-Z][a-zA-Z]*\s|<\/[A-Z]|className=|onClick=|onChange=/,
    /import.*from ['"]react['"]/,
  ],
  html: [
    /^<!DOCTYPE|<html|<head|<body|<div|<span|<p|<h[1-6]|<a |<img |<script|<style|<link/,
    /<\/[a-z]+>/,
    /class=|href=|src=/,
  ],
  shell: [
    /^(git |npm |yarn |curl |wget |echo |export |cd |ls |mkdir |rm |cp |mv |cat |grep |sed |awk |ssh |scp )/m,
    /^\$|^#!\/bin\/(bash|sh|zsh)/,
    /&& |\|\| |\$\(|`/,
  ],
  css: [
    /^[\w-]+\s*\{|@media|@keyframes|@import|\.|#|:hover|:focus/,
    /color:|background:|margin:|padding:|display:|flex|grid/,
  ],
};

function detectLanguage(code) {
  const codeTrimmed = code.trim();
  if (!codeTrimmed) return 'text';

  // Count matches for each language
  const scores = {};
  
  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    scores[lang] = 0;
    for (const pattern of patterns) {
      if (pattern.test(codeTrimmed)) {
        scores[lang]++;
      }
    }
  }

  // Find the language with the highest score
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return 'text';
  }

  const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  
  // Special case: if JSX patterns match, prefer jsx over javascript
  if (scores.jsx > 0 && scores.javascript > 0) {
    return 'jsx';
  }

  return detectedLang;
}

function fixUrlLanguageIdentifiers(content) {
  // Match code blocks that start with ```com/ or similar URL patterns
  const urlPattern = /^```[a-z]+\/[^`\n]+$/m;
  const lines = content.split('\n');
  let modified = false;
  const fixedLines = [];
  let inCodeBlock = false;
  let codeBlockStartIndex = -1;
  let codeBlockContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this is a code block delimiter
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        // Opening code block
        // Check if it has a URL-like language identifier
        if (trimmed.match(/^```[a-z]+\/[^`\n]+$/)) {
          // This is a URL-like identifier, we'll replace it when we close the block
          inCodeBlock = true;
          codeBlockStartIndex = i;
          codeBlockContent = [];
        } else {
          // Normal code block, keep as is
          inCodeBlock = true;
          codeBlockStartIndex = i;
          codeBlockContent = [];
          fixedLines.push(line);
        }
      } else {
        // Closing code block
        if (codeBlockStartIndex >= 0) {
          const openingLine = lines[codeBlockStartIndex];
          const openingTrimmed = openingLine.trim();
          
          // Check if opening line had a URL-like identifier
          if (openingTrimmed.match(/^```[a-z]+\/[^`\n]+$/)) {
            // Replace with correct language
            const code = codeBlockContent.join('\n');
            const lang = detectLanguage(code);
            // Preserve indentation
            const indent = openingLine.match(/^(\s*)/)[1];
            fixedLines.push(`${indent}\`\`\`${lang}`);
            modified = true;
          } else {
            // Normal code block, keep as is
            fixedLines.push(openingLine);
          }
          // Add the code content
          fixedLines.push(...codeBlockContent);
        }
        inCodeBlock = false;
        codeBlockStartIndex = -1;
        codeBlockContent = [];
        fixedLines.push(line);
      }
    } else if (inCodeBlock) {
      // We're inside a code block, collect the content
      codeBlockContent.push(line);
    } else {
      fixedLines.push(line);
    }
  }
  
  // Handle case where code block is not closed
  if (inCodeBlock && codeBlockStartIndex >= 0) {
    const openingLine = lines[codeBlockStartIndex];
    const openingTrimmed = openingLine.trim();
    
    if (openingTrimmed.match(/^```[a-z]+\/[^`\n]+$/)) {
      const code = codeBlockContent.join('\n');
      const lang = detectLanguage(code);
      const indent = openingLine.match(/^(\s*)/)[1];
      fixedLines.push(`${indent}\`\`\`${lang}`);
      fixedLines.push(...codeBlockContent);
      modified = true;
    } else {
      fixedLines.push(openingLine);
      fixedLines.push(...codeBlockContent);
    }
  }

  return { content: fixedLines.join('\n'), modified };
}

function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: fixedContent, modified } = fixUrlLanguageIdentifiers(content);
    
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

