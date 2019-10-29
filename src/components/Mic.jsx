import MicIcon from "../styles/MicIcon";

const STATUS = {
  inactive: "INACTIVE",
  stopped: "STOPPED",
  active: "ACTIVE",
  denied: "DENIED"
};

const Icon = {
  props: ["status", "handleMicClick", "className"],
  render() {
    const { status, className, handleMicClick } = this.$props;
    let url;
    if (!window.SpeechRecognition) {
      url =
        "https://cdn3.iconfinder.com/data/icons/glypho-music-and-sound/64/microphone-off-512.png";
    }

    switch (status) {
      case STATUS.active:
        url = "https://media.giphy.com/media/ZZr4lCvpuMP58PXzY1/giphy.gif";
        break;
      case STATUS.stopped:
        break;
      case STATUS.denied:
        url =
          "https://cdn3.iconfinder.com/data/icons/glypho-music-and-sound/64/microphone-off-512.png";
        break;
      default:
        url =
          "https://cdn3.iconfinder.com/data/icons/glypho-music-and-sound/64/microphone-512.png";
    }
    return (
      <img
        class={className}
        onClick={handleMicClick}
        src={url}
        style={{ width: "24px", marginTop: "7px" }}
      />
    );
  }
};

const Mic = {
  props: ["iconPosition", "handleMicClick", "className", "status"],
  render() {
    const { iconPosition, className, handleMicClick, status } = this.$props;
    return (
      <MicIcon iconPosition={iconPosition}>
        <Icon
          className={className}
          handleMicClick={handleMicClick}
          status={status}
        />
      </MicIcon>
    );
  }
};

export default Mic;
