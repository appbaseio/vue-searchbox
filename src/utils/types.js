import VueTypes from "vue-types";

export const string = VueTypes.string;
export const bool = VueTypes.bool;
export const object = VueTypes.object;
export const array = VueTypes.array;
export const number = VueTypes.number;
export const func = VueTypes.func;
export const any = VueTypes.any;

const DataField = VueTypes.shape({
  field: string,
  weight: number
});

export const dataField = VueTypes.oneOfType([
  string,
  VueTypes.arrayOf(VueTypes.oneOfType([string, DataField]))
]);

export const reactType = VueTypes.oneOfType([
  string,
  VueTypes.arrayOf(string),
  object,
  VueTypes.arrayOf(object)
]);

export const react = VueTypes.shape({
  and: reactType,
  or: reactType,
  not: reactType
});

export const position = VueTypes.oneOf(["left", "right"]);

export const suggestions = VueTypes.arrayOf(object);

export const highlightField = VueTypes.oneOfType([
  string,
  VueTypes.arrayOf(string)
]);

export const queryFormat = VueTypes.oneOf(["and", "or"]);

export const fuzziness = VueTypes.oneOf([0, 1, 2, "AUTO"]);

export const title = VueTypes.oneOfType([string, any]);

export const wholeNumber = function(props, propName, componentName) {
  if (typeof props[propName] != "number" || props[propName] < 0) {
    return new Error(
      `Invalid type of ${propName} supplied to ${componentName}. Validation failed`
    );
  }
};
