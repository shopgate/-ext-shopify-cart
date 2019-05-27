/**
 * Pipeline entry function for the login and registration page of the Shopify frontend.
 */
window.SGPipelineScript.login_register = function () {
  // the application can open up a loading screen on int own. make sure it's closed when user action is required
  this.closeLoadingScreen()

  const history = JSON.parse(window.localStorage.getItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY))

  // attach a click-event-listener to each relevant form-submit button
  switch (this.getPage()) {
    case this.PAGE_LOGIN: {
      this.requestCheckoutUrl()
      this.attachSubmitListener('customer_login')
      history.push('login')
      break
    }
    case this.PAGE_REGISTER: {
      this.requestCheckoutUrl()
      this.attachSubmitListener('create_customer')
      history.push('register')
      break
    }
  }

  window.localStorage.setItem(window.SGPipelineScript.STORAGE_KEY_PAGE_HISTORY, JSON.stringify(history))

  // save get params for later (after registration or login has succeeded)
  var sgcloudCallbackData = window.SGAppConnector.getParameterByName('sgcloud_callback_data')
  var sgcloudCheckout = window.SGAppConnector.getParameterByName('sgcloud_checkout')
  if (sgcloudCallbackData || sgcloudCheckout) {
    window.localStorage.setItem(this.STORAGE_KEY_TAB_PARAMS, JSON.stringify({
      sgcloudCallbackData: JSON.parse(sgcloudCallbackData),
      sgcloudCheckout: sgcloudCheckout
    }))
  }

  window.SGAppConnector.closeLoadingSpinner()
}

/**
 * Takes an form id and modifies it's "submit" input to init the web login on clicking that input.
 *
 * @param {string} formId
 */
window.SGPipelineScript.attachSubmitListener = function (formId) {
  if (document.getElementById(formId)) {
    document.getElementById(formId).querySelector('[type="submit"]').onclick = function () {
      return window.SGPipelineScript.initAppLogin(formId)
    }
  }
}

/**
 * Reads the children of the given form to find credentials data for the web login within the input fields.
 * This data is encrypted with a random phrase and temporarily stored in the localStorage for finalizing the web login.
 * The form submission is postponed to after successful web login initialization.
 *
 * @param {string} formId
 * @return {boolean}
 */
window.SGPipelineScript.initAppLogin = function (formId) {
  // hide internal processes from the user
  this.showLoadingScreen()

  // read form elements
  var formChilds = Array.prototype.slice.call(document.getElementById(formId).querySelectorAll('input[name^=customer]'))
  var payloadData = {}
  var key
  var name
  for (var i = 0; i < formChilds.length; i++) {
    if (formChilds[i].name) {
      key = ''
      name = formChilds[i].name.replace('customer[', '').replace(']', '')
      if (name === 'email') {
        key = 'u'
      } else if (name === 'password') {
        key = 'p'
      }

      if (key) {
        payloadData[key] = formChilds[i].value
      }
    }
  }

  // create encryption phrase
  var phrase = window.SGAppConnector.getRandomPassPhrase(16)

  // store payload to local storage
  window.localStorage.setItem(
    this.STORAGE_KEY_WEBLOGIN_PAYLOAD,
    window.CryptoJS.AES.encrypt(JSON.stringify(payloadData), phrase).toString()
  )

  // init weblogin by passing encryption phrase to trusted user extension
  window.SGAppConnector.sendPipelineRequest(
    'shopgate.user.initWebLogin.v1',
    true,
    { phrase: phrase },

    // callback
    function (err, output, formId) {
      // submit form, since the pipeline response arrived
      if (!err) {
        document.getElementById(formId).submit()
      }
    },

    // 3rd callback param
    formId
  )

  // abort form submission (wait for pipeline response)
  return false
}

/**
 * Fetches the checkout url in the background and caches it for later usage.
 */
window.SGPipelineScript.requestCheckoutUrl = function () {
  window.SGAppConnector.sendPipelineRequest('shopgate.checkout.getUrl.v1', false, null, function (err, output, storageKey) {
    if (err) {
      return console.error(err)
    }

    console.log('# Cached checkout url')
    window.localStorage.setItem(storageKey, window.btoa(output.url))
  }, this.STORAGE_KEY_CHECKOUT_URL)
}
