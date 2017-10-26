define(function (require, exports, module) {/**
 * Механизм связывания объектов с использованием конвеера обработчиков.
 *
 * @param {Object} subject Субъект.
 * @param {String} eventName Имя обрабатываемого события.
 * @param {Object} object Объект.
 * @param {Array} handlers Обработчики.
 *
 * @author Artur Sh. Mamedbekov
 */
function Binder(subject, eventName, object, handlers){
  this.subject = subject;
  this.eventName = eventName;
  this.object = object;

  this.sync = (function(context){
    return function(){
      return Binder.prototype.sync.apply(context, arguments);
    };
  })(this);

  this.handlers = [];
  for(var i in handlers){
    var handler = handlers[i],
      args = [];

    if(typeof handler == 'object' && handler.constructor === Array){
      args = handler[1];
      handler = handler[0];
    }

    if(typeof handler == 'string'){
      handler = Binder.handlers[handler];
    }

    args.unshift(null);
    this.handlers.push([handler, args]);
  }
}

/**
 * Устанавливает обработчик события на субъект.
 *
 * @param {String} bindMethor [optional] Используемый для установки обработчика 
 * события метод.
 */
Binder.prototype.bind = function(bindMethod){
  if(bindMethod === undefined){
    if(this.subject.addEventListener){
      bindMethod = 'addEventListener';
    }
    else if(this.subject.on){
      bindMethod = 'on';
    }
    else if(this.attachEvent){
      bindMethod = 'attachEvent';
    }
    else{
      throw 'Bind method not found';
    }
  }

  this.subject[bindMethod](this.eventName, this.sync);
};

/**
 * Снимает обработчик события с субъекта.
 *
 * @param {String} unbindMethod [optional] Используемый для снятия обработчика 
 * события метод.
 */
Binder.prototype.unbind = function(unbindMethod){
  if(unbindMethod === undefined){
    if(this.subject.removeEventListener){
      unbindMethod = 'removeEventListener';
    }
    else if(this.subject.off){
      unbindMethod = 'off';
    }
    else if(this.detachEvent){
      unbindMethod = 'detachEvent';
    }
    else{
      throw 'Unbind method not found';
    }
  }

  this.subject[unbindMethod](this.eventName, this.sync);
};

/**
 * Выполняет синхронизацию объекта с субъектом.
 *
 * @param {Event} currentEvent [optional] Событие.
 */
Binder.prototype.sync = function(currentEvent){
  this.currentEvent = currentEvent;
  var value = null;
  for(var i in this.handlers){
    this.handlers[i][1][0] = value;
    value = this.handlers[i][0].apply(this, this.handlers[i][1]);
  }
};

/**
 * @var {Object} Встроеные обработчики.
 */
Binder.handlers = {};

module.exports = Binder;

});
