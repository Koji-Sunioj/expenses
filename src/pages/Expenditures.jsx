import { createSignal, createEffect, onMount } from "solid-js";
import { useSearchParams, useNavigate } from "@solidjs/router";

const Expenditures = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expenditures, setExpenditures] = createSignal([]);

  const params = {
    start: searchParams.start || null,
    end: searchParams.end || null,
    savings: searchParams.savings || null,
  };
  const isParamNull = Object.values(params).some((param) => param === null);

  const goBack = () => {
    setTimeout(() => {
      navigate("/");
      alert("please enter your values");
    }, 2000);
  };

  onMount(async () => {
    isParamNull && goBack();
  });

  createEffect(() => {
    console.log(expenditures());
  });

  const WhenDiv = (frequency) => (
    <div>
      <label for="when">{frequency} on day</label>
      {() => {
        switch (frequency) {
          case "weekly":
            return (
              <select name="when" required>
                <option value="monday">monday</option>
                <option value="tuesday">tuesday</option>
                <option value="wednesday">wednesday</option>
                <option value="thursday">thursday</option>
                <option value="friday">friday</option>
                <option value="saturday">saturday</option>
                <option value="sunday">sunday</option>
              </select>
            );
          case "monthly":
            const days = [...Array(31).keys()];
            return (
              <select name="when" required>
                {days.map((day) => (
                  <option value={day + 1}>{day + 1}</option>
                ))}
              </select>
            );
        }
      }}
    </div>
  );

  const handleWhenDiv = (boolean, targetDiv, frequency) => {
    if (boolean) {
      const whenDiv = WhenDiv(frequency);
      targetDiv.appendChild(whenDiv);
    } else {
      targetDiv.innerHTML = "";
    }
  };

  const determineWhen = (event) => {
    const {
      target: { value: frequency },
    } = event;
    const targetDiv = document.getElementById("whenDiv");
    handleWhenDiv(frequency !== "daily", targetDiv, frequency);
  };

  const getExpenditure = (event) => {
    event.preventDefault();
    const {
      target: {
        name: { value: name },
        type: { value: type },
        amount: { value: amount },
        frequency: { value: frequency },
      },
    } = event;
    const when = event.target.when ? event.target.when.value : null;
    const existingIndex = expenditures().findIndex(
      (expenditure) => expenditure.name === name
    );

    if (existingIndex === -1) {
      setExpenditures([
        ...expenditures(),
        { name, type, amount, frequency, when },
      ]);
    } else {
      const tempArr = [...expenditures()];
      tempArr[existingIndex] = { name, type, amount, frequency, when };
      setExpenditures(tempArr);
    }
    document.getElementById("whenDiv").innerHTML = "";
    document.getElementById("expenditure-form").reset();
  };

  const fillForm = (expenditureName) => {
    const expenditure = expenditures().find(
      (expenditure) => expenditure.name === expenditureName
    );
    const { when, frequency } = expenditure;
    const existingExpenditure =
      document.querySelector("input[name=name]").value;
    const targetDiv = document.getElementById("whenDiv");

    if (existingExpenditure === expenditureName) {
      targetDiv.innerHTML = "";
      document.getElementById("expenditure-form").reset();
    } else {
      handleWhenDiv(
        when !== null && !targetDiv.hasChildNodes(),
        targetDiv,
        frequency
      );

      Object.keys(expenditure).forEach((key) => {
        const selector =
          key === "name" || key === "amount" ? "input" : "select";

        expenditure[key] !== null &&
          Object.assign(document.querySelector(`${selector}[name=${key}]`), {
            value: expenditure[key],
          });
      });
    }
  };

  const { start, end, savings } = params;

  return (
    <div className="story fade-in">
      <div>
        <h1>This is the expense page</h1>
        <p>Add custom parameters to view time projection of finances.</p>
      </div>
      {!isParamNull && (
        <>
          <div>
            <ul>
              <li>savings: {savings}</li>
              <li>start date: {start}</li>
              <li>end date: {end}</li>
              {expenditures().map((expenditure) => {
                const { name, type, when, amount, frequency } = expenditure;
                return (
                  <li key={name} className="fade-in">
                    <button
                      className="li-button"
                      onClick={() => {
                        fillForm(name);
                      }}
                    >
                      {frequency} {type} of &euro;{amount} for "{name}"{" "}
                      {when && `on day ${when}`}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <form id="expenditure-form" onSubmit={getExpenditure}>
              <fieldset>
                <div className="fade-in">
                  <div className="form-input">
                    <div>
                      <label for="name">name</label>
                      <input type="text" name="name" required />
                    </div>
                    <div>
                      <label for="type">type</label>
                      <select name="type" required>
                        <option value="expense">expense</option>
                        <option value="deposit">deposit</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-input">
                    <div>
                      <label for="amount">amount</label>
                      <input type="number" name="amount" required />
                    </div>
                    <div>
                      <label for="frequency">frequency</label>
                      <select
                        name="frequency"
                        onChange={determineWhen}
                        required
                      >
                        <option value="daily">daily</option>
                        <option value="monthly">monthly</option>
                        <option value="weekly">weekly</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="form-input"
                    style={{ width: "50%" }}
                    id="whenDiv"
                  ></div>
                  <button type="submit">Submit Expenditure</button>
                </div>
              </fieldset>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Expenditures;

/* 
<div className="form-input">
                      <div>
                        <label for="name">name</label>
                        <input
                          type="text"
                          name="name"
                          value={expenditure().name}
                        />
                      </div>
                      <div>
                        <label for="type">type</label>
                        <select name="type" value={expenditure().type}>
                          <option value="deposit">deposit</option>
                          <option value="expense">expense</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-input">
                      <div>
                        <label for="amount">amount</label>
                        <input
                          type="number"
                          name="amount"
                          value={expenditure().amount}
                        />
                      </div>
                      <div>
                        <label for="frequency">frequency</label>
                        <select
                          name="frequency"
                          value={expenditure().frequency}
                          onChange={determineWhen}
                        >
                          <option value="daily">daily</option>
                          <option value="monthly">monthly</option>
                          <option value="weekly">weekly</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-input" style={{ width: "50%" }}></div>
                    {expenditure().frequency !== "daily" && (
                      <div className="form-input" style={{ width: "50%" }}>
                        <div>
                          <label for="when">
                            {expenditure().frequency} on day
                          </label>
                          {() => {
                            switch (expenditure().frequency) {
                              case "weekly":
                                return (
                                  <select
                                    name="when"
                                    value={expenditure().when || "monday"}
                                  >
                                    <option value="monday">monday</option>
                                    <option value="tuesday">tuesday</option>
                                    <option value="wednesday">wednesday</option>
                                    <option value="thursday">thursday</option>
                                    <option value="friday">friday</option>
                                    <option value="saturday">saturday</option>
                                    <option value="sunday">sunday</option>
                                  </select>
                                );
                              case "monthly":
                                const days = [...Array(31).keys()];
                                return (
                                  <select
                                    name="when"
                                    value={expenditure().when || 1}
                                  >
                                    {days.map((day) => (
                                      <option value={day}>{day}</option>
                                    ))}
                                  </select>
                                );
                            }
                          }}
                        </div>
                      </div>
                    )} */
