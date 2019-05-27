/**
 * Definition of the basic routes, that matter in this context.
  */
window.SGPipelineScript.PAGE_LOGIN = '/account/login'
window.SGPipelineScript.PAGE_REGISTER = '/account/register'
window.SGPipelineScript.PAGE_ACCOUNT = '/account'
window.SGPipelineScript.PAGE_CHALLENGE = '/challenge'
window.SGPipelineScript.PAGE_CHECKOUTS = '/[0-9]+/checkouts/[0-9a-f]+'

/**
 * Definition af a few global storage keys.
 */
window.SGPipelineScript.STORAGE_KEY_WEBLOGIN_PAYLOAD = 'shopgateWebloginPayload'
window.SGPipelineScript.STORAGE_KEY_TAB_PARAMS = 'shopgateParams'
window.SGPipelineScript.STORAGE_KEY_CHECKOUT_URL = 'shopifyCheckoutUrl'
window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY = 'shopgatePageHistory'
window.SGPipelineScript.STORAGE_KEY_LOADING_SCREEN_ENABLED = 'shopgateAppLoadingScreenEnabled'

/**
 * #############################################################################
 *
 * ### IMPORTANT: THIS SCRIPT WILL BE CACHED FOR 30MIN BY THE SGAppConnector ###
 *
 * #############################################################################
 */

/**
 * Pipeline entry function.
 *
 * This file routes the call to other script files, if needed, depending on the current location.
 * It also does some minor initialization.
 */
window.SGPipelineScript.__init = function () {
  var VERSION_ACCOUNT = 'v1'
  var VERSION_CART = 'v1'
  var VERSION_CHALLANGE = 'v1'
  var VERSION_LOGIN_REGISTER = 'v1'
  // set up page history
  if (JSON.parse(window.localStorage.getItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY)) === null) {
    window.localStorage.setItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY, '[]')
  }

  // do some basic routing
  switch (this.getPage()) {
    case this.PAGE_LOGIN: // same action as PAGE_REGISTER (fall through to next statement)
    case this.PAGE_REGISTER: {
      // Encryption functionality is required here (load crypto-js library)
      window.SGAppConnector.loadRemoteScript(
        'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js',
        true
      )

      // clear previously stored temporary credentials to avoid conflicts later and forward to page specific script
      window.localStorage.removeItem(this.STORAGE_KEY_WEBLOGIN_PAYLOAD)
      window.SGAppConnector.loadPipelineScript('login_register', VERSION_LOGIN_REGISTER)
      // leave loading spinner open because the script is not finished, yet
      break
    }
    case this.PAGE_ACCOUNT: {
      // load page specific script
      window.SGAppConnector.loadPipelineScript('account', null, VERSION_ACCOUNT)
      const history = JSON.parse(window.localStorage.getItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY))
      history.push('account')
      window.localStorage.setItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY, JSON.stringify(history))
      // leave loading spinner open because the script is not finished, yet
      break
    }
    case this.PAGE_CHALLENGE: {
      // load page specific script
      window.SGAppConnector.loadPipelineScript('challenge', null, VERSION_CHALLANGE)
      const history = JSON.parse(window.localStorage.getItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY))
      history.push('challenge')
      window.localStorage.setItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY, JSON.stringify(history))
      break
    }
    default: {
      // check whether we're coming from registration; in that case, execute the actions
      const history = JSON.parse(window.localStorage.getItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY))
      if (history.join(',').match(/register(,challenge)*$/)) {
        history.length = 0 // clear history
        window.SGAppConnector.loadPipelineScript('account', null, VERSION_ACCOUNT)
        break
      }

      // on every other page the temporarily stored credentials should be removed and the loading spinner be closed
      window.localStorage.removeItem(this.STORAGE_KEY_WEBLOGIN_PAYLOAD)
      this.closeLoadingScreen()
      window.SGAppConnector.closeLoadingSpinner()
      break
    }
  }
}

/**
 * Parses the current location and returns it as string, without any GET parameters or anker/fragment
 *
 * @return {string}
 */
window.SGPipelineScript.getLocation = function () {
  return window.location.toString().replace(/[#?].*$/g, '')
}

/**
 * Sends an app command to show the loading screen.
 */
window.SGPipelineScript.showLoadingScreen = function () {
  // sending the "sho"
  if (window.localStorage.getItem(this.STORAGE_KEY_LOADING_SCREEN_ENABLED)) {
    return
  }
  window.localStorage.setItem(this.STORAGE_KEY_LOADING_SCREEN_ENABLED, 'true')

  window.SGAppConnector.sendAppCommand({
    c: 'presentNotification',
    p: {
      presentationType: 'centeredFade',
      src: 'sgapi:loading_notification',
      timeout: 10,
      notificationParams: {
        fullSize: true
      }
    }
  })
}

/**
 * Sends an app command to close the loading screen.
 */
window.SGPipelineScript.closeLoadingScreen = function () {
  if (!window.localStorage.getItem(this.STORAGE_KEY_LOADING_SCREEN_ENABLED)) {
    return
  }
  window.localStorage.removeItem(this.STORAGE_KEY_LOADING_SCREEN_ENABLED)

  window.SGAppConnector.sendAppCommand({
    c: 'broadcastEvent',
    p: {
      event: 'closeNotification'
    }
  })
}

/**
 * Checks the current location and returns the page if it's known and relevant to the extension.
 *
 * @return {string}
 */
window.SGPipelineScript.getPage = function () {
  var currentLocation = this.getLocation().toLowerCase()
  if (currentLocation.match(this.PAGE_LOGIN.toLowerCase() + '/*$')) {
    // page that shows a login form
    return this.PAGE_LOGIN
  } else if (currentLocation.match(this.PAGE_REGISTER.toLowerCase() + '/*$')) {
    // paget that shows a registration form
    return this.PAGE_REGISTER
  } else if (currentLocation.match(this.PAGE_ACCOUNT.toLowerCase() + '/*$')) {
    // accoutn overview page
    return this.PAGE_ACCOUNT
  } else if (currentLocation.match(this.PAGE_CHALLENGE.toLowerCase() + '/*$')) {
    // a page that checks if the user is a robot
    return this.PAGE_CHALLENGE
  } else if (currentLocation.match(this.PAGE_CHECKOUTS.toLowerCase() + '/*$')) {
    // the checkouts/<hash> page
    return this.PAGE_CHECKOUTS
  }

  // parse the current location and return the last bit of it
  return ('/' + currentLocation.replace(/\/*$/g, '').split('/').pop())
}
