import { useState } from "react";
import "./BmiCalculator.css";

type UnitSystem = "metric" | "us";

const BmiCalculator = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  const [heightFeet, setHeightFeet] = useState<string>("5");
  const [heightInches, setHeightInches] = useState<string>("8");
  const [weightKilogram, setWeightKilogram] = useState<string>("");
  const [weightPound, setWeightPound] = useState<string>("");

  const [bmi, setBmi] = useState<number | null>(28.5);
  const [bmiStatus, setBmiStatus] = useState<string>("Overweight");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  const getBmiStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Healthy Weight";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const getSuggestion = async (
    bmiValue: number,
    bmiStatusValue: string,
    currentWeightInKg: number,
  ) => {
    try {
      setLoading(true);
      setError("");
      setSuggestion("");

      const payload = {
        bmi: bmiValue,
        bmiStatus: bmiStatusValue,
        heightFeet,
        heightInches,
        weight:
          unitSystem === "metric"
            ? weightKilogram
            : Number(currentWeightInKg.toFixed(1)),
        unitSystem,
      };

      const response = await fetch("http://localhost:5000/api/suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setSuggestion("Failed to fetch suggestion.");
        return;
      }

      setSuggestion(data.suggestion);
    } catch (err) {
      console.error(err);
      setSuggestion("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    setError("");
    setSuggestion("");

    const feet = Number(heightFeet);
    const inches = Number(heightInches);

    if (heightFeet === "" || heightInches === "") {
      setError("Please enter height in feet and inches.");
      setBmi(null);
      setBmiStatus("");
      return;
    }

    if (feet < 0 || inches < 0 || inches > 11) {
      setError(
        "Height cannot be negative and inches must be between 0 and 11.",
      );
      setBmi(null);
      setBmiStatus("");
      return;
    }

    if (unitSystem === "metric" && weightKilogram === "") {
      setError("Please enter weight in kilograms.");
      setBmi(null);
      setBmiStatus("");
      return;
    }

    if (unitSystem === "us" && weightPound === "") {
      setError("Please enter weight in pounds.");
      setBmi(null);
      setBmiStatus("");
      return;
    }

    const totalInches = feet * 12 + inches;
    const heightInMeters = totalInches * 0.0254;

    if (heightInMeters <= 0) {
      setError("Height must be greater than 0.");
      setBmi(null);
      setBmiStatus("");
      return;
    }

    let weightInKg = 0;

    if (unitSystem === "metric") {
      weightInKg = Number(weightKilogram);
    } else {
      weightInKg = Number(weightPound) * 0.45359237;
    }

    if (weightInKg <= 0) {
      setError("Weight must be greater than 0.");
      setBmi(null);
      setBmiStatus("");
      return;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const finalBmi = Number(bmiValue.toFixed(1));
    const finalStatus = getBmiStatus(finalBmi);

    setBmi(finalBmi);
    setBmiStatus(finalStatus);
    getSuggestion(finalBmi, finalStatus, weightInKg);
  };

  return (
    <div className="bmi-page" style={{ display: "flex" }}>
      <div className="bmi-card" style={{ width: "50%" }}>
        <h1 className="bmi-title">BMI Calculator</h1>

        <div className="unit-toggle">
          <button
            className={`toggle-btn ${unitSystem === "metric" ? "active" : ""}`}
            onClick={() => setUnitSystem("metric")}
          >
            Metric (kg, feet/inches)
          </button>

          <button
            className={`toggle-btn ${unitSystem === "us" ? "active" : ""}`}
            onClick={() => setUnitSystem("us")}
          >
            US Customary (lbs, feet/inches)
          </button>
        </div>

        <div className="form-section">
          <label className="section-label">Height:</label>

          <div className="input-row">
            <div className="input-box">
              <span className="input-icon">📏</span>
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
              />
              <span className="input-unit">ft</span>
              <span className="input-placeholder">Feet</span>
            </div>

            <div className="input-box">
              <span className="input-icon">↕</span>
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
              />
              <span className="input-unit">in</span>
              <span className="input-placeholder">Inches</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <label className="section-label">Weight:</label>

          <div className="weight-label-row">
            <span className="weight-label-spacer"></span>
            <span className="weight-label-text">
              {unitSystem === "metric" ? "Kilograms (kg)" : "Pounds (lbs)"}
            </span>
          </div>

          <div className="input-row">
            {unitSystem === "metric" ? (
              <>
                <div className="select-box large">
                  <span className="input-icon">⚖</span>
                  <input
                    type="number"
                    placeholder="Kilograms (kg)"
                    value={weightKilogram}
                    onChange={(e) => setWeightKilogram(e.target.value)}
                  />
                  <span className="dropdown-arrow">⌄</span>
                </div>

                <div className="select-box small">
                  <input type="text" value="Pounds (lbs)" />
                  <span className="dropdown-arrow">⌄</span>
                </div>
              </>
            ) : (
              <>
                <div className="select-box large">
                  <span className="input-icon">⚖</span>
                  <input type="text" value="Kilograms (kg)" />
                  <span className="dropdown-arrow">⌄</span>
                </div>

                <div className="select-box small">
                  <input
                    type="number"
                    placeholder="Pounds (lbs)"
                    value={weightPound}
                    onChange={(e) => setWeightPound(e.target.value)}
                  />
                  <span className="dropdown-arrow">⌄</span>
                </div>
              </>
            )}
          </div>
        </div>

        <button className="calculate-btn" onClick={calculateBMI}>
          Calculate BMI
        </button>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="loading-text">Generating suggestion...</p>}

        <div className="gauge-wrapper">
          <div className="gauge">
            <div
              className={`gauge-segment segment-underweight ${bmiStatus === "Underweight" ? "active" : ""}`}
            ></div>
            <div
              className={`gauge-segment segment-healthy ${bmiStatus === "Healthy Weight" ? "active" : ""}`}
            ></div>
            <div
              className={`gauge-segment segment-overweight ${bmiStatus === "Overweight" ? "active" : ""}`}
            ></div>
            <div
              className={`gauge-segment segment-obese ${bmiStatus === "Obese" ? "active" : ""}`}
            ></div>

            <div className="gauge-cutout"></div>

            <span
              className={`gauge-text label-underweight ${bmiStatus === "Underweight" ? "active-text" : ""}`}
            >
              Underweight
            </span>
            <span
              className={`gauge-text label-healthy ${bmiStatus === "Healthy Weight" ? "active-text" : ""}`}
            >
              Healthy Weight
            </span>
            <span
              className={`gauge-text label-overweight ${bmiStatus === "Overweight" ? "active-text" : ""}`}
            >
              Overweight
            </span>
            <span
              className={`gauge-text label-obese ${bmiStatus === "Obese" ? "active-text" : ""}`}
            >
              Obese
            </span>

            <div className="bmi-result">BMI: {bmi !== null ? bmi : "--"}</div>
          </div>
        </div>

        {bmi !== null && (
          <div className="status-box">
            <p>
              <strong>Status:</strong> {bmiStatus}
            </p>
          </div>
        )}
      </div>

      {suggestion && (
        <div className="suggestion-box" style={{ width: "50%" }}>
          <h1 className="bmi-title">Suggestion</h1>
          <p> {suggestion} </p>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;
