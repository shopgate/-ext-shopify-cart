const Tools = require('../lib/tools')

const InvalidCallError = require('../models/Errors/InvalidCallError')
const Message = require('../models/messages/message')

/**
 * @typedef {Object} input
 * @property {String[]} discountCodes
 *
 * @param {Object} context
 * @param {Object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  addDiscounts(context, input.checkout.token, input.discountCodes)

  /**
   * @param {Object} context
   * @param {String} checkoutToken
   * @param {String[]} discountCodes
   */
  function addDiscounts (context, checkoutToken, discountCodes) {
    const Shopify = require('../lib/shopify.api.js')(context.config, context.log)

    if (Tools.isEmpty(discountCodes) || !Array.isArray(discountCodes) || !discountCodes[0]) {
      context.log.error('Error: Wrong parameter format or no discount (coupon) codes given.')
      return cb(new InvalidCallError())
    }

    // only one coupon is supported
    if (discountCodes.length > 1) {
      context.log.warning("Shopify doesn't support more than one discount (coupon).")
    }

    Shopify.setCheckoutDiscount(checkoutToken, discountCodes[0], (err, data) => {
      let resultMessages = []
      if (err) {
        Object.keys(data.errors).map(function (objectKey) {
          const messages = data.errors[objectKey]
          const len = messages.length
          for (let i = 0; i < len; i++) {
            const message = new Message()
            message.addErrorMessage(messages[i]['code'], messages[i]['message'])
            resultMessages.push(message.toJson())
          }
        })

        return cb(null, {messages: resultMessages})
      }

      return cb()
    })
  }
}
