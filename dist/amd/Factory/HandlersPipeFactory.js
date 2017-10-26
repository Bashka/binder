define(function (require, exports, module) {/**
 * Фабрика обработчиков, использующая строчное представление для генерации.
 *
 * @param {Object} options [optional] Опции фабрики.
 *  * separator - используемый разделитель (по умолчанию символ "|")
 *
 * @author Artur Sh. Mamedbekov
 */
function HandlersPipeFactory(options){
  options = options || {};
  this.separator = options.separator || '|';
}

/**
 * Выполняет перебор обработчиков, представленых в строке, вызывая для каждого 
 * указанную функцию.
 *
 * @param {String} pipe Строчное представление обработчиков.
 * @param {Function} callback Вызываемая функция, принимающая следующие 
 * аргументы:
 *  * handler - строчное представление конкретного обработчика
 *
 * @return {Array} Аккумуляция результатов всех итераций.
 */
HandlersPipeFactory.prototype.forEachHandler = function(pipe, callback){
  var result = [],
    handlers = pipe.split(this.separator);

  for(var i in handlers){
    var handler = handlers[i].trim();
    if(handler == ''){
      continue;
    }

    result.push(
      callback.apply(this, [handler])
    );
  }

  return result;
};

/**
 * Выполняет преобразование строчного представления обработчика в обработчик.
 *
 * @param {String} handler Строчное представление обработчика.
 *
 * @return {Array} Обработчик.
 */
HandlersPipeFactory.prototype.stringToHandler = function(handler){
  var match = handler.match(/^(\w+)(?:\((.*)\))?$/i);
  if(match === null){
    throw 'Invalid handler string';
  }

  var handlerName = match[1],
    args = [];

  if(match[2] !== undefined && match[2] !== ''){
    args = match[2].split(',');
    for(var i in args){
      args[i] = args[i].trim();
    }
  }

  return [handlerName, args];
};

/**
 * Генерирует обработчики на основании их строчного представления.
 *
 * @param {String} pipe Строчное представление обработчиков.
 *
 * @return {Array} Обработчики.
 */
HandlersPipeFactory.prototype.build = function(pipe){
  return this.forEachHandler(pipe, this.stringToHandler);
};

module.exports = HandlersPipeFactory;

});
