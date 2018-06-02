import "reflect-metadata";
import { Input, Output, EventEmitter } from "@angular/core";

const inputDecorator = Input();
const outputDecorator = Output();

const eventList = [
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mousedown",
  "mouseup",
  "wheel",
  "click",
  "dblclick",
  "dragstart",
  "dragmove",
  "dragend"
];

export const PROPERTIES_META_KEY = "konva_properties";
export function BindMethod(drawableKey: string, fn = "text") {
  function actualDecorator(target, name) {
    // console.log(target, name);
    if (name === "node") return;
    const konvaPropKeyPrefix = "_";
    let propList = Reflect.getMetadata(PROPERTIES_META_KEY, target) || [];
    propList.push(name);
    Reflect.defineMetadata(PROPERTIES_META_KEY, propList, target);
    Object.defineProperty(target, name, {
      get: function() {
        const drawable = this[drawableKey];

        if (drawable) {
          const fnToCall = drawable[fn] as Function;
          if (fnToCall) {
            if (typeof fnToCall === "function") {
              return fnToCall.apply(drawable);
            } else {
              return fnToCall;
            }
          }
        }

        return this[konvaPropKeyPrefix + name];
      },
      set: function(value) {
        this[konvaPropKeyPrefix + name] = value;
        const drawable = this[drawableKey];
        // console.log(`Setting ${name}`);
        if (drawable) {
          const fnToCall = drawable[fn] as Function;
          const setterKey = "set" + fn[0].toUpperCase() + fn.slice(1);
          const setterCall = drawable[setterKey] as Function;
          if (fnToCall) {
            if (typeof fnToCall === "function") {
              fnToCall.apply(drawable, [value]);
            } else {
              drawable[fn] = value;
            }
          } else if (typeof setterCall === "function") {
            setterCall.apply(drawable, [value]);
          }

          const stage = drawable.getStage();
          if (stage) stage.draw();
        }
      },
      enumerable: true,
      configurable: true
    });
  }

  return actualDecorator;
}

export function NodeMethodBinding(fnToCall) {
  return BindMethod("node", fnToCall);
}

export const EVENTS_META_KEY = "konva_events";
const EMITTER_PREFIX = "_event_emitter";
export function KonvaAutoBind<T = any>(
  otherTarget: Object,
  additionalEvents: string[] = [],
  additionalProps: string[] = []
) {
  return function(target) {
    // console.log(otherTarget);
    Object.getOwnPropertyNames(otherTarget)
      .filter(x => x.startsWith("set"))
      .concat(additionalProps)
      .forEach(prop => {
        let name = (prop.startsWith("set") && prop.substring(3)) || prop;
        name = name[0].toLowerCase() + name.slice(1);
        // console.log(`Adding ${name}`);
        target.prototype[name] = undefined;
        inputDecorator(target.prototype, name);
        NodeMethodBinding(name)(target.prototype, name);
      });
    let evtList = Reflect.getMetadata(EVENTS_META_KEY, target) || eventList;
    evtList = evtList.concat(additionalEvents);

    Reflect.defineMetadata(EVENTS_META_KEY, evtList, target);

    if (!evtList) {
      throw new Error("Event list not defined");
    }

    evtList.forEach(evt => {
      // console.log(`Adding event ${evt}`);
      const key = `${EMITTER_PREFIX}_${evt}`;

      Object.defineProperty(target.prototype, evt, {
        get: function() {
          let emitter = this[key];
          if (!emitter) {
            emitter = this[key] = new EventEmitter<T>();
          }
          return emitter;
        },
        set: function(value) {
          this[key] = value;
          console.warn(`Tried to set ${evt} event emitter`);
        },
        enumerable: true,
        configurable: true
      });
      outputDecorator(target.prototype, evt);
    });
    return target;
  };
}
