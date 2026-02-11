// src/support/account.js
class Account {
  constructor(id) {
    this.accountId = id;
  }

  static async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return {
          sub: id,
          email: id,
          email_verified: true,
        };
      },
    };
  }
}

module.exports = Account;