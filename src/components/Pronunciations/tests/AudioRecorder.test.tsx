import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import configureMockStore from "redux-mock-store";

import "tests/reactI18nextMock";

import AudioRecorder from "components/Pronunciations/AudioRecorder";
import RecorderIcon, {
  recordButtonId,
  recordIconId,
} from "components/Pronunciations/RecorderIcon";
import {
  PronunciationsState,
  defaultState as pronunciationsState,
  PronunciationsStatus,
} from "components/Pronunciations/Redux/PronunciationsReduxTypes";
import theme from "types/theme";

jest.mock("components/Pronunciations/Recorder");

let testRenderer: renderer.ReactTestRenderer;

const createMockStore = configureMockStore();
const mockStore = createMockStore({ pronunciationsState });
function mockRecordingState(wordId: string): {
  pronunciationsState: Partial<PronunciationsState>;
} {
  return {
    pronunciationsState: {
      type: PronunciationsStatus.Recording,
      payload: wordId,
    },
  };
}

beforeAll(() => {
  renderer.act(() => {
    testRenderer = renderer.create(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={mockStore}>
            <AudioRecorder wordId="2" uploadAudio={jest.fn()} />
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  });
});

describe("Pronunciations", () => {
  test("pointerDown and pointerUp", () => {
    const mockStartRecording = jest.fn();
    const mockStopRecording = jest.fn();
    renderer.act(() => {
      testRenderer = renderer.create(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Provider store={mockStore}>
              <RecorderIcon
                startRecording={mockStartRecording}
                stopRecording={mockStopRecording}
                wordId={"mockId"}
              />
            </Provider>
          </ThemeProvider>
        </StyledEngineProvider>
      );
    });

    expect(mockStartRecording).not.toBeCalled();
    testRenderer.root.findByProps({ id: recordButtonId }).props.onPointerDown();
    expect(mockStartRecording).toBeCalled();

    expect(mockStopRecording).not.toBeCalled();
    testRenderer.root.findByProps({ id: recordButtonId }).props.onPointerUp();
    expect(mockStopRecording).toBeCalled();
  });

  test("default style is iconRelease", () => {
    renderer.act(() => {
      testRenderer = renderer.create(
        <ThemeProvider theme={theme}>
          <StyledEngineProvider>
            <Provider store={mockStore}>
              <AudioRecorder wordId="1" uploadAudio={jest.fn()} />
            </Provider>
          </StyledEngineProvider>
        </ThemeProvider>
      );
    });
    const icon = testRenderer.root.findByProps({ id: recordIconId });
    expect(icon.props.className.includes("iconRelease")).toBeTruthy();
  });

  test("style depends on pronunciations state", () => {
    const wordId = "1";
    const mockStore2 = createMockStore(mockRecordingState(wordId));
    renderer.act(() => {
      testRenderer = renderer.create(
        <ThemeProvider theme={theme}>
          <StyledEngineProvider>
            <Provider store={mockStore2}>
              <AudioRecorder wordId={wordId} uploadAudio={jest.fn()} />
            </Provider>
          </StyledEngineProvider>
        </ThemeProvider>
      );
    });
    const icon = testRenderer.root.findByProps({ id: recordIconId });
    expect(icon.props.className.includes("iconPress")).toBeTruthy();
  });
});