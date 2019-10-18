import { types } from "../utils/types";
import Input from "../styles/Input";
import Searchbase from "@appbaseio/searchbase";

const VueSearchbox = {
  name: "VueSearchbox", // vue component name
  props: {
    app: types.app,
    url: types.url,
    credentials: types.credentials,
    analytics: types.analytics,
    headers: types.headers,
    dataField: types.dataField,
    nestedField: types.nestedField,
    title: types.title,
    defaultValue: types.defaultValue,
    value: types.value,
    placeholder: types.placeholder,
    showIcon: types.showIcon,
    iconPosition: types.iconPosition,
    icon: types.icon,
    showClear: types.showClear,
    clearIcon: types.clearIcon,
    autosuggest: types.autosuggest,
    strictSelection: types.strictSelection,
    defaultSuggestions: types.defaultSuggestions,
    debounce: types.debounce,
    highlight: types.highlight,
    highlightField: types.highlightField,
    customHighlight: types.customHighlight,
    queryFormat: types.queryFormat,
    fuzziness: types.fuzziness,
    showVoiceSearch: types.showVoiceSearch,
    searchOperators: types.searchOperators,
    render: types.render,
    renderError: types.renderError,
    renderNoSuggestion: types.renderNoSuggestion,
    getMicInstance: types.getMicInstance,
    renderMic: types.renderMic,
    innerClass: types.innerClass,
    defaultQuery: types.defaultQuery,
    beforeValueChange: types.beforeValueChange,
    className: types.className,
    loader: types.loader,
    autoFocus: types.autoFocus
  },
  created() {
    this._initSearchBase();
  },
  methods: {
    _initSearchBase() {
      const {
        app,
        url,
        dataField,
        credentials,
        analytics,
        headers,
        nestedField,
        defaultQuery,
        beforeValueChange,
        queryFormat,
        defaultSuggestions,
        fuzziness,
        searchOperators
      } = this.$props;

      try {
        const transformQuery = query => {
          if (defaultQuery) return defaultQuery(query, this.state.currentValue);
          return Promise.resolve(query);
        };

        this.searchBase = new Searchbase({
          index: app,
          url,
          dataField,
          credentials,
          analytics,
          headers,
          nestedField,
          transformQuery,
          beforeValueChange,
          queryFormat,
          suggestions: defaultSuggestions,
          fuzziness,
          searchOperators
        });
      } catch (e) {
        console.error(e);
      }
    }
  },
  render() {
    console.log(this.searchBase);
    return <Input />;
  }
};

export default VueSearchbox;
