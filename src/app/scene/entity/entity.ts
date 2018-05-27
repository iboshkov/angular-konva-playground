import * as Konva from 'konva';
import { Component, Input } from '@angular/core';
import { nameof } from '../../../utils';
const inputDecorator = Input();

function BindToMethod(drawableKey: string, fn = 'text') {
  function actualDecorator(target, name) {
    console.log(target, name);

    Object.defineProperty(target, name, {
      get: function() {
        return this['_' + name];
      },
      set: function(value) {
          this['_' + name] = value;
          const drawable = this[drawableKey];

          if (drawable) {
            const fnToCall = drawable[fn] as Function;
            if (fnToCall) {
              fnToCall.apply(drawable, [value]);
            }
            drawable.getStage().draw();
          }
        },
      enumerable: true,
      configurable: true
    });
  }

  return actualDecorator;
}

export function NodeBinding(fnToCall) {
    return BindToMethod(nameof<Entity>("node"), fnToCall);
}

export function KonvaBind(otherTarget) {
    return function(target) {
        console.log(otherTarget);
        Object.getOwnPropertyNames(otherTarget)
            .filter(x => x.startsWith('set'))
            .forEach(prop => {
                let name = prop.substring(3);
                name = name[0].toLowerCase() + name.slice(1);
                console.log(`Adding ${name}`);
                target.prototype[name] = undefined;
                inputDecorator(target.prototype, name);
                NodeBinding(name)(target.prototype, name);
            });
        return target;
    }
}

@KonvaBind(Konva.Node.prototype)
export class Entity {
    public node: Konva.Node;// = new Konva.Node({});// = new Konva.Node({});
    @Input() stage: Konva.Stage;
    @Input() layer: Konva.Layer;

    constructor() {
    }

    public init() {}
}
