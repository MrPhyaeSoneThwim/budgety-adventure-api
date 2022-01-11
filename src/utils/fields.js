const categoryFields = ["name", "icon", "iconColor", "type"];
const walletFields = ["name", "balance", "icon", "iconColor"];
const transactionFields = ["wallet", "category", "amount", "createdAt", "status"];

module.exports = {
  categoryFields,
  walletFields,
  transactionFields,
};
