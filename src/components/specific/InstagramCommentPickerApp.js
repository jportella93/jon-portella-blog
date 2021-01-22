import { trackCustomEvent } from 'gatsby-plugin-google-analytics'
import React from 'react'
import Kofi from '../Kofi'

const CONFIG = {
  loadMoreCommentsBtnSelector: "#react-root > section > main > div > div > article > div > div > ul > li > div > button > span",
  comentNodeSelector: '#react-root > section > main > div > div > article > div.eo2As > div > ul > ul > div > li > div > div > div:nth-child(2)',
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
  areThereMoreKeywordRules = () => rules.find(rule => rule.key === 'keyword' && rule.word !== '@')

  function renderConversationByPhase(phase) {
    switch (phase) {
      case 'readyToStart':{
        deleteRule({key: 'deleteAllRules'})
        return (
          <>
            <h2 style={infoTitleStyle}>Free Instagram Random Comment Picker</h2>
            <h2 style={emojisStyle}>✅ 🖥 💻 </h2>
            <h2 style={emojisStyle}>❌ 📱  </h2>
            <small style={infoTitleStyle}><b>Note: This comment picker needs to be run from a computer.</b><br/>
            If you are viewing this from your smartphone or tablet, please open this website from a desktop or laptop computer. <br/>
            Otherwise you won't be able to pick your random comment! :)</small>
            <br /><br />
            <div style={answerBtnContainerStyle}>
              <button style={answerBtnStyle} onClick={() => {
                increasePhase()
                trackCustomEvent({
                  category: "Comment Picker - start",
                  action: "Click",
                })
                }}>Start</button>
            </div>
          </>
        )}
      case 'questionDuplicate':
        deleteRule({ key: 'allowDuplicatedUsers'})
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
            key: 'keyword',
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
            key: 'keyword',
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
                trackCustomEvent({
                  category: "Comment Picker - worked",
                  action: "Click",
                })
                }}>It worked!</button>
              <button style={{minWidth: '250px', color: 'white', borderRadius: '4px', background: 'red'}} onClick={() => {
                goToPhase('didNotWork')
                trackCustomEvent({
                  category: "Comment Picker - not worked",
                  action: "Click",
                })
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
            }}
            onClick={() => {
              trackCustomEvent({
                category: "Comment Picker - koffi",
                action: "Click",
              })
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
      rules: [],
      phaseCounter: 0,
    }
  }

  increasePhase = (num = 1) => this.setState({phaseCounter: this.state.phaseCounter + num})

  decreasePhase = (num = 1) => this.setState({phaseCounter: this.state.phaseCounter - num})

  goToPhase = (phaseName) => {
    const phaseNumber = this.phases.findIndex(el => el === phaseName)
    this.setState({phaseCounter: phaseNumber})
  }

  /** Test rules:
      const rules = [{
        "key": "allowDuplicatedUsers",
        "value": true,
        "message": "Multiple comments per user are allowed"
      }, {
        "key": "keyword",
        "word": "@",
        "message": "Comment mentions 3 or more users",
        "caseSensitive": false,
        "times": "3"
      }, {
        "key": "keyword",
        "word": "participo",
        "message": "Comment includes: participo"
      }];
   */
  generateScript({rules, loadMoreCommentsBtnSelector, comentNodeSelector}) {
    let script = `
    try {
    const rules = {{rules}};
      async function pickComment() {
        console.clear();
        console.log('%c' + 'Starting comment picker', 'color: red;font-family: helvetica, sans-serif;font-size:20px;');
        const sleepTime = 2000;

        function sleep(ms) {
          if (ms < 0) ms = 0;
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        function next() {
          return new Promise(async(resolve) => {
            let btn = document.querySelector("{{loadMoreCommentsBtnSelector}}");
            while (btn) {
              btn.click();
              await sleep(1000);
              btn = document.querySelector("{{loadMoreCommentsBtnSelector}}");
            }
            resolve();
          });
        }

        console.log('⏳ Loading comments...');

        await next();

        const commentNodes = Array.from(document.querySelectorAll("{{comentNodeSelector}}"));

        const comments = commentNodes.map((comment) => ({
          name: comment.children[0].outerText,
          comment: comment.children[1].outerText
        }));

        let filterByRulesFlag;

        function filterCommentsByRules(arr, rulesToFilter) {
          rulesToFilter = rulesToFilter.filter(rule => rule.key === 'keyword');
          if (rulesToFilter.length === 0) {
            filterByRulesFlag = false;
            return arr
          }
          filterByRulesFlag = true;
          return arr.filter((el) => {
            return rulesToFilter.every((rule) => {
              const re = new RegExp(rule.word, 'gi');

              const match = el.comment.match(re);

              if (!match) return false;

              if (!rule.times) return true;

              if (rule.times && match.length == rule.times) {
                return true;
              }

              return false
            });
          });
        }

        await sleep(sleepTime);
        console.log('✅ All comments loaded!');

        const filteredByRules = filterCommentsByRules(comments, rules);

        await sleep(sleepTime);
        console.log('Comment rules are:');
        for (let rule of rules) {
          await sleep(sleepTime - sleepTime * 0.5);
          console.log(rule.message);
        }

        if (filterByRulesFlag) {
          await sleep(sleepTime);
          console.log('Comments after filtering by rules: ' + filteredByRules.length);
        }

        if (filteredByRules.length === 0) {
          console.log('There are no comments that match all the rules');
          return;
        }

        let filterDuplicate;

        function filterDuplicateUsers(arr) {
          const seen = {};
          const duplicateUsersRule = rules.find(rule => rule.key === 'allowDuplicatedUsers');
          filterDuplicate = duplicateUsersRule.value;
          return filterDuplicate
            ? arr
            : arr.map((el) => {
              const {
                name
              } = el;
              if (seen[name]) return;

                seen[name] = true;
                return el;

            }).filter((el) => el);
        }

        const filteredByDuplicate = filterDuplicateUsers(filteredByRules);

        const rand = Math.floor(Math.random() * filteredByDuplicate.length + 1);

        const winnerName = filteredByDuplicate[rand].name;
        const winnerComment = filteredByDuplicate[rand].comment;

        await sleep(sleepTime);
        console.log('And the winner is...');

        await sleep(300);
        console.log('🥁');

        await sleep(300);
        console.log('  🥁');

        await sleep(300);
        console.log('    🥁');

        await sleep(sleepTime + sleepTime * 0.5);
        const winnerMessage = '@' + winnerName;
        console.log('%c' + winnerMessage, 'color: red;font-family: impact, sans-serif;font-size:30px;');
        const winnerMessageComment = '"' + winnerComment + '"';
        console.log('%c' + winnerMessageComment, 'color: red;font-family: helvetica, sans-serif;font-size:20px;');

        const winnerNode = Array.from(document.querySelectorAll('li')).find(el =>
          el.outerText.includes(winnerName) && el.outerText.includes(winnerComment));

        winnerNode.style.backgroundColor = 'orange';
        winnerNode.scrollIntoViewIfNeeded();
      }
      pickComment(rules);
      } catch (e) {
        console.log('Something went wrong, please contact the administrator.')
      }
      `

    script = script
      .replace(/{{rules}}/g, JSON.stringify(rules))
      .replace(/{{loadMoreCommentsBtnSelector}}/g, loadMoreCommentsBtnSelector)
      .replace(/{{comentNodeSelector}}/g, comentNodeSelector)

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
      key: 'allowDuplicatedUsers',
      message: `Multiple comments per user are ${bool ? 'allowed' : 'not allowed'}`,
      value: bool
    })

  addRule = ({key, word, value, message, caseSensitive, times}) =>
    this.state.rules.push({ key, word, value, message, caseSensitive, times})

  deleteRule = ({key = null, word = null, value = null}) => {
    if (this.state.rules.length === 0) return
    if (key === 'deleteAllRules') this.state.rules = []

    this.state.rules = this.state.rules.filter(rule =>
      rule.word !== word && rule.key !== key && rule.value !== value)
  }

  render() {
    const { phaseCounter, rules } = this.state
    const phase = this.phases[phaseCounter]
    const {loadMoreCommentsBtnSelector, comentNodeSelector} = CONFIG;

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
              value={this.generateScript({rules, loadMoreCommentsBtnSelector, comentNodeSelector})}
            >
            </input>
          </>
        )}
      </>
    )
  }
}

export default InstagramCommentPickerApp
