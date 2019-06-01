---
title: You are using browser events wrong
spoiler: Stop listening.
date: '2019-05-15T19:38:03.284Z'
---

Will this code work?

```javascript
// Listen to scroll event to log 'Scrolling!' to console.
window.addEventListener('scroll', () => console.log('Scrolling!'), false)

// After 1 second, stop listening to scroll to stop logging 'Scrolling!' to console.
window.setTimeout(
  () =>
    window.removeEventListener(
      'scroll',
      () => console.log('Scrolling!'),
      false
    ),
  1000
)
```

Open your browser JavaScript console right now and paste this code.

What happens? The window keeps listening for the scroll event.

The problem here is that to **remove the event listener you have to pass the same handler** that you passed to `addEventListener` to `removeEventListener`. But passing an anonymous function, even if the content is the same, is always a different handler, so it doesn't remove the event.

So in this case, to remove your event listener you could do something like:

```javascript
// Same function will be passed to add/removeEventListener.
function logScroll() {
  console.log('Scrolling!')
}

// Listen to scroll to log 'Scrolling!' to console.
window.addEventListener('scroll', logScroll, false)

// After 1 second, stop listening to scroll to stop logging 'Scrolling!' to console.
window.setTimeout(
  () => window.removeEventListener('scroll', logScroll, false),
  1000
)
```

Now, this works. But what will happen when you have many diferent events, with different handlers, which are being enabled and disabled at different moments? how can you keep track of all this?

We are going to create a store for our event handlers.

```javascript
class EventHandlerStore {
  constructor() {
    // Here we will store our event handlers.
    this.store = {}
  }

  // Private method to generate a unique identifier for the event handler.
  _getHandlerId = (element, event, handler) => `${element}-${event}-${handler}`

  // Public method to save an event hanlder on the store.
  save = ({ element = window, handler, event }) => {
    const handlerId = this._getHandlerId(element, event, handler)

    // Save the handler on the event handler store.
    this.store[handlerId] = handler

    // Add an event listener with the saved handler.
    element.addEventListener(event, this.store[handlerId], false)

    // Return true to indicate that saving was succesful.
    return true
  }

  // Remove an event handler from the store
  remove = ({ element = window, handler, event }) => {
    const handlerId = this._getHandlerId(element, event, handler)

    // If the event handler is not in the store throw an error
    if (!this.store[handlerId]) {
      console.error(
        new Error(
          `Cannot remove an event handler that has not been previously saved in the store.`
        )
      )
    }

    // Remove the listener from the node using the same handler.
    element.removeEventListener(event, this.store[handlerId], false)

    // Also remove the handler from store.
    delete this.store[handlerId]

    // Return true to indicate that saving was succesful.
    return true
  }

  // Check if an event handler is in store
  has = ({ element = window, handler, event }) =>
    this.store[this._getHandlerId(element, event, handler)] ? true : false
}
```

Now, we can save and retrieve events handlers effectively by referencing them in the store.

```javascript
const eventHandlerStore = new EventHandlerStore()

function logScroll() {
  console.log('Scrolling!')
}

// Log the scroll only if the screen is large.
const logScrollOnLargeScreens = () => {
  const eventHandlerData = { handler: logScroll, event: 'scroll' }
  if (window.innerWidth > 768) {
    if (!eventHandlerStore.has(eventHandlerData))
      eventHandlerStore.save(eventHandlerData)
  } else {
    if (eventHandlerStore.has(eventHandlerData))
      eventHandlerStore.remove(eventHandlerData)
  }
}

// Initiate the handler.
logScrollOnLargeScreens()

// Set to also trigger on resize in order to detect screen changes.
window.addEventListener('resize', logScrollOnLargeScreens, false)
```

[🦞 Check the DEMO 🦞 ](/you-are-using-browser-events-wrong-demo)
