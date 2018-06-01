import * as Konva from "konva";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  ViewChildren,
  QueryList
} from "@angular/core";
const inputDecorator = Input();
const outputDecorator = Output();

const PROPERTIES_META_KEY = "konva_properties";
function BindToMethod(drawableKey: string, fn = "text") {
  function actualDecorator(target, name) {
    // console.log(target, name);
    if (name === "node") return;
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

export function NodeBinding(fnToCall) {
  return BindToMethod("node", fnToCall);
}

const EVENTS_META_KEY = "konva_events";
const EMITTER_PREFIX = "_event_emitter";
export function KonvaBind(otherTarget, events: string[] = [], otherProps = []) {
  return function(target) {
    // console.log(otherTarget);
    Object.getOwnPropertyNames(otherTarget)
      .filter(x => x.startsWith("set"))
      .concat(otherProps)
      .forEach(prop => {
        let name = (prop.startsWith("set") && prop.substring(3)) || prop;
        name = name[0].toLowerCase() + name.slice(1);
        // console.log(`Adding ${name}`);
        target.prototype[name] = undefined;
        inputDecorator(target.prototype, name);
        NodeBinding(name)(target.prototype, name);
      });
    let evtList = Reflect.getMetadata(EVENTS_META_KEY, target) || eventList;
    evtList = evtList.concat(events);

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
            emitter = this[key] = new EventEmitter<EntityEvent>();
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
  event?: any;
}

@KonvaBind(Konva.Node.prototype)
export class Entity {
  public initialized = false;
  private _node: Konva.Node;

  public parent: Entity;

  public static readonly COMPONENT_KEY = "__ng-konva-component";

  public component: Entity = this;
  _debugEnabled = false;
  @Input()
  get debugEnabled() {
    let enabled = this._debugEnabled;
    let node = this.parent;
    while (node) {
      enabled = enabled || node.debugEnabled;
      node = node.parent;
    }
    return enabled;
  }
  set debugEnabled(val) {
    this._debugEnabled = val;
  }

  @Input() debugVisible = false;

  public get _visible() {
    return this.get("opacity") > 0;
  }

  public set _visible(value) {
    this.set("opacity", value ? 1 : 0);
  }

  toggleDebug() {
    this.debugVisible = !this.debugVisible;
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
    if (!value) return;
    this._node = value;
    let evtList = Reflect.getMetadata(EVENTS_META_KEY, this.constructor);

    evtList.forEach(evt => {
      const emitterKey = `${evt}`;
      const emitter = this[emitterKey] as EventEmitter<EntityEvent>;

      // console.log(`Subbing ${this.constructor.name}`, emitterKey);
      this.node.on(evt, val => {
        if (emitter.emit) {
          emitter.emit({ sender: this, event: val });
        }
        // console.log(`Emitting ${evt}`);
      });
    });

    const props = Reflect.getMetadata(
      PROPERTIES_META_KEY,
      this.constructor.prototype
    );
    props.forEach(element => {
      // console.log(`Prop ${element}`);
      const val = this["_" + element];
      if (element === "node" || val === undefined) return;
      this[element] = val;
    });
  }

  get<T = any>(key) {
    return this[key] as T;
  }
  set(key, val) {
    return (this[key] = val);
  }

  @ContentChildren(Entity) entities: QueryList<Entity>;
  @ViewChildren(Entity) viewEntities: QueryList<Entity>;

  @Input() stage: Konva.Stage;
  @Input() layer: Konva.Layer;

  @Output() public postInit = new EventEmitter<EntityEvent>();

  constructor() {}

  addChild(child) {
    throw new Error("Not implemented");
  }

  public async syncChildren(entities) {
    await Promise.all(
      entities.map(async ent => {
        if (!ent.initialized && ent !== this) {
          ent.stage = this.stage;
          if (this.layer) {
            ent.layer = this.layer;
          }
          ent.parent = this;
          await ent.init();
          this.addChild(ent);
        }
      })
    );
    this.stage.draw();
  }

  public findClosestOfType<T extends Entity>(type: new () => T) {
    let instance = this.parent;
    while (instance.entName !== type.name) {
      if (instance.parent === undefined) {
        instance = null;
        break;
      }
      instance = instance.parent;
    }

    return <T>instance;
  }

  public async initChildren() {
    this.entities.changes.subscribe(() => this.syncChildren(this.entities));
    this.viewEntities.changes.subscribe(() =>
      this.syncChildren(this.viewEntities)
    );
    await this.syncChildren(this.entities);
    await this.syncChildren(this.viewEntities);
  }

  public async init() {
    this.initialized = true;
    this.node.setAttr(Entity.COMPONENT_KEY, this);
  }
}
