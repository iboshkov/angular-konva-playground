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

export interface EntityEvent {
  sender: Entity;
  event?: any;
}

import {
  KonvaAutoBind,
  EVENTS_META_KEY,
  PROPERTIES_META_KEY
} from "../../decorators";

@KonvaAutoBind(Konva.Node.prototype)
export class Entity {
  /* 
    So typescript doesn't complain about dynamically generated properties and methods
  */
  [key: string]: any;

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
    return this.opacity > 0;
  }

  public set _visible(value) {
    this.opacity = value ? 1 : 0;
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
    const initEntity = async ent => {
      if (!ent.initialized && ent !== this) {
        ent.stage = this.stage;
        if (this.layer) {
          ent.layer = this.layer;
        }
        ent.parent = this;
        await ent.init();
        this.addChild(ent);
      }
    };

    for (let ent of entities.toArray()) {
      await initEntity(ent);
    }
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
