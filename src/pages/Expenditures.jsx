import { createSignal, createEffect, onMount } from "solid-js";
import { useSearchParams, useNavigate } from "@solidjs/router";

const Expenditures = () => {
  const [formStep, setFormStep] = createSignal("add");
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
      targetDiv.innerHTML = "";
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

  const submitExpenditure = (event) => {
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
    const { length: expCount } = expenditures();
    const [step, index] = formStep().split(" ");

    const thatExpExists = expenditures().some(
      (expenditure) =>
        expenditure.name === name && expenditure.index !== Number(index)
    );

    const action =
      expCount > 10 && step === "add"
        ? "do nothing"
        : thatExpExists
        ? "exists"
        : step;

    switch (action) {
      case "add":
        setExpenditures([
          ...expenditures(),
          { name, type, amount, frequency, when, index: expCount },
        ]);
        break;
      case "update":
        const tempArr = [...expenditures()];
        const existingIndex = tempArr[Number(index)].index;
        tempArr[Number(index)] = {
          name,
          type,
          amount,
          frequency,
          when,
          index: existingIndex,
        };
        setExpenditures(tempArr);
        break;
      case "exists":
        alert("expenditure with that name exists");
        break;
      case "do nothing":
        alert("max expenditure is 10 habibi");
        break;
    }

    if (["add", "update"].includes(action)) {
      resetForm();
    }
  };

  const fillForm = (index) => {
    const expenditure = expenditures()[index];
    const { when, frequency } = expenditure;
    const [, someIndex] = formStep().split(" ");
    const targetDiv = document.getElementById("whenDiv");

    if (Number(someIndex) === index) {
      resetForm();
    } else {
      handleWhenDiv(
        when !== null && !targetDiv.hasChildNodes(),
        targetDiv,
        frequency
      );

      Object.keys(expenditure).forEach((key) => {
        if (key === "index") {
          return;
        }
        const selector =
          key === "name" || key === "amount" ? "input" : "select";

        expenditure[key] !== null &&
          Object.assign(document.querySelector(`${selector}[name=${key}]`), {
            value: expenditure[key],
          });
      });
      setFormStep(`update ${index}`);
    }
  };

  const deleteExpenditure = (index) => {
    const tempArr = [...expenditures()];
    tempArr.splice(index, 1);
    const reIndexed = tempArr.map((item, index) => {
      return { ...item, index: index };
    });
    resetForm();
    setExpenditures(reIndexed);
  };

  const resetForm = () => {
    document.getElementById("whenDiv").innerHTML = "";
    document.getElementById("expenditure-form").reset();
    setFormStep("add");
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
                const { name, type, when, amount, frequency, index } =
                  expenditure;
                return (
                  <li key={index} className="fade-in">
                    <button
                      className="li-button"
                      onClick={() => {
                        fillForm(index);
                      }}
                    >
                      {frequency} {type} of &euro;{amount} for "{name}"{" "}
                      {when && `on day ${when}`}
                    </button>
                  </li>
                );
              })}
            </ul>
            {expenditures().some(
              (expenditure) =>
                expenditure.when > 28 && expenditure.frequency === "monthly"
            ) && (
              <i>
                monthly expenditures occurring after day 28 may be shifted
                depending on number of days in that month.
              </i>
            )}
          </div>
          <div>
            <form id="expenditure-form" onSubmit={submitExpenditure}>
              <h2>{formStep().split(" ")[0]} an expenditure</h2>
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
                      <input type="number" name="amount" required step=".01" />
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

                  <button type="submit" className="btn-submit">
                    Submit
                  </button>
                  {formStep().includes("update") && (
                    <button
                      className="fade-in btn-delete"
                      style={{ "margin-left": "10px" }}
                      onClick={() => {
                        deleteExpenditure(Number(formStep().split(" ")[1]));
                      }}
                    >
                      Delete
                    </button>
                  )}
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
