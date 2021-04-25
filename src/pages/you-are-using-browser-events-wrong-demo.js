import React from 'react';

export default () => {
  // Register and cleanup event listeners.
  class EventHandlerStore {
    constructor() {
      // Here we will store our event handlers.
      this.store = {};
    }

    // Private method to generate a unique identifier for the event handler.
    _getHandlerId = (element, event, handler) => `${element}-${event}-${handler}`

    // Public method to save an event hanlder on the store.
    save = ({ element = window, handler, event }) => {
      const handlerId = this._getHandlerId(element, event, handler);

      // Save the handler on the event handler store.
      this.store[handlerId] = handler;

      // Add an event listener with the saved handler.
      element.addEventListener(event, this.store[handlerId], false);

      // Return true to indicate that saving was succesful.
      return true;
    }

    // Remove an event handler from the store
    remove = ({ element = window, handler, event }) => {
      const handlerId = this._getHandlerId(element, event, handler);

      // If the event handler is not in the store throw an error
      if (!this.store[handlerId]) {
        console.error(new Error('Cannot remove an event handler that has not been previously saved in the store.'));
      }

      // Remove the listener from the node using the same handler.
      element.removeEventListener(event, this.store[handlerId], false);

      // Also remove the handler from store.
      delete this.store[handlerId];

      // Return true to indicate that saving was succesful.
      return true;
    }

    // Check if an event handler is in store
    has = ({ element = window, handler, event }) => (!!this.store[this._getHandlerId(element, event, handler)]);
  }

  const eventHandlerStore = new EventHandlerStore();

  // Example function that changes the text of the page with current scroll position.
  const logScroll = () => document.querySelector('#scrollDisplay').textContent = `${window.scrollY.toFixed()}px`;

  // Log the scroll only if the screen is large.
  const logScrollOnLargeScreens = () => {
    const eventHandlerData = { handler: logScroll, event: 'scroll' };
    if (window.innerWidth > 768) {
      if (!eventHandlerStore.has(eventHandlerData)) eventHandlerStore.save(eventHandlerData);
    } else if (eventHandlerStore.has(eventHandlerData)) eventHandlerStore.remove(eventHandlerData);
  };

  React.useEffect(() => {
    // Initiate the listener.
    logScrollOnLargeScreens();

    // Set to also trigger on resize in order to detect screen changes.
    window.addEventListener('resize', logScrollOnLargeScreens, false);
  }, []);

  // Styles for the demo
  const pageStyle = { height: '500vh' };
  const justifierStyle = {
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const textWrapperStyle = { minWidth: '550px' };
  const textStyle = { margin: 0 };

  return (
    <div style={pageStyle}>
      <div style={justifierStyle}>
        <div style={textWrapperStyle}>
          <h1 style={textStyle} id="title">
            Scroll position is:
            <span id="scrollDisplay">0px</span>
          </h1>
          <p id="subTitle">Shrink your window to remove the event listener</p>
        </div>
      </div>
    </div>
  );
};
