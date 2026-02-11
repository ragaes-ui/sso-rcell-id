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

export default Account;
