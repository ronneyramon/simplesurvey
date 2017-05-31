/// <reference types="zone.js" />
/// <reference types="@types/meteor" />
/// <reference types="@types/underscore" />
/// <reference types="@types/chai" />
/// <reference types="@types/mocha" />

declare module "*.html" {
  const template: string;
  export default template;
}

declare module "*.scss" {
  const style: string;
  export default style;
}

declare module "*.less" {
  const style: string;
  export default style;
}

declare module "*.css" {
  const style: string;
  export default style;
}

declare module "*.sass" {
  const style: string;
  export default style;
}

declare module "meteor/hwillson:stub-collections" {
  import { Mongo } from "meteor/mongo";

  interface IStubCollections {
    stub(collection: Mongo.Collection);
    restore();
  }

  const StubCollections: IStubCollections;

  export default StubCollections;
}

declare module "chai-spies" {
  const chaiSpies: (chai: any, utils: any) => void;

  export = chaiSpies;
}

interface SpyCalledWith extends Chai.Assertion {
  (...args: any[]): void;
  exactly(...args: any[]): void;
}

interface SpyCalledAlways extends Chai.Assertion {
  with: SpyCalledWith;
}

interface SpyCalledAt {
  most(n: number): void;
  least(n: number): void;
}

interface SpyCalled {
  (n?: number): void;
  /**
   * Assert that a spy has been called exactly once
   *
   * @api public
   */
  once: any;
  /**
   * Assert that a spy has been called exactly twice.
   *
   * @api public
   */
  twice: any;
  /**
   * Assert that a spy has been called exactly `n` times.
   *
   * @param {Number} n times
   * @api public
   */
  exactly(n: number): void;
  with: SpyCalledWith;
  /**
   * Assert that a spy has been called `n` or more times.
   *
   * @param {Number} n times
   * @api public
   */
  min(n: number): void;
  /**
   * Assert that a spy has been called `n` or fewer times.
   *
   * @param {Number} n times
   * @api public
   */
  max(n: number): void;
  at: SpyCalledAt;
  above(n: number): void;
  /**
   * Assert that a spy has been called more than `n` times.
   *
   * @param {Number} n times
   * @api public
   */
  gt(n: number): void;
  below(n: number): void;
  /**
   * Assert that a spy has been called less than `n` times.
   *
   * @param {Number} n times
   * @api public
   */
  lt(n: number): void;
}

declare namespace Chai {
  interface ChaiStatic {
    spy(): any;
  }

  interface Assertion {
    called: SpyCalled;
    always: SpyCalledAlways;
  }
}


// Type definitions for aldeed:simple-schema meteor package
// Project: https://atmospherejs.com/aldeed/simple-schema
// Definitions by:  Dave Allen <https://github.com/fullflavedave>

interface IAldeedSimpleSchemaPropertyAttributes {
  type: any | any[];
  label?: string | Function;
  min?: number | Date;
  max?: number | Date;
  exclusiveMin?: boolean;
  exclusiveMax?: boolean;
  minCount?: number;
  maxCount?: number;
  optional?: boolean;
  allowedValues?: any[];
  regEx?: RegExp;
  blackbox?: boolean;
  trim?: boolean;
  custom?: Function;
  defaultValue?: any;
  autoValue?: Function;
  decimal?: boolean;

  /**
   * Index for collection
   * Can be true, -1 or 1
   * @type {number|boolean}
   */
  index?:number|boolean;

  /**
   * Unique flag for index
   * @type {boolean}
   */
  unique?: boolean;

  /**
   * Sparce flag for index
   * @type {boolean}
   */
  sparse?: boolean;
}

interface SimpleSchemaDefinition {
  [property: string]: IAldeedSimpleSchemaPropertyAttributes;
}

interface ValidateOptions {
  modifier?: boolean;
  upsert?: boolean;
  extendedCustomContext: { [key: string]: any };
}

interface SimpleSchemaCleanOptions {
  filter?: boolean;
  autoConvert?: boolean;
  removeEmptyStrings?: boolean;
  trimStrings?: boolean;
  getAutoValues?: boolean;
  isModifier?: boolean;
  extendedAutoValueContext?: any;
}

interface SimpleSchema_Static {
  new(definition: SimpleSchemaDefinition|SimpleSchema_Instance[]): SimpleSchema_Instance;
  extendOptions(options: { [option: string]: any }): void;
  addValidator(validator: Function): void;
  messages(messageKeysAndTexts: { [errorKey: string]: string; /** Text for that error **/ } | { exp: RegExp; msg: string; }[]): void;
  debug(isDebugging: boolean): void;
  RegEx: { Email: RegExp, WeakDomain: RegExp, Url: RegExp, Domain: RegExp, IP: RegExp, IPv4: RegExp, IPv6: RegExp, Id: RegExp, ZipCode: RegExp};
}

interface SimpleSchema_Instance {
  messages(messages: Object): void;
  schema(): SimpleSchema_Static;
  validate(obj: any, options?: ValidateOptions): boolean;
  validateOne(obj: any, key: string, options: ValidateOptions): boolean;
  clean(obj: any, options?: SimpleSchemaCleanOptions): void;
  addValidator(validator: Function): void;
  newContext(): {
    validate(obj: any, options?: ValidateOptions): boolean;
    validateOne(obj: any, key: string, options: ValidateOptions): boolean;
    isValid(): boolean;
    invalidKeys(): { name: string; type: any }[];
    keyIsInvalid(key: string): boolean;
    keyErrorMessage(key: string): string;
    resetValidation(): void;
  };
  validator(): (...args: any[]) => boolean;
}

declare const SimpleSchema: SimpleSchema_Static;

declare module 'meteor/aldeed:simple-schema' {
  export const SimpleSchema: SimpleSchema_Static;
  type SimpleSchema = SimpleSchema_Instance;
}

// Type definitions for mdg:validated-method meteor package
// Project: https://atmospherejs.com/mdg/validated-method
// Definitions by:  Dave Allen <https://github.com/fullflavedave>


interface ValidatedMethod_Static {
  new(options: {
    name: string;
    mixins?: Function[];
    validate: (args: { [key: string]: any; }) => void; // returned from SimpleSchemaInstance.validator() method;
    applyOptions?: {
      noRetry: boolean;
      returnStubValue: boolean;
      throwStubExceptions: boolean;
      onResultReceived: (result: any) => void;
      [key: string]: any };
    run: (args: { [key: string]: any; }) => void;
  }): ValidatedMethod_Instance;
}

interface ValidatedMethod_Instance {
  call(args: { [key: string]: any; }, cb?: (error: any, result: any) => void ): void;
  _execute(context: { [key: string]: any; }, args: { [key: string]: any; }): void;
}

declare const ValidatedMethod: ValidatedMethod_Static;

declare module 'meteor/mdg:validated-method' {
  export const ValidatedMethod: ValidatedMethod_Static;
}