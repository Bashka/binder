var CompositeBinder = require('../CompositeBinder'),
  Binder = require('../Binder'),
  HandlersPipeFactory = require('./HandlersPipeFactory');

/**
 * Фабрика биндеров, использующая аттрибуты DOM-элемента для генерации.
 *
 * @param {Object} options [optional] Опции фабрики.
 *  * prefix - ожидаемый префикс аттрибутов
 *  * handlersPipeFactoryOptions - опции, передаваемые используемой для 
 *  генерации фабрике HandlersPipeFactory
 *
 * @author Artur Sh. Mamedbekov
 */
function NodeBindersFactory(options){
  options = options || {};
  this.prefix = options.prefix || 'bind-';
  this.handlersPipeFactoryOptions = options.handlersPipeFactoryOptions || {};
}

/**
 * Выполняет перебор аттрибутов DOM-элемента, вызывая для каждого указанную 
 * функцию.
 *
 * @param {DOMElement} node DOM-элемент.
 * @param {Function} callback Вызываемая функция, принимающая следующие 
 * аргументы:
 *  * event - целевое событие биндера
 *  * attr - аттрибут DOM-элемента
 * 
 * @return {Array} Аккумуляция результатов всех итераций.
 */
NodeBindersFactory.prototype.forEachAttr = function(node, callback){
  var result = [];

  for(var i in node.attributes){
    var attr = node.attributes[i];
    if(typeof attr != 'object' || typeof attr.name != 'string'){
      continue;
    }
    
    var attrNameMatch = attr.name.match(new RegExp('^' + this.prefix + '([a-z:_-]+)$', 'i'));
    if(attrNameMatch === null){
      continue;
    }

    result = result.concat(callback.apply(this, [attrNameMatch[1], attr]));
  }

  return result;
};

/**
 * Генерирует обработчики на основании аттрибутов DOM-элемента.
 *
 * @param {DOMElement} node Исходный DOM-элемент.
 * @param {Object} subject Субъект.
 * @param {Object} object Объект.
 *
 * @return {CompositeBinder} Биндеры.
 */
NodeBindersFactory.prototype.build = function(node, subject, object){
  return new CompositeBinder(this.forEachAttr(node, function(event, attr){
    var binders = [],
      bindersPipes = attr.value.split(';');
    for(var i in bindersPipes){
      binders.push(
        new Binder(
          subject,
          event,
          object,
          new HandlersPipeFactory(this.handlersPipeFactoryOptions)
            .build(bindersPipes[i].trim())
        )
      );
    }

    return binders;
  }));
};

module.exports = NodeBindersFactory;
