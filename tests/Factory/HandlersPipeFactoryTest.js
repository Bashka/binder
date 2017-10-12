var assert = require('assert'),
  sinon = require('sinon'),
  HandlersPipeFactory = require('../../src/Factory/HandlersPipeFactory');

describe('forEachHandler', function(){
  it('String with one handler', function(){
    var factory = new HandlersPipeFactory,
      spy = sinon.spy();
    
    factory.forEachHandler('log', spy);

    assert.ok(spy.calledOnce);
    assert.ok(spy.withArgs('log'));
  });

  it('String with handlers', function(){
    var factory = new HandlersPipeFactory,
      spy = sinon.spy();
    
    factory.forEachHandler('log | set(foo)', spy);

    assert.equal('log', spy.getCall(0).args[0]);
    assert.equal('set(foo)', spy.getCall(1).args[0]);
  });

  it('String with undefined handler', function(){
    var factory = new HandlersPipeFactory,
      spy = sinon.spy();
    
    factory.forEachHandler('log | ', spy);

    assert.equal(1, spy.callCount);
    assert.equal('log', spy.getCall(0).args[0]);
  });
});

describe('stringToHandler', function(){
  it('String without args', function(){
    var factory = new HandlersPipeFactory;

    var handler = factory.stringToHandler('set');

    assert.equal('set', handler[0]);
    assert.ok(typeof handler[1] == 'object' && handler[1].constructor === Array);
    assert.equal(0, handler[1].length);
  });

  it('String with empty args', function(){
    var factory = new HandlersPipeFactory;

    var handler = factory.stringToHandler('set()');

    assert.equal('set', handler[0]);
    assert.ok(typeof handler[1] == 'object' && handler[1].constructor === Array);
    assert.equal(0, handler[1].length);
  });

  it('String with one arg', function(){
    var factory = new HandlersPipeFactory;

    var handler = factory.stringToHandler('set(foo)');

    assert.equal('set', handler[0]);
    assert.ok(typeof handler[1] == 'object' && handler[1].constructor === Array);
    assert.equal(1, handler[1].length);
    assert.equal('foo', handler[1][0]);
  });

  it('String with args', function(){
    var factory = new HandlersPipeFactory;

    var handler = factory.stringToHandler('set(x, y, z)');

    assert.equal('set', handler[0]);
    assert.ok(typeof handler[1] == 'object' && handler[1].constructor === Array);
    assert.equal(3, handler[1].length);
    assert.equal('x', handler[1][0]);
    assert.equal('y', handler[1][1]);
    assert.equal('z', handler[1][2]);
  });

  it('String with undefined arg', function(){
    var factory = new HandlersPipeFactory;

    var handler = factory.stringToHandler('set(foo,)');

    assert.equal('set', handler[0]);
    assert.ok(typeof handler[1] == 'object' && handler[1].constructor === Array);
    assert.equal(2, handler[1].length);
    assert.equal('foo', handler[1][0]);
    assert.equal('', handler[1][1]);
  });

  it('Bad string', function(done){
    var factory = new HandlersPipeFactory;

    try{
      factory.stringToHandler('set(foo) bar');
      done('Error was expected');
    }
    catch(err){
      if(err === 'Invalid handler string'){
        done();
      }
      else{
        done('Error was expected to be "Invalid handler string", got ' + err);
      }
    }
  });
});
