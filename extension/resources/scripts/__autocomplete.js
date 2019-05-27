/**
 * This file is only supposed to provide some auto completion for an IDE.
 * It's not meant to be used in production.
 */

/* eslint-disable */

// Basic definition of the SGAppConnector object
if (!window.SGAppConnector) {
  window.SGAppConnector = {
    /**
     * Takes any type of variable and checks if the input is a function.
     *
     * @param {*|null} func
     * @return {boolean}
     */
    functionExists: function (func) {},

    /**
     * Takes a length param and creates a random passphrase and returns it.
     *
     * @param {number} len
     * @return {string}
     */
    getRandomPassPhrase: function (len) {},

    /**
     * Takes a url string and parses a given GET param out of it. Uses the window.location if no url given.
     *
     * @param {string} paramName
     * @param {string|null} url
     * @return {string|null}
     */
    getParameterByName: function (paramName, url = null) {},

    /**
     * Sends an array of app commands to the Shopgate app. The SGJavascriptBridge is required for this.
     *
     * @param {object[]} appCommands
     */
    sendAppCommands: function (appCommands) {},

    /**
     * Sends an array of app commands to the Shopgate app. The SGJavascriptBridge is required for this.
     *
     * @param {object} appCommand
     */
    sendAppCommand: function (appCommand) {},

    /**
     * Creates a special app command to close the loading spinner.
     * A warning can be created, if the command is actually sent.
     *
     * @param {boolean|null} warn
     */
    closeLoadingSpinner: function (warn = null) {},

    /**
     * Sends out a pipeline request and calls the given callback on response (if set).
     * A param can be passed through to the callback, when it's called.
     *
     * @param {string} pipelineName
     * @param {boolean} trusted
     * @param {*|null} data
     * @param {function|null} callback
     * @param {*|null} callbackParams
     */
    sendPipelineRequest: function (pipelineName, trusted, data = null, callback = null, callbackParams = null) {},

    /**
     * Injects the given script code as a script-tag into the html-head-tag as last element.
     * Injected code is automatically scoped if not forced global scope.
     *
     * @param {string} scriptContent
     * @param {boolean|null} globalScope
     */
    includeScript: function (scriptContent, globalScope = null) {},
    /**
     * Takes script code and puts it into the localStorage to allow faster loading times when it is needed again.
     *
     * @param {string} key
     * @param {string} scriptCode
     * @param {string} version
     */
    saveScriptToCache: function (key, scriptCode, version) {},

    /**
     * Tries to load a script from the localStorage.
     *
     * @param {string} key
     * @param {string} version
     * @return {string} Returns an empty string if nothing is available in the cache.
     */
    getScriptFromCache: function (key, version) {},

    /**
     * Loads a script file from a given url and injects it into the current page.
     *
     * @param {string} url
     * @param {boolean|null} globalScope
     */
    loadRemoteScript: function (url, globalScope) {},

    /**
     * Calls a pipeline to get script code to be injected.
     *
     * @param {string} scriptName
     * @param {*|null} passthroughParams Parameters to be passed to the pipelines entry function
     */
    loadPipelineScript: function (scriptName, passthroughParams = null, version) {}

  }
}

if (!window.SGPipelineScript) {
  window.SGPipelineScript = {}
}

if (!window.CryptoJS) {
  window.CryptoJS = {
    AES: {
      encrypt: function () {}
    }
  }
}

/* eslint-enable */
