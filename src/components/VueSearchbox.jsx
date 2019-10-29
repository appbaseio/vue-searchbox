import { types } from "../utils/types";
import Input from "../styles/Input";
import Searchbase from "@appbaseio/searchbase";
import DownShift from "./DownShift.jsx";
import { getClassName } from "../utils/helper";
import { suggestions, suggestionsContainer } from "../styles/Suggestions";
import SuggestionItem from "../addons/SuggestionItem.jsx";

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
  data() {
    const { value, defaultValue, defaultSuggestions } = this.$props;
    const currentValue = value || defaultValue || "";

    this.state = {
      currentValue,
      suggestionsList: defaultSuggestions || [],
      isOpen: false,
      error: null,
      loading: false
    };
    return this.state;
  },
  created() {
    console.log(this.$props);
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
          if (defaultQuery) return defaultQuery(query, this.$data.currentValue);
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
        this.searchBase.subscribeToStateChanges(this.setStateValue, [
          "suggestions"
        ]);

        this.searchBase.onValueChange = nextValue => {
          this.currentValue = nextValue;
          this.$emit("valueChange", nextValue);
        };
      } catch (e) {
        console.error(e);
      }
    },
    setStateValue({ suggestions = {} }) {
      this.suggestionsList = (suggestions.next && suggestions.next.data) || [];
    },
    onInputChange(event) {
      console.log("inside oninputchange", event);
      this.setValue({ value: event.target.value, event });
    },
    onSuggestionSelected(suggestion) {
      this.setValue({ value: suggestion && suggestion.value, isOpen: false });
      this.searchBase &&
        this.searchBase.triggerClickAnalytics(
          suggestion && suggestion._click_id
        );
    },
    setValue({ value, isOpen = true }) {
      console.log("inside setValue", this.searchBase);
      const { debounce } = this.$props;
      this.isOpen = isOpen;
      if (debounce > 0)
        this.searchBase.setValue(value, { triggerQuery: false });
      this.triggerSuggestionsQuery(value);
    },
    triggerSuggestionsQuery(value) {
      console.log("inside triggerSuggestionsQuery", value);
      this.searchBase &&
        this.searchBase.setValue(value || "", {
          triggerSuggestionsQuery: true
        });
    },
    handleFocus(event) {
      this.isOpen = true;
      this.$emit("focus", event);
    },
    handleStateChange(changes) {
      const { isOpen } = changes;
      this.isOpen = isOpen;
    },
    handleKeyDown(event, highlightedIndex) {
      // if a suggestion was selected, delegate the handling
      // to suggestion handler
      if (event.key === "Enter" && highlightedIndex === null)
        this.setValue({ value: event.target.value, isOpen: false });

      this.$emit("keyDown", event);
    },
    renderIcons() {
      const {
        iconPosition,
        showClear,
        clearIcon,
        getMicInstance,
        renderMic,
        innerClass,
        showVoiceSearch,
        icon,
        showIcon
      } = this.$props;
      const { currentValue, micStatus } = this.$data;
      return (
        <Icons
          clearValue={this.clearValue}
          iconPosition={iconPosition}
          showClear={showClear}
          clearIcon={clearIcon}
          currentValue={currentValue}
          handleSearchIconClick={this.handleSearchIconClick}
          icon={icon}
          showIcon={showIcon}
          getMicInstance={getMicInstance}
          renderMic={renderMic}
          innerClass={innerClass}
          enableVoiceSearch={showVoiceSearch}
          onMicClick={() => {
            this.searchBase &&
              this.searchBase.onMicClick(null, {
                triggerSuggestionsQuery: true
              });
          }}
          micStatus={micStatus}
        />
      );
    },
    clearValue() {
      this.setValue({ value: "", isOpen: false });
    },
    handleSearchIconClick() {
      const { currentValue } = this.$data;
      if (currentValue.trim()) {
        this.setValue({ value: currentValue, isOpen: false });
      }
    },
    getBackgroundColor(highlightedIndex, index) {
      return highlightedIndex === index ? "#eee" : "#fff";
    }
  },
  render() {
    const {
      className,
      innerClass,
      value,
      showIcon,
      showClear,
      iconPosition
    } = this.$props;
    const { currentValue, isOpen, suggestionsList } = this.$data;
    return (
      <div class={className}>
        <DownShift
          id="searchbox-downshift"
          handleChange={this.onSuggestionSelected}
          handleMouseup={this.handleStateChange}
          isOpen={isOpen}
          scopedSlots={{
            default: ({
              getInputEvents,
              getInputProps,

              getItemProps,
              getItemEvents,

              isOpen,
              highlightedIndex
            }) => (
              <div class={suggestionsContainer}>
                <Input
                  id="search-box"
                  showIcon={showIcon}
                  showClear={showClear}
                  iconPosition={iconPosition}
                  class={getClassName(innerClass, "input")}
                  {...{
                    on: getInputEvents({
                      onInput: this.onInputChange,
                      onBlur: e => {
                        this.$emit("blur", e);
                      },
                      onFocus: this.handleFocus,
                      onKeyPress: e => {
                        this.$emit("keyPress", e);
                      },
                      onKeyDown: e => this.handleKeyDown(e, highlightedIndex),
                      onKeyUp: e => {
                        this.$emit("keyUp", e);
                      }
                    })
                  }}
                  {...{
                    domProps: getInputProps({
                      value:
                        value || (currentValue === null ? "" : currentValue)
                    })
                  }}
                />
                {isOpen && suggestionsList.length ? (
                  <ul
                    class={`${suggestions} ${getClassName(innerClass, "list")}`}
                  >
                    {suggestionsList.slice(0, 10).map((item, index) => (
                      <li
                        {...{
                          domProps: getItemProps({ item })
                        }}
                        {...{
                          on: getItemEvents({
                            item
                          })
                        }}
                        key={`${index + 1}-${item.value}`}
                        style={{
                          backgroundColor: this.getBackgroundColor(
                            highlightedIndex,
                            index
                          )
                        }}
                      >
                        <SuggestionItem
                          currentValue={currentValue}
                          suggestion={item}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>no suggestion</div>
                )}
              </div>
            )
          }}
        />
      </div>
    );
  }
};

export default VueSearchbox;
