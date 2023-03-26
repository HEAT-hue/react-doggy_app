import {
  getAllByRole,
  getByRole,
  queryByText,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import mockFetch from "./mocks/mockFetch";

beforeEach(() => {
  jest.spyOn(window, "fetch").mockImplementation(mockFetch);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the landing page", async () => {
  render(<App />);

  // Expect element with heading role to have a substring pf Doggy Directory
  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);

  // Expect Select input to have a display value of "Select a breed";
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");

  // Expect selected option to be in document after fetching
  expect(
    await screen.findByRole("option", { name: "husky" })
  ).toBeInTheDocument();

  // Expect search button to be disabled since no search was made
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();

  // Expect placeholder img to be in the doc since no search was made
  expect(screen.getByRole("img")).toBeInTheDocument();
});

test("Should be able to search and display dog image results", async () => {
  render(<App />);

  // ...Simulate selecting an option and verifying it's value

  // Get the select element  from the DOM
  const select = screen.getByRole("combobox");

  // Expect option to be populated after fetching
  expect(
    await screen.findByRole("option", { name: "cattledog" })
  ).toBeInTheDocument();

  // Simulate a user selecting an option
  userEvent.selectOptions(select, "cattledog");

  // Expect the selected option to have a value
  expect(select).toHaveValue("cattledog");

  // Simulate initiating the search request
  const searchBtn = screen.getByRole("button", { name: "Search" });

  // Expect the button not to be disabled
  expect(searchBtn).not.toBeDisabled();

  // Simulate user clicking search button
  userEvent.click(searchBtn);

  // Loading state displays and gets removed when results are displayed
  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/));

  // Verify image display and results count
  const dogImages = screen.getAllByRole("img");
  expect(dogImages).toHaveLength(2);
  expect(screen.getByText(/2 results/i)).toBeInTheDocument();
});
