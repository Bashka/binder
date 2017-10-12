var assert = require('assert'),
  sinon = require('sinon'),
  NodeBindersFactory = require('../../src/Factory/NodeBindersFactory');

describe('forEachAttr', function(){
  it('Node with one attr', function(){
    var factory = new NodeBindersFactory,
      node = {
        attributes: [
          {name: 'bind-change'}
        ]
      },
      spy = sinon.spy();

    factory.forEachAttr(node, spy);

    assert.ok(spy.calledOnce);
    assert.equal('change', spy.getCall(0).args[0]);
    assert.equal(node.attributes[0], spy.getCall(0).args[1]);
  });

  it('Node with attrs', function(){
    var factory = new NodeBindersFactory,
      node = {
        attributes: [
          {name: 'bind-change'},
          {name: 'bind-click'},
          {name: 'bind-change:prop'}
        ]
      },
      spy = sinon.spy();

    factory.forEachAttr(node, spy);

    assert.equal(3, spy.callCount);
    assert.equal('change', spy.getCall(0).args[0]);
    assert.equal(node.attributes[0], spy.getCall(0).args[1]);
    assert.equal('click', spy.getCall(1).args[0]);
    assert.equal(node.attributes[1], spy.getCall(1).args[1]);
    assert.equal('change:prop', spy.getCall(2).args[0]);
    assert.equal(node.attributes[2], spy.getCall(2).args[1]);
  });

  it('Node without attrs', function(){
    var factory = new NodeBindersFactory,
      node = {
        attributes: []
      },
      spy = sinon.spy();

    factory.forEachAttr(node, spy);

    assert.equal(0, spy.callCount);
  });

  it('Return concat results', function(){
    var factory = new NodeBindersFactory,
      node = {
        attributes: [
          {name: 'bind-change'},
          {name: 'bind-click'}
        ]
      },
      stub = sinon.stub();
    stub.onCall(0).returns([1]);
    stub.onCall(1).returns([2]);

    var result = factory.forEachAttr(node, stub);

    assert.ok(result.constructor === Array);
    assert.equal(2, result.length);
    assert.equal(1, result[0]);
    assert.equal(2, result[1]);
  });
});
