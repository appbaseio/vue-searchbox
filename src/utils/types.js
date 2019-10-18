import VueTypes from "vue-types";

const DataField = VueTypes.shape({
  field: VueTypes.string,
  weight: VueTypes.number
});

export const types = {
  app: VueTypes.string.isRequired,
  url: VueTypes.string.def("https://scalr.api.appbase.io"),
  credentials: VueTypes.string.isRequired,
  analytics: VueTypes.bool.def(false),
  headers: VueTypes.object,
  dataField: VueTypes.oneOfType([
    VueTypes.string,
    VueTypes.arrayOf(VueTypes.oneOfType([VueTypes.string, DataField]))
  ]),
  nestedField: VueTypes.string,
  title: VueTypes.string,
  defaultValue: VueTypes.string,
  value: VueTypes.string,
  placeholder: VueTypes.string.def("Search"),
  showIcon: VueTypes.bool.def(true),
  iconPosition: VueTypes.oneOf(["left", "right"]).def("right"),
  icon: VueTypes.any,
  showClear: VueTypes.bool.def(false),
  clearIcon: VueTypes.any,
  autosuggest: VueTypes.bool.def(true),
  strictSelection: VueTypes.bool.def(false),
  defaultSuggestions: VueTypes.arrayOf(VueTypes.object),
  debounce: VueTypes.number.def(0),
  highlight: VueTypes.bool.def(false),
  highlightField: VueTypes.oneOfType([
    VueTypes.string,
    VueTypes.arrayOf(VueTypes.string)
  ]),
  customHighlight: VueTypes.func,
  queryFormat: VueTypes.oneOf(["and", "or"]).def("or"),
  fuzziness: VueTypes.oneOf([0, 1, 2, "AUTO"]),
  showVoiceSearch: VueTypes.bool.def(false),
  searchOperators: VueTypes.bool.def(false),
  render: VueTypes.func,
  renderError: VueTypes.func,
  renderNoSuggestion: VueTypes.oneOfType([VueTypes.string, VueTypes.any]),
  getMicInstance: VueTypes.func,
  renderMic: VueTypes.func,
  innerClass: VueTypes.object,
  style: VueTypes.object,
  defaultQuery: VueTypes.func,
  beforeValueChange: VueTypes.func,
  className: VueTypes.string.def(""),
  loader: VueTypes.object,
  autoFocus: VueTypes.bool.def(false)
};
