import React from 'react'

function InstagramCommentPickerConversation(
  { rules, isMobileOrTabletBrowser, draftRule, phase, increasePhase, decreasePhase, goToPhase, copyCodeToClipboard,
    modifyDraftRule, addRule, deleteRule, allowDuplicatedUsers, confirmDraftRule}
  ) {

  const containerStyle = {
    minHeight: '60vh',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  const backBtnStyle = {
    position: 'absolute',
    left: '0',
    top: '0',
    borderRadius: '10px',
    padding: '5px 20px',
  }
  const infoTitleStyle = {
  }
  const answerBtnContainerStyle = {

  }
  const answerBtnStyle = {
    margin: '0 20px',
    borderRadius: '10px',
    padding: '5px 20px',
  }

  const areThereMoreKeywordRules = () => rules.find(rule => rule.key === 'keyword' && rule.word !== '@')

  function renderConversationByPhase(phase) {
    switch (phase) {
      case 'readyToStart':{
        deleteRule({key: 'deleteAllRules'})
        return (
          <>
            <h2 style={infoTitleStyle}>Free Instagram Random Comment Picker</h2>
            {isMobileOrTabletBrowser ?
            <h3>Please open this app from a computer. It doesn't work on mobile or tablet.</h3> : (
              <div style={answerBtnContainerStyle}>
                <button style={answerBtnStyle} onClick={() => increasePhase()}>Start</button>
              </div>
            )}
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
            <p>Something not working? <a href="mailto:ion11811@gmail.com?subject=Instagram comment picker not working">Let me know.</a></p>
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
    // this.phases = {
        //   0: 'readyToStart',
        //   1: 'questionRules',
        //   2: 'questionDuplicate',
        //   3: 'finished'
        // }
    this.phases = [
      'readyToStart',
      'questionDuplicate',
      'questionMentions',
      'addRuleMentionUsers',
      'questionRules',
      'addRuleMentionWords',
      // 'mentionWordCaseSensitive',
      'maybeAddAnotherRule',
      'confirmRules',
      'finished',
      'useExplanation',
      ]
    this.draftRule = {}
    this.state = {
      isMobileOrTabletBrowser: null,
      rules: [],
      phaseCounter: 0,
    }
  }

  componentDidMount = () => {
    // console.log('this.state:', this.state)
    // if (this.state.isMobileOrTabletBrowser === null) {
    //   function checkForMobileOrTabletBrowser() {
    //     let check = false;
    //     (function (a) {
    //       if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    //     })(navigator.userAgent || navigator.vendor || window.opera);
    //     console.log(check);

    //     return check;
    //   }
    //   this.setState({isMobileOrTabletBrowser: checkForMobileOrTabletBrowser()})
    //   console.log(this.state)
    // }


  }

  // increasePhase() {this.phaseCounter++}
  increasePhase = (num = 1) => this.setState({phaseCounter: this.state.phaseCounter + num})

  decreasePhase = (num = 1) => this.setState({phaseCounter: this.state.phaseCounter - num})

  goToPhase = (phaseName) => {
    const phaseNumber = this.phases.findIndex(el => el === phaseName)
    this.setState({phaseCounter: phaseNumber})
  }

  generateScript(rules) {
    // const rules = [{
    //   word: 'participo',
    //   caseSensitive: false,
    //   times: 1
    // }, {
    //   word: '@',
    //   caseSensitive: false,
    //   times: 3
    // }];
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
            const btn = document.querySelector('#react-root > section > main > div > div > article > div > div > ul > li > button');
            if (btn) {
              btn.click();
              await sleep(200);
              await next();
              resolve();
            } else {
              resolve();
            }
          });
        }

        console.log('⏳ Loading comments...');

        await next();

        const commentNodes = Array.from(
          document.querySelectorAll('#react-root > section > main > div > div > article > div > div > ul > li > div > div > div')).slice(1);

        const comments = commentNodes.map((comment) => ({
          name: comment.children[0].outerText,
          comment: comment.children[1].outerText
        }));

        console.log('Total comments: ' + comments.length);

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

        if (filterDuplicate !== undefined) {
          await sleep(sleepTime);
          console.log('Comments after removing duplicate users: ' + filteredByDuplicate.length);
        }

        await sleep(sleepTime);
        console.log('Selecting a random number between 0 and ' + filteredByDuplicate.length);

        const rand = Math.floor(Math.random() * filteredByDuplicate.length + 1);

        const winnerName = filteredByDuplicate[rand].name;
        const winnerComment = filteredByDuplicate[rand].comment;

        await sleep(sleepTime);
        console.log('Selected number is %c' + (rand + 1), 'color:red;');


        await sleep(sleepTime);
        console.log('Comment number %c' + (rand + 1), 'color: red;', ' is...');

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

    script = script.replace('{{rules}}', JSON.stringify(rules))

    return script

  }

  copyCodeToClipboard() {
    const copyTextArea = document.getElementById('scriptHolder')
    copyTextArea.focus()
    copyTextArea.select()

    try {
      const successful = document.execCommand('copy');
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

  modifyDraftRule = (property) => this.draftRule = {...this.draftRule, ...property}

  confirmDraftRule = () => {
    const { key = '', word = '', value = '', message = '', caseSensitive = false, times = 1} = this.draftRule
    this.addRule({key, word, value, message, caseSensitive, times})
  }

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

    return (
      <>
        <InstagramCommentPickerConversation
          rules={rules}
          draftRule={this.draftRule}
          isMobileOrTabletBrowser={this.isMobileOrTabletBrowser}
          phase={phase}
          increasePhase={this.increasePhase}
          decreasePhase={this.decreasePhase}
          goToPhase={this.goToPhase}
          allowDuplicatedUsers={this.allowDuplicatedUsers}
          addRule={this.addRule}
          deleteRule={this.deleteRule}
          modifyDraftRule={this.modifyDraftRule}
          confirmDraftRule={this.confirmDraftRule}
          copyCodeToClipboard={this.copyCodeToClipboard}
        />

        {phase === 'finished' && (
          <>
            <input
              style={{position:'absolute', opacity:0}}
              id="scriptHolder"
              onChange={() => null}
              value={this.generateScript(this.state.rules)}
            >
            </input>
          </>
        )}
      </>
    )
  }
}

export default InstagramCommentPickerApp
