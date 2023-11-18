import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";

const HomePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = createSignal("start");
  const [savings, setSavings] = createSignal(null);
  const [endDate, setEndDate] = createSignal(null);
  const [startDate, setStartDate] = createSignal(null);

  createEffect(() => {
    step() === "done" &&
      setTimeout(() => {
        const params = `/add-expenses?start=${
          startDate().toISOString().split("T")[0]
        }&end=${endDate().toISOString().split("T")[0]}&savings=${savings()}`;
        navigate(params);
      }, 2000);
  });

  const doTheFade = (className) => {
    const opposites = { "fade-in": "fade-out", "fade-out": "fade-in" };
    const fadeElements = Array.from(
      document.getElementsByClassName(opposites[className])
    );

    fadeElements.forEach((element) => {
      const isH1andDated =
        (element.tagName === "H1" && startDate() === null) ||
        element.tagName === "LI";
      if (!isH1andDated) {
        element.classList.remove(opposites[className]);
        element.classList.add(className);
      }
    });
  };

  const fadeAndSet = (nextElement, funcs) => {
    document.getElementById(nextElement).disabled = true;
    doTheFade("fade-out");
    setTimeout(() => {
      funcs.forEach((item) => {
        item["func"](item["value"]);
      });
      doTheFade("fade-in");
    }, 1000);
  };

  const afterIntro = () => {
    fadeAndSet("next-button", [{ func: setStep, value: "tell-me" }]);
  };

  const collectSavings = (event) => {
    event.preventDefault();
    const {
      target: {
        savings: { value: savings },
      },
    } = event;

    if (!isNaN(savings) && Number(savings) > 0) {
      fadeAndSet("next-form", [
        { func: setStep, value: "give-dates" },
        { func: setSavings, value: Number(savings) },
      ]);
    }
  };

  const grabStartDate = (event) => {
    event.preventDefault();
    const {
      target: {
        formStart: { value: formStart },
      },
    } = event;

    if (!isNaN(Date.parse(formStart))) {
      fadeAndSet("next-form", [
        { func: setStartDate, value: new Date(formStart) },
      ]);
    }
  };

  const grabEndDate = (event) => {
    event.preventDefault();
    const {
      target: {
        formEnd: { value: formEnd },
      },
    } = event;

    if (!isNaN(Date.parse(formEnd))) {
      fadeAndSet("next-form", [
        { func: setEndDate, value: new Date(formEnd) },
        { func: setStep, value: "done" },
      ]);
    }
  };

  return (
    <div>
      <div className="story" style={{ height: "50vh" }}>
        {(() => {
          switch (step()) {
            case "start":
              return (
                <div className="fade-in">
                  <h1>Welcome to the living expense app.</h1>
                  <p>
                    Input financial data with customizable fields in order to
                    calculate expenses according to time.
                  </p>
                  <button id="next-button" onClick={afterIntro}>
                    Next
                  </button>
                </div>
              );
            case "tell-me":
              return (
                <div className="fade-in">
                  <h1>Okay, let's start.</h1>
                  <form onSubmit={collectSavings}>
                    <fieldset id="next-form">
                      <label for="savings">
                        Tell me what how much savings you are starting on.
                      </label>
                      <input type="number" name="savings" />
                      <button type="submit">Next</button>
                    </fieldset>
                  </form>
                </div>
              );

            case "give-dates":
              return (
                <div>
                  <h1 className="fade-in">Time projection</h1>
                  {startDate() === null ? (
                    <form onSubmit={grabStartDate} className="fade-in">
                      <fieldset id="next-form">
                        <label for="formStart">
                          What is the starting date for calculation?
                        </label>
                        <input type="date" name="formStart" />
                        <button type="submit">Next</button>
                      </fieldset>
                    </form>
                  ) : (
                    <form onSubmit={grabEndDate} className="fade-in">
                      <fieldset id="next-form">
                        <label for="formEnd">... and it's ending date?</label>
                        <input
                          type="date"
                          name="formEnd"
                          value={startDate().toISOString().split("T")[0]}
                          min={
                            new Date(
                              startDate().setDate(startDate().getDate() + 7)
                            )
                              .toISOString()
                              .split("T")[0]
                          }
                        />
                        <button type="submit">Next</button>
                      </fieldset>
                    </form>
                  )}
                </div>
              );
            case "done":
              return (
                <div className="fade-in">
                  <h1>All done.</h1>
                  <p>
                    We will next input some expenses to project your future
                    savings.
                  </p>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
      <div className="story" style={{ paddingTop: "40px" }}>
        <div>
          <ul>
            {savings() !== null && (
              <li className="fade-in">savings: {savings()} </li>
            )}

            {startDate() !== null && (
              <li className="fade-in">
                start date: {startDate().toISOString().split("T")[0]}{" "}
              </li>
            )}
            {endDate() !== null && (
              <li className="fade-in">
                end date: {endDate().toISOString().split("T")[0]}{" "}
              </li>
            )}
          </ul>
        </div>
        {startDate()}
      </div>
    </div>
  );
};

export default HomePage;
