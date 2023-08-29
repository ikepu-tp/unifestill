<p align="center">
<img src="./public/assets/img/logo.png" width="400" alt="UniFesTill Logo">
</p>

[Japanese](./README-ja.md)

## About UniFesTill

UniFesTill is a Point of Sale (POS) system designed for use in university festival shops.
The system's name is a combination of "Uni" representing university, "Fes" representing festival, and "Till" representing cash register, encompassing its support for efficient transactions and operations during university festivals.

## Features

- Ability to manage products and accounting on a per-project basis
- Designed for tablet usage with touch-screen compatibility
- Functionality for product registration, accounting, and report generation

## Target User

- University students participating in setting up festival shops

## Terminal device

- Computer (Google Chrome recommended)
- iPad (Google Chrom recommended)

## Technology Stack

- Backend: Laravel
- Database: MySQL (MariaDB)
- Frontend: React.js

## Contributing

We welcome contributions to the project! You can get involved through the following ways:

- [Issue](https://github.com/ikepu-tp/unifestill/issues): Use for bug reports, feature suggestions, and more.
- [Discussion](https://github.com/ikepu-tp/unifestill/discussions): Use for discussions, questions, and sharing ideas.
- [Pull Requests](https://github.com/ikepu-tp/unifestill/pulls): We encourage code contributions for new features and bug fixes.

## License

Copyright (c) 2023 [ikepu-tp](https://github.com/ikepu-tp).

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Installing

UniFesTill requires `php81` and `MySQL` (`MariaDB` is ok).

```bash
git clone https://github.com/ikepu-tp/pos
```

1. Create `.env`.
2. Create a database.
3. Run `composer install --no-dev`.
4. Run `php artisan key:generate`.
5. Run `php artisan migrate`.
