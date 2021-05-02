const [postUrl] = process.argv.slice(2)
const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html2md = require('html-to-md')
const fetch = require('node-fetch')

// TODO: RIGHT NOW GISTS ARE ADDED AT THE END OF THE FILE, THEY SHOULD BE IN PLACE OF THE IFRAMES

async function importFromMedium() {
    try {

        // Get post url
        if (!postUrl || typeof postUrl !== 'string') throw new Error('Arg postUrl should be a string, received', postUrl)

        // Extract post content
        let postContent = '';

        if (postUrl.includes('http')) {
            // fetch post
            // postContent = fetched Post
        } else {
            postContent = fs.readFileSync(postUrl, 'utf-8')
        }


        // extract from html
        const { window: { document } } = new JSDOM(postContent);
        const date = document.querySelector('time.dt-published').getAttribute('datetime')
        const url = document.querySelector('a.p-canonical').getAttribute('href')
            .split('/').slice(-1).join('')
            .split('-').slice(0, -1).join('-')
        const spoiler = document.querySelector('section.p-summary').textContent.replace(/\n/g, '')
        const title = document.querySelector('h1.p-name').textContent.replace(/\n/g, '')
        const imgs = Array.from(document.querySelectorAll('img'));
        const featuredImg = imgs.find(img => Boolean(img.getAttribute('data-is-featured')))
        const featuredImgSrc = featuredImg ? featuredImg.getAttribute('src') : null;
        const gistScriptTags = Array.from(document.querySelectorAll('script'))
            .filter(script => {
                const src = script.getAttribute('src')
                if (src) {
                    return src.includes('gist')
                }
            })

        const gistUrls = gistScriptTags
            .map(script => {
                const src = script.getAttribute('src');
                const srcParts = src.split('/')
                const user = srcParts.slice(-2, -1)
                const gistHash = srcParts.slice(-1)[0].split('.js')[0]
                const file = src.includes('file=') ? srcParts.slice(-1)[0].split('file=')[1]
                    .replace(/.js$/, '') : ''
                const rawUrl = `https://gist.githubusercontent.com/${user}/${gistHash}/raw/${file}`
                return rawUrl
            })

        const gistContents = await Promise.all(gistUrls.map(async (gistSrc, i) => {
            const response = await fetch(gistSrc);
            const gistContent = await response.text();
            return gistContent
        }))

        const propertiesMap = new Map([
            ['date', date],
            ['url', url],
            ['spoiler', spoiler],
            ['title', title],
            ['title', title],
        ])
        for (let [key, value] of propertiesMap) {
            if (!value) throw new Error(`Error extracting data from post. Expected value for ${key} but received ${value}`)
        }

        // Create post and img dir
        const postDir = path.join(__dirname, 'blog', url)
        if (!fs.existsSync(postDir)) fs.mkdirSync(postDir)

        const imgDir = path.join(postDir, 'images')
        if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir)

        // download images and put them under /img, links them to content
        const otherImgSrcs = imgs
            .filter(img => !Boolean(img.getAttribute('data-is-featured')))
            .map(img => img.getAttribute('src'))

        const imgSrcs = [featuredImgSrc, ...otherImgSrcs].filter(Boolean);
        const imgSrcsMap = new Map()
        await Promise.all(imgSrcs.map(async (imgSrc, i) => {
            const response = await fetch(imgSrc);
            const buffer = await response.buffer();
            const imgPath = path.join('images', `${i}.png`)
            const absImgPath = path.join(postDir, imgPath)
            const relImgPath = path.join('./', imgPath)
            imgSrcsMap.set(imgSrc, relImgPath)
            await fs.promises.writeFile(absImgPath, buffer)
        }))

        // Transform html to md and cleanup
        let md = html2md(postContent)
        md = md
            .replace(/\*\* \*\*/g, '') // Remove empty punctuation
            .replace(/\n<article>[\n\s\S]*?---\n\n/g, '') // Remove first lines
            .replace(/### OM.*\n\n/, '') // Remove OM* title
            .replace(/Welcome to issue.*\n\n/, '') // Remove "Welcome to this new series..."
            .replace(/.*🔛.*\n/g, '') // Replace navigation buttons
            .replace(/.*If you liked this[\n\s\S]*/g, '') // Remove last part "if you liked this story you might also like..."
            .replace(/By \[Jon Portella\][\n\s\S]*/g, '') // Replace last signature
            .replace(/<.*?>/g, '') // Remove missing html tags

        // Replace img urls for rel img paths
        for (let [url, path] of imgSrcsMap) {
            md = md.replace(url, path)
        }

        // Add newlines before and after imgs
        md = md.replace(/(!\[\]\(images.*)/g, '\n$1\n')

        // add gists content
        gistContents.forEach((content, i) => {
            const extension = gistUrls[i].split('.').slice(-1)
            const script = `\`\`\`${extension}\n${content}\n\`\`\``
            md = `${md}\n\n${script}`
        })

        // Add frontmatter
        const frontmatter = [
            '---',
            `title: ${title}`,
            `spoiler: ${spoiler}`,
            `date: ${date}`,
            '---',
            ''
        ].join('\n')

        md = `${frontmatter}\n${md}`

        // Write md content to file
        fs.writeFileSync(path.join(postDir, 'index.md'), md)

        // extract valuable html
        // removes the header (welcome to...) and icons
    } catch (error) {
        console.error(error)
    }
}

importFromMedium()
