import * as Konva from "konva";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { nameof } from "../../../utils";
const inputDecorator = Input();
const outputDecorator = Output();

const PROPERTIES_META_KEY = "konva_properties";
function BindToMethod(drawableKey: string, fn = "text") {
  function actualDecorator(target, name) {
    console.log(target, name);
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

        return this["_" + name];
      },
      set: function(value) {
        this["_" + name] = value;
        const drawable = this[drawableKey];
        console.log(`Setting ${name}`);
        if (drawable) {
          const fnToCall = drawable[fn] as Function;
          if (fnToCall) {
            if (typeof fnToCall === "function") {
              fnToCall.apply(drawable, [value]);
            } else {
              drawable[fn] = value;
            }
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

export function NodeBinding(fnToCall) {
  return BindToMethod(nameof<Entity>("node"), fnToCall);
}

const EVENTS_META_KEY = "konva_events";
const EMITTER_PREFIX = "_event_emitter";
export function KonvaBind(otherTarget, events: string[] = [], otherProps = []) {
  return function(target) {
    console.log(otherTarget);
    Object.getOwnPropertyNames(otherTarget)
      .filter(x => x.startsWith("set"))
      .concat(otherProps)
      .forEach(prop => {
        let name = (prop.startsWith("set") && prop.substring(3)) || prop;
        name = name[0].toLowerCase() + name.slice(1);
        console.log(`Adding ${name}`);
        target.prototype[name] = undefined;
        inputDecorator(target.prototype, name);
        NodeBinding(name)(target.prototype, name);
      });
    let evtList = Reflect.getMetadata(EVENTS_META_KEY, target.prototype);
    if ((!evtList || evtList.length === 0) && eventList) {
      Reflect.defineMetadata(EVENTS_META_KEY, eventList, target.prototype);
      evtList = eventList;
    }

    if (!evtList) {
      throw new Error("Event list not defined");
    }

    evtList.forEach(evt => {
      console.log(`Adding event ${evt}`);
      Object.defineProperty(target.prototype, evt, {
        get: function() {
          const key = `${EMITTER_PREFIX}_${evt}`;
          let emitter = this[key];
          if (!emitter) {
            emitter = this[key] = new EventEmitter<any>();
          }
          return emitter;
        },
        set: function(value) {
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

export interface EntityEvent {
  sender: Entity;
  event: any;
}

@KonvaBind(Konva.Node.prototype, eventList)
export class Entity {
  public initialized = false;
  private _node: Konva.Node;

  _debugVisible = false;
  public get _visible() {
    return this.opacity > 0;
  }

  public set _visible(value) {
    this.opacity = value ? 1 : 0;
  }

  toggleDebug() {
    this._debugVisible = !this._debugVisible;
  }

  public get entName() {
    return this.constructor.name;
  }

  public toggleVisibility() {
    this._visible = !this._visible;
  }

  public get node() {
    return this._node;
  }

  public set node(value) {
    this._node = value;
    eventList.forEach(evt => {
      const emitterKey = `${evt}`;
      const emitter = this[emitterKey] as EventEmitter<any>;

      console.log("Subbing ", emitterKey);
      this.node.on(evt, val => {
        emitter.emit({ sender: this, event: val });
        // console.log(`Emitting ${evt}`);
      });
    });

    const props = Reflect.getMetadata(
      PROPERTIES_META_KEY,
      this.constructor.prototype
    );
    props.forEach(element => {
      console.log(`Prop ${element}`);
      const val = this["_" + element];
      if (val === undefined) return;
      this[element] = val;
    });
  }

  get(key) {
    return this[key];
  }

  @Input() stage: Konva.Stage;
  @Input() layer: Konva.Layer;

  constructor() {}

  public init() {
    this.initialized = true;
  }
}
