import * as Konva from "konva";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { nameof } from "../../../utils";
const inputDecorator = Input();
const outputDecorator = Output();

function BindToMethod(drawableKey: string, fn = "text") {
  function actualDecorator(target, name) {
    console.log(target, name);

    Object.defineProperty(target, name, {
      get: function() {
        const drawable = this[drawableKey];

        if (drawable) {
          const fnToCall = drawable[fn] as Function;
          if (fnToCall) {
            return fnToCall.apply(drawable);
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

  public get entName() {
    return this.constructor.name;
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
    this.node.on("dragmove", () => {});
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
