import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language detection patterns
const languagePatterns = {
  javascript: [
    /^(const|let|var|function|class|import|export|console\.|window\.|document\.|=>|async|await)/m,
    /\.(js|jsx|mjs)$/,
    /addEventListener|removeEventListener|querySelector|getElementById/,
    /React\.|useState|useEffect|props/,
  ],
  jsx: [
    /<[A-Z][a-zA-Z]*\s|<\/[A-Z]|className=|onClick=|onChange=/,
    /import.*from ['"]react['"]/,
  ],
  typescript: [
    /:\s*(string|number|boolean|any|void|object|Array<)/,
    /interface\s+\w+|type\s+\w+\s*=/,
    /\.tsx?$/,
  ],
  shell: [
    /^(git |npm |yarn |curl |wget |echo |export |cd |ls |mkdir |rm |cp |mv |cat |grep |sed |awk |ssh |scp )/m,
    /^\$|^#!\/bin\/(bash|sh|zsh)/,
    /&& |\|\| |\$\(|`/,
  ],
  bash: [
    /^#!\/bin\/(bash|sh)/,
    /^\$ |^# /,
  ],
  python: [
    /^(import |from |def |class |if __name__|print\(|\.py$)/m,
    /:\s*$/m, // Python-style indentation
  ],
  css: [
    /^[\w-]+\s*\{|@media|@keyframes|@import|\.|#|:hover|:focus/,
    /color:|background:|margin:|padding:|display:|flex|grid/,
  ],
  html: [
    /^<!DOCTYPE|<html|<head|<body|<div|<span|<p|<h[1-6]|<a |<img |<script|<style/,
    /<\/[a-z]+>/,
  ],
  json: [
    /^\s*[\{\[]/,
    /"[\w-]+"\s*:/,
  ],
  markdown: [
    /^#+\s|^\*\s|^-\s|^\d+\.\s|\[.*\]\(.*\)/,
  ],
  sql: [
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN|INNER|OUTER)/i,
  ],
  yaml: [
    /^[\w-]+:\s|^---|^\.\.\./,
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
    // Default to shell if it looks like a command (starts with a command-like word)
    const firstLine = codeTrimmed.split('\n')[0].trim();
    if (/^(git|npm|yarn|curl|wget|echo|export|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|ssh|scp|node|python|ruby|perl|java|go|rust|cargo|docker|kubectl|aws|gcloud|terraform|make|cmake|\.\/)/.test(firstLine)) {
      return 'shell';
    }
    // If it looks like output or log, default to text
    if (/^[a-z-]+(\s+[^\s]+)*$/m.test(firstLine) && firstLine.length < 100) {
      return 'shell';
    }
    return 'text';
  }

  const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  
  // Special case: if JSX patterns match, prefer jsx over javascript
  if (scores.jsx > 0 && scores.javascript > 0) {
    return 'jsx';
  }
  
  // Special case: prefer bash over shell if bash patterns match
  if (scores.bash > 0 && scores.shell > 0 && scores.bash >= scores.shell) {
    return 'bash';
  }

  return detectedLang;
}

function fixCodeBlocks(content) {
  // Match code blocks without language identifier
  // Pattern: ``` followed by newline (not followed by a word character), then code, then ```
  // We need to match ``` at start of line or after whitespace, followed by newline
  // But NOT match ``` that already has a language identifier (```javascript, ```shell, etc.)
  // Also need to avoid matching closing code blocks
  
  // First, let's find all code blocks without language identifiers
  // We'll use a more careful approach: find ```\n that is NOT preceded by ``` on the same line
  // and NOT followed by a word character (which would indicate a language)
  
  const lines = content.split('\n');
  let modified = false;
  const fixedLines = [];
  let inCodeBlock = false;
  let codeBlockStartIndex = -1;
  let codeBlockContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line is a code block delimiter
    // It could be just ``` or ```language
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Opening code block
        // Check if previous line ended with ``` (shouldn't happen, but safety check)
        if (i > 0 && lines[i - 1].trim().endsWith('```')) {
          fixedLines.push(line);
          continue;
        }
        // Check if this is actually a closing block (next line is not code)
        // Actually, we can't know yet, so we'll start tracking
        inCodeBlock = true;
        codeBlockStartIndex = i;
        codeBlockContent = [];
      } else {
        // Closing code block
        if (codeBlockStartIndex >= 0) {
          // We have a code block from codeBlockStartIndex to i
          // Check if it had a language identifier
          const openingLine = lines[codeBlockStartIndex];
          const openingTrimmed = openingLine.trim();
          if (openingTrimmed === '```') {
            // No language identifier, add one
            const code = codeBlockContent.join('\n');
            const lang = detectLanguage(code);
            fixedLines.push(`\`\`\`${lang}`);
            modified = true;
          } else if (openingTrimmed.startsWith('```') && openingTrimmed.length > 3) {
            // Had a language identifier, keep it as is
            fixedLines.push(openingLine);
          } else {
            // Shouldn't happen, but keep as is
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
      // Don't add to fixedLines yet, we'll add it when we close the block
    } else {
      fixedLines.push(line);
    }
  }
  
  // Handle case where code block is not closed (shouldn't happen, but safety)
  if (inCodeBlock && codeBlockStartIndex >= 0) {
    const code = codeBlockContent.join('\n');
    const lang = detectLanguage(code);
    fixedLines[codeBlockStartIndex] = `\`\`\`${lang}`;
    fixedLines.push(...codeBlockContent);
    modified = true;
  }

  return { content: fixedLines.join('\n'), modified };
}

function processMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: fixedContent, modified } = fixCodeBlocks(content);
    
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

