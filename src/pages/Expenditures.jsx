import { createSignal, createEffect, onMount } from "solid-js";
import { useParams, useSearchParams, useNavigate } from "@solidjs/router";

const Expenditures = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expenditure, setExpenditure] = createSignal(null);
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
    console.log(expenditure());
  });

  const addFormRow = () => {
    setExpenditure({
      name: "",
      type: "expense",
      amount: 0,
      frequency: "daily",
      when: null,
    });
  };

  const determineWhen = (event) => {
    const {
      target: { value: frequency },
    } = event;

    setExpenditure({ ...expenditure(), frequency: frequency });
  };

  const { start, end, savings } = params;

  console.log(expenditure() !== null);

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
              <li>{start}</li>
              <li>{end}</li>
              <li>{savings}</li>
            </ul>
            <button onClick={addFormRow} disabled={expenditure() !== null}>
              Add expenditure
            </button>
          </div>

          <div>
            <form className="expenditure">
              <fieldset>
                {expenditure() !== null && (
                  <div className="fade-in">
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
                    )}
                  </div>
                )}
              </fieldset>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Expenditures;
