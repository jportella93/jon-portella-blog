import React from 'react';
import Kofi from '../Kofi';

const CONFIG = {
  LOAD_COMMENTS_BTN_PATH: "article ul > li > div > button",
  COMMENT_CONTAINER_PATH: "article > div ul",
  COMMENT_PATH: "article ul > ul",
  MAX_LOADING_COMMENTS_TIME: 1000 * 5, // 5 seconds
  SLEEP_TIME: 2000, // 2 seconds
}

function InstagramCommentPickerConversation(
  { rules, phase, increasePhase, goToPhase,
  copyCodeToClipboard, addRule, deleteRule, allowDuplicatedUsers}
  ) {

  const containerStyle = {
    minHeight: '60vh',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backBtnStyle = {
    position: 'absolute',
    left: '0',
    top: '0',
    borderRadius: '10px',
    padding: '5px 20px',
  },
  infoTitleStyle = {},
  emojisStyle = {
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  answerBtnContainerStyle = {},
  answerBtnStyle = {
    margin: '0 20px',
    borderRadius: '10px',
    padding: '5px 20px',
  },
  areThereMoreKeywordRules = () => rules.find(rule => rule.type === 'keyword' && rule.word !== '@')

  function renderConversationByPhase(phase) {
    switch (phase) {
      case 'readyToStart':{
        deleteRule({type: 'deleteAllRules'})
        return (
          <>
            <h2 style={infoTitleStyle}>Free Instagram Random Comment Picker</h2>
            <h2 style={emojisStyle}>✅ 🖥 💻 </h2>
            <h2 style={emojisStyle}>❌ 📱  </h2>
            <small style={infoTitleStyle}><b>Note: This comment picker needs to be run from a computer.</b><br/>
            If you are viewing this from your smartphone or tablet, please open this website from a desktop or laptop computer. <br/>
            Otherwise you won't be able to pick your random comment! :)</small>
            <br />
            <p><a href="https://youtu.be/0x2O-_BgDe8" target="_blank">Tutorial on YouTube</a></p>
            <div style={answerBtnContainerStyle}>
              <button style={answerBtnStyle} onClick={() => {
                increasePhase()
                }}>Start</button>
            </div>
            <br /><br />
          </>
        )}
      case 'questionDuplicate':
        deleteRule({ type: 'allowDuplicatedUsers'})
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('readyToStart')}>Back</button>
            <h2 style={infoTitleStyle}>Do you allow more than one comment per person?</h2>
            <div style={answerBtnContainerStyle}>
              <button style={answerBtnStyle} onClick={() => {allowDuplicatedUsers(true);increasePhase()}}>Yes</button>
              <button style={answerBtnStyle} onClick={() => {allowDuplicatedUsers(false);increasePhase()}}>No</button>
            </div>
          </>
        )
      case 'questionMentions':
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('questionDuplicate')}>Back</button>
            <h2 style={infoTitleStyle}>Does the comment require to mention other users?</h2>
            <div style={answerBtnContainerStyle}>
              <button style={answerBtnStyle} onClick={() => increasePhase()}>Yes</button>
              <button style={answerBtnStyle} onClick={() => goToPhase('questionRules')}>No</button>
            </div>
          </>
        )
      case 'addRuleMentionUsers':{
        function handleSubmit() {
          deleteRule({word: '@'}) // Clean any previous rule like this first
          const usersToMention = document.querySelector('#users-to-mention').value
          addRule({
            type: 'keyword',
            word: '@',
            caseSensitive: false,
            times: usersToMention,
            message: `Comment mentions ${usersToMention} or more users`
          })
          increasePhase()
        }
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('questionMentions')}>Back</button>
            <h2 style={infoTitleStyle}>How many users does the comment need to mention?</h2>
            <form onSubmit={() => handleSubmit()}>
              <input id="users-to-mention" type="number" min="1" defaultValue="3" required autoFocus></input>
            </form>
            <div style={answerBtnContainerStyle}>
            <button style={answerBtnStyle} onClick={() => handleSubmit()}>Next</button>
            </div>
          </>
        )}
      case 'questionRules': {
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('questionMentions')}>Back</button>
            <h2 style={infoTitleStyle}>Does the comment require any {areThereMoreKeywordRules() ? 'other ' : ''}keyword or phrase?</h2>
            <div style={answerBtnContainerStyle}>
            <button style={answerBtnStyle} onClick={() => increasePhase()}>Yes</button>
            <button style={answerBtnStyle} onClick={() => goToPhase('confirmRules')}>No</button>
            </div>
          </>
        )}
      case 'addRuleMentionWords':{
        function handleSubmit() {
          const word = document.querySelector('#word').value
          word ? addRule({
            type: 'keyword',
            word,
            message: `Comment includes: ${word}`
            }) : null;
          increasePhase()
        }
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('questionRules')}>Back</button>
            <h2 style={infoTitleStyle}>{`Which ${areThereMoreKeywordRules() ? 'other ' : ''}word or phrase needs to be in the comment?`}</h2>
            <form onSubmit={() => handleSubmit()}>
              <input id="word" type="text" defaultValue="winner!" required autoFocus></input>
            </form>
            <div style={answerBtnContainerStyle}>
            <button style={answerBtnStyle} onClick={() => handleSubmit()}>Next</button>
            </div>
          </>
        )}
      case 'maybeAddAnotherRule': {
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('addRuleMentionWords')}>Back</button>
            <h2 style={infoTitleStyle}>Do you want to add another word or phrase?</h2>
            <div style={answerBtnContainerStyle}>
            <button style={answerBtnStyle} onClick={() => goToPhase('addRuleMentionWords')}>Yes</button>
            <button style={answerBtnStyle} onClick={() => goToPhase('confirmRules')}>No</button>
            </div>
          </>
        )}
      case 'confirmRules': {
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('questionRules')}>Back</button>
            <h2 style={infoTitleStyle}>Are this the rules you want to apply?</h2>
            <ul>
            {rules.map((rule, i) => <li key={i}>{rule.message}</li>)}
            </ul>
            <div style={answerBtnContainerStyle}>
            <button style={answerBtnStyle} onClick={() => increasePhase()}>Yes</button>
            </div>
          </>
        )}
      case 'finished':{
        function handleSubmit() {
          const succesful = copyCodeToClipboard()
          if (succesful) increasePhase()
        }
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('confirmRules')}>Back</button>
            <h2 style={infoTitleStyle}>Finished! click the button to copy the code</h2>
            <div style={answerBtnContainerStyle}>
            <button style={answerBtnStyle} onClick={() => handleSubmit()}>Copy code to clipboard</button>
            </div>
          </>
        )}
      case 'useExplanation':
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('finished')}>Back</button>
            <h2 style={infoTitleStyle}>Now what?</h2>
            <ol>
              <li>Go to an <a target="_blank" href="https://www.instagram.com/p/BqtANUghNaN/">instagram picture.</a></li>
              <li>Reload the page to make sure the picture shows in full screen.</li>
              <li>Open the JavaScript console. (Cmd + Alt + c) in Safari, (Cmd + Alt + j) in Chrome or check <a target="_blank" href="https://code-maven.com/open-javascript-console">this</a> for other browsers or Windows.</li>
              <li>Paste the code in the console and press enter.</li>
            </ol>
            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
              <button style={{minWidth: '250px', color: 'white', borderRadius: '4px', background: 'limegreen'}} onClick={() => {
                goToPhase('didWork')
                }}>It worked!</button>
              <button style={{minWidth: '250px', color: 'white', borderRadius: '4px', background: 'red'}} onClick={() => {
                goToPhase('didNotWork')
                }}>Didn't work...</button>
            </div>
          </>
        )
      case 'didWork':
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('useExplanation')}>Back</button>
            <h2 style={infoTitleStyle}>Hooray!</h2>
            <p>This is a free utility that I built in my free time, if you found it useful consider inviting me to a coffee so I can build more useful tools! :)</p>
            <button style={{
              background: 'transparent',
              border: 'none',
              width: '142px',
              marginLeft: 'auto',
              marginRight: 'auto',
              height: '0px'
            }}>
            <Kofi/>
            </button>
          </>
        )
      case 'didNotWork':
        return (
          <>
            <button style={backBtnStyle} onClick={() => goToPhase('useExplanation')}>Back</button>
            <h2 style={infoTitleStyle}>Is something wrong?</h2>
            <p>
              Please tell me your problem in the following <a href="https://surveys.hotjar.com/s?siteId=1683987&surveyId=151480" target="_blank">form</a> so I can fix it! :)
            </p>
          </>
        )
      default: null;
    }
  }
  return (
    <div className='instagram-comment-picker-conversation' style={containerStyle}>
      {renderConversationByPhase(phase)}
    </div>
  )
}

class InstagramCommentPickerApp extends React.Component {
  constructor(props) {
    super(props)
    this.phases = [
      'readyToStart',
      'questionDuplicate',
      'questionMentions',
      'addRuleMentionUsers',
      'questionRules',
      'addRuleMentionWords',
      'maybeAddAnotherRule',
      'confirmRules',
      'finished',
      'useExplanation',
      'didWork',
      'didNotWork'
      ]
    this.state = {
      phaseCounter: 0,
    }
    this.rules = []
  }

  increasePhase = (num = 1) => this.setState({phaseCounter: this.state.phaseCounter + num})

  decreasePhase = (num = 1) => this.setState({phaseCounter: this.state.phaseCounter - num})

  goToPhase = (phaseName) => {
    const phaseNumber = this.phases.findIndex(el => el === phaseName)
    this.setState({phaseCounter: phaseNumber})
  }

  /** Test rules:
      const rules = [{
        "type": "allowDuplicatedUsers",
        "value": true,
        "message": "Multiple comments per user are allowed"
      }, {
        "type": "keyword",
        "word": "@",
        "message": "Comment mentions 3 or more users",
        "caseSensitive": false,
        "times": "3"
      }, {
        "type": "keyword",
        "word": "participo",
        "message": "Comment includes: participo"
      }];
   */
  generateScript({rules}) {
    let script = `
    try {
      /* debugger; */
      /* const LOAD_COMMENTS_BTN_PATH = "article ul > li > div > button" */
      /* const COMMENT_CONTAINER_PATH = "article > div ul" */
      /* const COMMENT_PATH = "article ul > ul" */
      /* const MAX_LOADING_COMMENTS_TIME = 1000 * 5; // 5 seconds */
      /* const SLEEP_TIME = 2000; // 2 seconds */
      const rules = {{rules}};
      const LOAD_COMMENTS_BTN_PATH = {{LOAD_COMMENTS_BTN_PATH}};
      const COMMENT_CONTAINER_PATH = {{COMMENT_CONTAINER_PATH}};
      const COMMENT_PATH = {{COMMENT_PATH}};
      const MAX_LOADING_COMMENTS_TIME = {{MAX_LOADING_COMMENTS_TIME}};
      const SLEEP_TIME = {{SLEEP_TIME}};

      function sleep(ms) {
        if (ms < 0)
          ms = 0;
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      async function wait(times = 1) {
        await sleep(SLEEP_TIME * times);
      };

      async function log(message = '', style = '', waitTime = 1, clear = true) {
        if (clear) console.clear();
        console.log('%c' + message, \`font-family: helvetica, sans-serif;font-size:20px;font-weight:bold;\${style}\`);
        await wait(waitTime)
      };

      async function loadComments() {
        const startTime = Date.now();
        const getBtn = () => document.querySelector(LOAD_COMMENTS_BTN_PATH);
        while (getBtn() && Date.now() - startTime < MAX_LOADING_COMMENTS_TIME) {
          getBtn().click();
          await wait(0.5);
        }
      };

      function setBorderColor($el) {
        const style = '3px solid red';
        $el.style.borderTop = style;
        $el.style.borderLeft = style;
      };

      function extractCommentInfo($comments) {
        return Array.from($comments).map((comment) => ({
          userName: comment.querySelector('h3').outerText,
          message: comment.querySelector('h3 + span').outerText
        }));
      };

      function filterCommentsByRules(comments, rules = []) {
        let filteredComments = comments;

        rules.forEach(({type, value, caseSensitive, word, times}) => {

          if (type === 'allowDuplicatedUsers' && value === false) {
            const seen = {};
            filteredComments = filteredComments.map((comment) => {
              const { userName } = comment;
              if (seen[userName]) return null;
              seen[userName] = true;
              return comment;
            }).filter(Boolean);
          } else if (type === 'keyword') {
            const re = new RegExp(word, 'gi');
            filteredComments = filteredComments.map((comment) => {
              const match = comment.message.match(re);
              if (!match) return null;
              if (!times) return comment;
              if (times && match.length == times) return comment;
              return null
            }).filter(Boolean);
          }
        });

        return filteredComments;
      };

      async function logDrumRoll() {
        await log('And the winner is...', '', 0.3);
        await log('🥁', '', 0.3);
        await log('🥁🥁', '', 0.3);
        await log('🥁🥁🥁', '', 0.3);
        await wait(1.5);
      };

      async function pickComment() {
        console.clear();
        await log('Starting comment picker', 'color: red');
        await log('⏳ Loading comments...');
        /* const $commentContainer = document.querySelector(COMMENT_CONTAINER_PATH); */
        /* setBorderColor($commentContainer); */
        await loadComments();
        const $comments = document.querySelectorAll(COMMENT_PATH);
        let comments = extractCommentInfo($comments);
        await log('✅ Comments loaded!');
        /* await log(comments.length); */
        if (Object.keys(rules).length > 0) {
          await log('Comment rules are:');
          Object.values(rules).forEach((ruleProps, i) => {
            log(\` \${i+1}. \${ruleProps.message}\`, '', 1, false);
          });
          await wait(1);
          /* await log('Filtering comments by rules'); */
          comments = filterCommentsByRules(comments, rules);
          if (comments.length === 0) {
            await log('There are no comments that match all the rules');
            return;
          } else {
            /* await log(\`Comments after filtering by rules: \${comments.length}\`); */
          };
        };
        /* await log('Picking a random number'); */
        const rand = Math.floor(Math.random() * comments.length + 1);
        /* await log(\`Random number is: \${rand}\`); */
        const winnerComment = comments.length === 1 ? comments[0] : comments[rand];
        await logDrumRoll();
        await log(\`@\${winnerComment.userName}\`, 'color: red;font-family: impact, sans-serif;font-size:30px;', 0);
        await log(\`Comment: "\${winnerComment.message}"\`, 'color: red;font-family: impact, sans-serif;font-size:30px;', 0, false);
        const $winnerComment = Array.from(document.querySelectorAll('li')).find(el => el.outerText.includes(winnerComment.userName) && el.outerText.includes(winnerComment.message));
        $winnerComment.style.backgroundColor = 'orange';
        $winnerComment.scrollIntoViewIfNeeded();
      }

      pickComment(rules);
      } catch (e) {
      console.error('Something went wrong with the comment picker, please contact the administrator.');
      }
      `

    Object.entries(CONFIG).forEach(([key, value]) => {
      script = script.replace(new RegExp(`{{${key}}}`, 'g'), JSON.stringify(value))
    })
    script = script.replace(/{{rules}}/g, JSON.stringify(rules || {}))
    script = script.replace(/\s\s|\n/g, '')

    return script
  }

  copyCodeToClipboard() {
    const copyTextArea = document.getElementById('scriptHolder')
    copyTextArea.focus()
    copyTextArea.select()

    try {
      document.execCommand('copy');
      return true
    } catch (err) {
      alert('Unable to copy');
      return false
    }
  }

  allowDuplicatedUsers = (bool) =>
    this.addRule({
      type: 'allowDuplicatedUsers',
      message: `Multiple comments per user are ${bool ? 'allowed' : 'not allowed'}`,
      value: bool
    })

  addRule = ({type, word, value, message, caseSensitive, times}) =>
    this.rules.push({ type, word, value, message, caseSensitive, times})

  deleteRule = ({type = null, word = null, value = null}) => {
    if (this.rules.length === 0) return
    if (type === 'deleteAllRules') this.rules = []

    this.rules = this.rules.filter(rule =>
      rule.word !== word && rule.type !== type && rule.value !== value)
  }

  render() {
    const { phaseCounter } = this.state
    const {rules} = this
    const phase = this.phases[phaseCounter]

    return (
      <>
        <InstagramCommentPickerConversation
          rules={rules}
          phase={phase}
          increasePhase={this.increasePhase}
          decreasePhase={this.decreasePhase}
          goToPhase={this.goToPhase}
          allowDuplicatedUsers={this.allowDuplicatedUsers}
          addRule={this.addRule}
          deleteRule={this.deleteRule}
          copyCodeToClipboard={this.copyCodeToClipboard}
        />

        {phase === 'finished' && (
          <>
            <input
              style={{position:'absolute', opacity:0}}
              id="scriptHolder"
              onChange={() => null}
              value={this.generateScript({rules})}
            >
            </input>
          </>
        )}
      </>
    )
  }
}

export default InstagramCommentPickerApp
