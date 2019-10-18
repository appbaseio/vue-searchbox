import { types } from "../utils/types";
import Input from "../styles/Input";
import Searchbase from "@appbaseio/searchbase";
import DownShift from "./DownShift.jsx";
import { getClassName } from "../utils/helper";
import { suggestions, suggestionsContainer } from "../styles/Suggestions";
import SuggestionItem from "../addons/SuggestionItem.jsx";
import Title from "../styles/Title";
import Icons from "./Icons.jsx";

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
      const { debounce } = this.$props;
      this.isOpen = isOpen;
      if (debounce > 0)
        this.searchBase.setValue(value, { triggerQuery: false });
      this.triggerSuggestionsQuery(value);
    },
    triggerSuggestionsQuery(value) {
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
    handleMicClick() {
      this.searchBase &&
        this.searchBase.onMicClick(null, {
          triggerSuggestionsQuery: true
        });
    },
    renderIcons() {
      const {
        iconPosition,
        showClear,
        clearIcon,
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
          innerClass={innerClass}
          enableVoiceSearch={showVoiceSearch}
          micStatus={micStatus}
          handleMicClick={this.handleMicClick}
        />
      );
    },
    renderNoSuggestionComponent() {
      const { renderNoSuggestion, innerClass, renderError } = this.$props;
      const {
        loading,
        error,
        isOpen,
        currentValue,
        suggestionsList
      } = this.$data;
      if (
        renderNoSuggestion &&
        isOpen &&
        !suggestionsList.length &&
        !loading &&
        currentValue &&
        !(renderError && error)
      ) {
        return (
          <div
            class={`no-suggestions ${getClassName(innerClass, "noSuggestion")}`}
          >
            {typeof renderNoSuggestion === "function"
              ? renderNoSuggestion(currentValue)
              : renderNoSuggestion}
          </div>
        );
      }
      return null;
    },
    renderErrorComponent() {
      const { renderError, innerClass } = this.$props;
      const { error, loading, currentValue } = this.$data;
      if (error && renderError && currentValue && !loading) {
        return (
          <div class={getClassName(innerClass, "error")}>
            {typeof renderError === "function"
              ? renderError(error)
              : renderError}
          </div>
        );
      }
      return null;
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
      showIcon,
      showClear,
      iconPosition,
      title,
      defaultSuggestions,
      autosuggest,
      placeholder,
      autoFocus,
      innerRef
    } = this.$props;
    const { currentValue, isOpen, suggestionsList } = this.$data;
    return (
      <div class={className}>
        {title && (
          <Title class={getClassName(innerClass, "title") || null}>
            {title}
          </Title>
        )}
        {defaultSuggestions || autosuggest ? (
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
                        value: currentValue ? currentValue : ""
                      })
                    }}
                  />
                  {this.renderIcons()}
                  {this.renderErrorComponent()}
                  {isOpen && suggestionsList.length ? (
                    <ul
                      class={`${suggestions} ${getClassName(
                        innerClass,
                        "list"
                      )}`}
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
                    this.renderNoSuggestionComponent()
                  )}
                </div>
              )
            }}
          />
        ) : (
          <div class={suggestionsContainer}>
            <Input
              class={getClassName(innerClass, "input") || ""}
              placeholder={placeholder}
              {...{
                on: {
                  blur: e => {
                    this.$emit("blur", e);
                  },
                  keypress: e => {
                    this.$emit("keyPress", e);
                  },
                  input: this.onInputChange,
                  focus: e => {
                    this.$emit("focus", e);
                  },
                  keydown: e => {
                    this.$emit("keyDown", e);
                  },
                  keyup: e => {
                    this.$emit("keyUp", e);
                  }
                }
              }}
              {...{
                domProps: {
                  autofocus: autoFocus,
                  value: currentValue ? currentValue : ""
                }
              }}
              iconPosition={iconPosition}
              showIcon={showIcon}
              showClear={showClear}
              innerRef={innerRef}
            />
            {this.renderIcons()}
          </div>
        )}
      </div>
    );
  }
};

export default VueSearchbox;
