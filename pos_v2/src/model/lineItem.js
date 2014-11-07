var LineItem = function(barcode, name, price, amount, unit) {
  this.barcode = barcode;
  this.name = name;
  this.price = price;
  this.amount = amount;
  this.unit = unit;
};

LineItem.prototype.totalPrice = function() {
  return this.price * this.amount;
};

LineItem.prototype.payedPrice = function() {
  return this.totalPrice() - this.savingPrice();
};

LineItem.prototype.format = function() {
  return "名称：" + this.name + "，数量：" + this.amount + this.unit +
      "，单价：" + this.price.toFixed(2) + "(元)，小计：" +
      this.payedPrice().toFixed(2) + "(元)\n";
};

LineItem.prototype.formatGiftItems = function() {
  var res = "名称：" + this.name + "，数量：" + this.savingAmount() +
      this.unit + "\n";
  return this.isPromot() ? res : "";
};

LineItem.prototype.isPromot = function() {
  return (this.savingAmount() + "") != "0";
};

LineItem.prototype.savingPrice = function() {
  return this.savingAmount() * this.price;
};

LineItem.prototype.savingAmount = function() {
  var promotions = loadPromotions();
  var savingAmount = 0;
  for(var i = 0; i < promotions.length; i++) {
    switch(promotions[i].type) {
      case 'BUY_TWO_GET_ONE_FREE':
        savingAmount += this.dealWithBuyTwoFreeOne(promotions[i].barcodes);
        break;
    }
  }
  return savingAmount;
};

LineItem.prototype.dealWithBuyTwoFreeOne = function(promotBarcodes) {
  for(var i = 0; i < promotBarcodes.length; i++) {
    if(this.barcode == promotBarcodes[i]) {
      return Math.floor(this.amount / 3);
    }
  }
  return 0;
};
