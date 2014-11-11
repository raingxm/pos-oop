var ShoppingCart = function(inputs) {
  this.inputs = inputs;
  this.collection = [];
  this.initCart();
};

ShoppingCart.prototype.shoppingInfo = function() {
  var res = this.title() + this.dottedLine() + this.itemLinesInfo() +
            this.dottedLine() + this.giftItemsInfo() + this.dottedLine() +
            this.totalInfo() + this.starsLine();
  return res;
};

ShoppingCart.prototype.title = function() {
  return "***<没钱赚商店>购物清单***\n" + "打印时间：" +
      this.currentDate() + "\n" ;
};

ShoppingCart.prototype.currentDate = function() {
  var dateDigitToString = function (num) {
      return num < 10 ? '0' + num : num;
  };
  var currentDate = new Date(),
      year = dateDigitToString(currentDate.getFullYear()),
      month = dateDigitToString(currentDate.getMonth() + 1),
      date = dateDigitToString(currentDate.getDate()),
      hour = dateDigitToString(currentDate.getHours()),
      minute = dateDigitToString(currentDate.getMinutes()),
      second = dateDigitToString(currentDate.getSeconds()),
      formattedDateString = year + '年' + month +
      '月' + date + '日 ' + hour + ':' + minute + ':' + second;
  return formattedDateString;
};

ShoppingCart.prototype.itemLinesInfo = function() {
  var res = "";
  for(var i = 0; i < this.count(); i++) {
    res += this.collection[i].format();
  }
  return res;
};

ShoppingCart.prototype.giftItemsInfo = function() {
  var res = "挥泪赠送商品：\n";
  for(var i = 0; i < this.count(); i++) {
    res += this.collection[i].formatGiftItems();
  }
  return res;
};

ShoppingCart.prototype.totalInfo = function() {
  var sumPrice = 0;
  var savingPrice = 0;
  for(var i = 0; i < this.count(); i++) {
    sumPrice += this.collection[i].payedPrice();
    savingPrice += this.collection[i].savingPrice();
  }
  return "总计：" + sumPrice.toFixed(2) + "(元)\n" +
          "节省：" + savingPrice.toFixed(2) + "(元)\n";
};

ShoppingCart.prototype.initCart = function(items) {
  var itemsCountMap = this.getItemsCountMapFromInput();
  items = items || loadAllItems();
  for(var i = 0; i < items.length; i++) {
    if(itemsCountMap.hasOwnProperty(items[i].barcode)) {
      var amount = itemsCountMap[items[i].barcode];
      var lineItem = new LineItem(items[i].barcode, items[i].name, items[i].price, amount,
                                items[i].unit);
      this.add(lineItem);
    }
  }
};

ShoppingCart.prototype.getItemsCountMapFromInput = function() {
  var itemsCountMap = {};
  for(var i = 0; i < this.inputs.length; i++) {
    if(this.isWeighingGood(this.inputs[i])) {
      var barcode = this.weighingGoodBarcode(this.inputs[i]);
      itemsCountMap[barcode] = this.weighingGoodAmount(this.inputs[i]);
      continue;
    }

    if(itemsCountMap.hasOwnProperty(this.inputs[i])) {
      itemsCountMap[this.inputs[i]]++;
    } else {
      itemsCountMap[this.inputs[i]] = 1;
    }
  }
  return itemsCountMap;
};

ShoppingCart.prototype.starsLine = function() {
  return "**********************";
};

ShoppingCart.prototype.dottedLine = function() {
  return "----------------------\n";
};

ShoppingCart.prototype.isWeighingGood = function(inputItem) {
  return inputItem.indexOf("-") != -1;
};

ShoppingCart.prototype.weighingGoodAmount = function(inputItem) {
  return parseInt(inputItem.split('-')[1]);
};

ShoppingCart.prototype.weighingGoodBarcode = function(inputItem) {
  return inputItem.split('-')[0];
};


ShoppingCart.prototype.add = function(lineItem) {
  this.collection.push(lineItem);
};

ShoppingCart.prototype.count = function() {
  return this.collection.length;
};
