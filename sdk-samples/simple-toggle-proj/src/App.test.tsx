// for more usecases, access this link: 
import { render, screen } from "@testing-library/react";
import {
  useMockNumeratorProvider,
  mockFlags,
  resetNumeratorMocks
} from "@numerator-io/sdk-react-client";

describe("Mock Numerator Provider", () => {
  afterEach(() => {
    jest.resetAllMocks();
    resetNumeratorMocks();
  });

  it("flag on", async () => {
    const flag = {
      key: "flagkey",
      value: true,
    };
    mockFlags([flag]);

    const { getFeatureFlag } = useMockNumeratorProvider();
    const flagValue = await getFeatureFlag("flagkey", false);

    // Render the component with the flag value
    render(<button>{flagValue ? "True" : "False"}</button>);

    // Expect the button to display "True"
    expect(screen.getByText("True")).toBeDefined();
  });

  it("flag on - booleanFlagVariationDetail", async () => {
    const flag = {
      key: "flagkey",
      value: true,
    };
    mockFlags([flag]);

    const { booleanFlagVariationDetail } = useMockNumeratorProvider();
    const flagValue = await booleanFlagVariationDetail("flagkey", false);

    // Render the component with the flag value
    render(<button>{flagValue ? "True" : "False"}</button>);

    // Expect the button to display "True"
    expect(screen.getByText("True")).toBeDefined();
  });
})
