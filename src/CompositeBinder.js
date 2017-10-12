/**
 * Делегирующий, составной механизм связывания объектов с использованием 
 * конвеера обработчиков.
 *
 * @param {Array} binders Массив используемых биндеров.
 *
 * @author Artur Sh. Mamedbekov
 */
function CompositeBinder(binders){
  if(binders === undefined){
    binders = [];
  }
  this.binders = binders;
}

/**
 * Добавляет биндер.
 *
 * @param {Binder} binder Добавляемый биндер.
 *
 * @return {CompositeBinder} Вызываемый объект.
 */
CompositeBinder.prototype.add = function(binder){
  this.binders.push(binder);

  return this;
};

/**
 * Устанавливает обработчики событий на субъектах.
 *
 * @param {String} bindMethor [optional] Используемый для установки обработчика 
 * события метод.
 */
CompositeBinder.prototype.bind = function(bindMethod){
  for(var i in this.binders){
    this.binders[i].bind(bindMethod);
  }
};

/**
 * Снимает обработчики событий с субъектов.
 *
 * @param {String} unbindMethod [optional] Используемый для снятия обработчика 
 * события метод.
 */
CompositeBinder.prototype.unbind = function(unbindMethod){
  for(var i in this.binders){
    this.binders[i].unbind(bindMethod);
  }
};

/**
 * Выполняет синхронизацию объектов с субъектами.
 *
 * @param {Event} currentEvent [optional] Событие.
 */
CompositeBinder.prototype.sync = function(currentEvent){
  for(var i in this.binders){
    this.binders[i].sync(currentEvent);
  }
};

module.exports = CompositeBinder;
