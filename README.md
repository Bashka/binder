### Биндинг

Класс `Binder` предоставляет механизм связывания субъекта с объектом:

```html
<h3 id="h"></h3>
<div>
    <input type="text" id="input"/>
</div>
```

```js
var model = new Model;

// Биндер изменения состояния элемента input
var inputBinder = new Binder(document.getElementById('input'), 'keyup', model, [
    // Получить свойство value элемента
    function(){
        return this.subject.value;
    },
    // Установить полученное предыдущим обработчиком значение свойству prop модели
    function(value){
        this.object.set('prop', value);

        return value;
    }
]);
inputBinder.sync(); // Предварительная синхронизация модели с представлением
inputBinder.bind(); // Выполнить связывание

// Биндер изменения состояния свойства prop модели
var hBinder = new Binder(model, 'change:prop', document.getElementById('h'), [
    // Получить свойство prop модели
    function(){
        return this.object.get('prop');
    },
    // Установить полученное предыдущим обработчиком значение свойству innerText элемента
    function(value){
        this.subject.innerText = value;

        return value;
    }
]);
hBinder.bind(); // Выполнить связывание
```

### Стандартные обработчики

Пакет `DefaultHandlers` добавляет стандартные обработчики:

```html
<h3 id="h"></h3>
<div>
    <input type="text" id="input"/>
</div>
```

```js
var model = new Model;

// Биндер изменения состояния элемента input
var inputBinder = new Binder(document.getElementById('input'), 'keyup', model, [
    // Получить свойство value элемента
    'getValue',
    // Установить полученное предыдущим обработчиком значение свойству prop модели
    ['set', ['prop']]
]);
inputBinder.sync(); // Предварительная синхронизация модели с представлением
inputBinder.bind(); // Выполнить связывание

// Биндер изменения состояния свойства prop модели
var hBinder = new Binder(model, 'change:prop', document.getElementById('h'), [
    // Получить свойство prop модели
    ['get' ['prop']],
    // Установить полученное предыдущим обработчиком значение свойству innerText элемента
    'setText'
]);
hBinder.bind(); // Выполнить связывание
```

### Биндинг на основе аттрибутов DOM-элемента

Класс `Factory/NodeBindersFactory` позволяет создать группу биндеров на основе атрибутов элемента:

```html
<h3 id="h" bind-change:prop="get(prop) | setText"></h3>
<div>
    <input type="text" id="input" bind-keyup="getValue | set(prop)"/>
</div>
```

```js
var inputBinder = new NodeBindersFactory().build(
    document.getElementById('input'),
    document.getElementById('input'),
    model
);
inputBinder.sync();
inputBinder.bind();

var hBinder = new NodeBindersFactory().build(
    document.getElementById('h'),
    model,
    document.getElementById('h')
);
hBinder.bind();
```
