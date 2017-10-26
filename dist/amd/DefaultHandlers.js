define(function (require, exports, module) {var Binder = require('./Binder');

// Other
/**
 * Выводит значение в консоль.
 *
 * @param {*} value Значение.
 *
 * @return {*} Значение.
 */
Binder.handlers.log = function(value){
  console.log(value);

  return value;
};

/**
 * Выполняет сравнение значения с заданным.
 *
 * @param {*} x Значение X.
 * @param {*} y Значение Y
 * @param {Boolean} strict true - если необходимо выполнить строгое сравнение.
 *
 * @return {Boolean} true - если значения равны.
 */
Binder.handlers.eq = function(x, y, strict){
  if(strict){
    return x === y;
  }
  else{
    return x == y;
  }
};

/**
 * Логическое НЕ на значении.
 *
 * @param {Boolean} flag Значение.
 *
 * @return {Boolean} Отрицание значения.
 */
Binder.handlers.not = function(flag){
  return !flag;
};

// Model
/**
 * Получает значение свойства субъекта по его имени.
 *
 * @param {*} value Значение.
 * @param {String} name Целевое свойство.
 *
 * @return {*} Значение целевого свойства субъекта.
 */
Binder.handlers.get = function(value, name){
  if(typeof this.subject.get === 'function'){
    return this.subject.get(name);
  }

  return this.subject[name];
};

/**
 * Устанавливает значение свойству объекта по его имени.
 *
 * @param {*} value Значение.
 * @param {String} name Целевое свойство.
 *
 * @return {*} Значение.
 */
Binder.handlers.set = function(value, name){
  if(typeof this.object.set === 'function'){
    this.object.set(name, value);
  }
  else{
    this.object[name] = value;
  }

  return value;
};

/**
 * Вызывает метод объекта по его имени.
 *
 * @param {*} value Передаваемый методу параметр.
 * @param {String} method Имя вызываемого метода.
 *
 * @return {*} Возвращаемое методом значение.
 */
Binder.handlers.call = function(value, method){
  return this.object[method](value);
};

// DOM
/**
 * Выбрасывает событие на объекте.
 *
 * @param {*} value Значение.
 * @param {String} event Имя выбрасываемого события.
 *
 * @return {*} Значение.
 */
Binder.handlers.trigger = function(value, event){
  if(typeof this.object.dispatchEvent == 'function'){
    this.object.dispatchEvent(new Event(event));
  }
  else if(typeof this.object.trigger == 'function'){
    this.object.trigger(event);
  }

  return value;
};

/**
 * Получает значение свойства value субъекта.
 *
 * @param {*} value Значение.
 *
 * @return {*} Значение свойства value субъекта.
 */
Binder.handlers.getValue = function(value){
  return this.subject.value;
};

/**
 * Устанавливает значение свойству value объекта.
 *
 * @param {*} value Значение.
 * @param {Boolean} verbose true - если установка значения должна сопровождаться 
 * выбросом события change объектом.
 *
 * @return {*} Значение.
 */
Binder.handlers.setValue = function(value, verbose){
  if(this.object.value == value){
    return value;
  }

  this.object.value = value;
  if(verbose){
    Binder.handlers.trigger.apply(this, [value, 'change']);
  }

  return value;
};

/**
 * Получает значение свойства checked субъекта.
 *
 * @param {*} value Значение.
 *
 * @return {*} Значение свойства checked субъекта.
 */
Binder.handlers.isChecked = function(value){
  return this.subject.checked;
};

/**
 * Устанавливает значение свойству checked объекта.
 *
 * @param {Boolean} checked Значение.
 * @param {Boolean} verbose true - если установка значения должна сопровождаться 
 * выбросом события change объектом.
 *
 * @return {Boolean} Значение.
 */
Binder.handlers.checked = function(checked, verbose){
  if(this.object.checked == checked){
    return checked;
  }

  this.object.checked = checked;
  if(verbose){
    Binder.handlers.trigger.apply(this, [checked, 'change']);
  }

  return checked;
};

/**
 * Получает значение свойства innerText или outerText субъекта.
 *
 * @param {*} value Значение.
 * @param {Boolean} outer true - если целевым является свойство outerText.
 *
 * @return {String} Значение свойства innerText или outerText субъекта.
 */
Binder.handlers.getText = function(value, outer){
  if(outer){
    return this.subject.outerText;
  }
  else{
    return this.subject.innerText;
  }
};

/**
 * Устанавливает значение свойству innerText или outerText объекта.
 *
 * @param {*} value Значение.
 * @param {Boolean} outer true - если целевым является свойство outerText.
 *
 * @return {*} Значение.
 */
Binder.handlers.setText = function(value, outer){
  if(outer){
    this.object.outerText = value;
  }
  else{
    this.object.innerText = value;
  }

  return value;
};

/**
 * Получает значение свойства innerHTML или outerHTML субъекта.
 *
 * @param {*} value Значение.
 * @param {Boolean} outer true - если целевым является свойство outerHTML.
 *
 * @return {String} Значение свойства innerHTML или outerHTML субъекта.
 */
Binder.handlers.getHtml = function(value, outer){
  if(outer){
    return this.subject.outerHTML;
  }
  else{
    return this.subject.innerHTML;
  }
};

/**
 * Устанавливает значение свойству innerHTML или outerHTML объекта.
 *
 * @param {*} value Значение.
 * @param {Boolean} outer true - если целевым является свойство outerHTML.
 *
 * @return {*} Значение.
 */
Binder.handlers.setHtml = function(value, outer){
  if(outer){
    this.object.outerHTML = value;
  }
  else{
    this.object.innerHTML = value;
  }

  return value;
};

/**
 * Получает значение атрибута субъекта.
 *
 * @param {*} value Значение.
 * @param {String} name Наименование атрибута.
 *
 * @return {String} Значение атрибута.
 */
Binder.handlers.getAttr = function(value, name){
  return this.subject.getAttribute(name);
};

/**
 * Устанавливает значение атрибуту объекта.
 *
 * @param {String} value Значение.
 * @param {String} name Наименование атрибута.
 *
 * @return {String} Значение.
 */
Binder.handlers.setAttr = function(value, name){
  this.object.setAttribute(name, value);

  return value;
}

/**
 * Переключает атрибут объекта.
 *
 * @param {Boolean} flag Флаг переключателя.
 * @param {String} name Наименование целевого атрибута.
 * @param {String} value [optional] Устанавливаемое атрибуту значение.
 *
 * @return {Boolean} Флаг переключателя.
 */
Binder.handlers.toggleAttr = function(flag, name, value){
  if(flag){
    this.object.setAttribute(name, value !== undefined? value : '');
  }
  else{
    this.object.removeAttribute(name);
  }

  return flag;
};

/**
 * Получает стиль субъекта.
 *
 * @param {String} value Значение.
 * @param {String} name Наименование стиля.
 *
 * @return {String} Значение.
 */
Binder.handlers.getStyle = function(value, name){
  return this.subject.style[name];
};

/**
 * Устанавливает стиль объекту.
 *
 * @param {String} value Значение.
 * @param {String} name Наименование стиля.
 *
 * @return {String} Значение.
 */
Binder.handlers.setStyle = function(value, name){
  this.object.style[name] = value;
  
  return value;
};

/**
 * Переключает видимость объекта.
 *
 * @param {Boolean} visible Флаг видимости.
 * @param {String} mode Модификатор видимости (block по умолчанию).
 *
 * @return {Boolean} Флаг видимости.
 */
Binder.handlers.visible = function(visible, mode){
  if(visible){
    this.object.style.display = mode !== undefined? mode : 'block';
  }
  else{
    this.object.style.display = 'none';
  }

  return visible;
};

/**
 * Переключает класс объекта.
 *
 * @param {Boolean} flag Флаг переключателя.
 * @param {String} name Наименование целевого класса.
 *
 * @return {Boolean} Флаг переключателя.
 */
Binder.handlers.toggleClass = function(flag, name){
  if(flag){
    this.object.classList.add(name);
  }
  else{
    this.object.classList.remove(name);
  }

  return flag;
};

module.exports = Binder;

});
