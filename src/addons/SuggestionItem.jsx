const SuggestionItem = {
  props: ["suggestion", "currentValue"],
  render() {
    const { suggestion, currentValue } = this.$props;
    const { label, value } = suggestion;
    const stringToReplace = currentValue.split(" ").join("|");
    if (label) {
      // label has highest precedence
      return typeof label === "string" ? (
        <div
          className="trim"
          domPropsInnerHTML={label.replace(
            new RegExp(stringToReplace, "ig"),
            matched => {
              return `<mark class="highlight-class">${matched}</mark>`;
            }
          )}
        />
      ) : (
        label
      );
    }
    return value;
  }
};

export default SuggestionItem;
