# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Fixed
- update query selector for submit field in login / register
### Added
- versioning for cache

## [1.2.9] - 2018-12-19
### Fixed
- create new checkout if old one is not available at Shopify anymore

## [1.2.8] - 2018-12-07
### Changed
- returns specific code for insufficient stock errors, allowing future templates to show localized error messages
### Fixed
- cart errors for products that gone out of stock after they were added to the cart

## [1.2.7] - 2018-10-15
### Changed
- Shopify request log format changed to be compatible with `shopify-user`'s log format

## [1.2.6] - 2018-09-28
### Fixed
- auto-login after registration and redirection to app or web checkout

## [1.2.5] - 2018-09-06
### Fixed
- cart product manipulation with errors falsely responds with success, e.g. out of stock error

## [1.2.3] - 2018-08-30
### Fixed
- cart showing duplicate items and wrong quantities when the same product is added multiple times very quickly

## [1.2.2] - 2018-08-30
### Fixed
- "compare at" price is not treated as a discount anymore

## [1.2.1] - 2018-08-30
### Added
- logging request duration and other info when requesting the Shopify API

[Unreleased]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Fheads%2Fmaster&sourceBranch=refs%2Ftags%2Fv1.2.9
[1.2.9]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.8&sourceBranch=refs%2Ftags%2Fv1.2.9
[1.2.8]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.7&sourceBranch=refs%2Ftags%2Fv1.2.8
[1.2.7]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.6&sourceBranch=refs%2Ftags%2Fv1.2.7
[1.2.6]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.5&sourceBranch=refs%2Ftags%2Fv1.2.6
[1.2.5]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.3&sourceBranch=refs%2Ftags%2Fv1.2.5
[1.2.3]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.2&sourceBranch=refs%2Ftags%2Fv1.2.3
[1.2.2]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/compare/commits?targetBranch=refs%2Ftags%2Fv1.2.1&sourceBranch=refs%2Ftags%2Fv1.2.2
[1.2.1]: https://stash.localdev.cc/projects/SGX/repos/shopify-cart/browse?at=refs%2Ftags%2Fv1.2.1
