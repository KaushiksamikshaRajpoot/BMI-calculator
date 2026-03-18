import { useMemo, useState } from "react";
import "./BmiCalculator.css";

type UnitSystem = "metric" | "us" | "";

const BmiCalculator = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [weightKilogram, setWeightKilogram] = useState<string>("");
  const [weightPound, setWeightPound] = useState<string>("");

  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const getBmiStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Healthy Weight";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const calculateBMI = () => {
    setError("");

    const feet = Number(heightFeet);
    const inches = Number(heightInches);

    if (heightFeet === "" || heightInches === "") {
      setError("Please enter height in feet and inches.");
      setBmi(null);
      setBmiStatus("");
      return;
    }

    if (feet < 0 || inches > 11) {
      setError(
        "Height cannot be negative and height in inches is less than or equal to 11 .",
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
    const Bmi = Number(bmiValue.toFixed(1));

    setBmi(Bmi);
    setBmiStatus(getBmiStatus(Bmi));
  };

  const needleRotation = useMemo(() => {
    if (bmi === null) return -90;

    const clampedBmi = Math.max(10, Math.min(bmi, 40));
    const minBmi = 10;
    const maxBmi = 40;
    const angle = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 180 - 90;

    return angle;
  }, [bmi]);

  const tips = useMemo(() => {
    if (bmi === null) {
      return {
        title: "Health Insights:",
        summary:
          "Enter your height and weight to get BMI result and personalized health tips.",
        steps: [
          "Aim for balanced meals",
          "Include colorful fruits and vegetables",
          "Choose whole grains over refined ones",
        ],
        suggestions: [
          "Regular physical activity: aim for 150 minutes per week",
          "Try yoga, walking, jogging, or cycling",
          "Consult a qualified professional for personalized advice",
        ],
      };
    }

    if (bmi < 18.5) {
      return {
        title: "Health Insights:",
        summary:
          "Your BMI is in the Underweight range. Focus on nutritious, calorie-dense meals and strength-building activities.",
        steps: [
          "Eat small frequent meals",
          "Include protein-rich foods",
          "Add healthy fats like nuts and seeds",
        ],
        suggestions: [
          "Strength training can help build muscle mass",
          "Do not skip meals",
          "Consult a qualified professional if weight loss is unintentional",
        ],
      };
    }

    if (bmi < 25) {
      return {
        title: "Health Insights:",
        summary:
          "Your BMI is in the Healthy Weight range. Maintain your current habits with balanced nutrition and regular activity.",
        steps: [
          "Aim for balanced meals",
          "Include colorful fruits and vegetables",
          "Stay hydrated and sleep well",
        ],
        suggestions: [
          "Regular physical activity: aim for 150 minutes per week",
          "Mix cardio with strength training",
          "Continue healthy routines consistently",
        ],
      };
    }

    if (bmi < 30) {
      return {
        title: "Health Insights:",
        summary:
          "Your BMI is in the Overweight range. Gradual lifestyle changes can support healthy weight management.",
        steps: [
          "Aim for balanced meals",
          "Include colorful fruits and vegetables",
          "Choose whole grains over refined ones",
        ],
        suggestions: [
          "Regular physical activity: aim for 150 minutes per week",
          "Try yoga and pranayama",
          "Consult a qualified professional",
        ],
      };
    }

    return {
      title: "Health Insights:",
      summary:
        "Your BMI is in the Obese range. A structured plan with healthy eating and regular activity can be helpful.",
      steps: [
        "Control portion sizes",
        "Limit sugary drinks and processed foods",
        "Increase fiber and protein intake",
      ],
      suggestions: [
        "Start with low-impact exercise like walking",
        "Build sustainable daily habits",
        "Consult a qualified professional for guidance",
      ],
    };
  }, [bmi]);

  return (
    <div className="bmi-page">
      <div className="bmi-card">
        <h1 className="bmi-title">BMI Calculator</h1>

        <div className="unit-toggle">
          <button
            className={`toggle-btn ${unitSystem === "metric" ? "active" : ""}`}
            onClick={() =>
              setUnitSystem(unitSystem === "metric" ? "" : "metric")
            }
            type="button"
          >
            Metric (kg, feet/inches)
          </button>

          <button
            className={`toggle-btn ${unitSystem === "us" ? "active" : ""}`}
            onClick={() => setUnitSystem(unitSystem === "us" ? "" : "us")}
            type="button"
          >
            US Customary (lbs, feet/inches)
          </button>
        </div>

        <div className="form-section">
          <label className="section-label">Height:</label>

          <div className="input-row">
            <div className="input-box">
              <input
                type="number"
                min="0"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                placeholder="Feet"
              />
              <span className="unit-text">ft</span>
            </div>

            <div className="input-box">
              <input
                type="number"
                min="0"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                placeholder="Inches"
              />
              <span className="unit-text">in</span>
            </div>
          </div>

          <label className="section-label">Weight:</label>

          <div className="input-row">
            {unitSystem === "metric" ? (
              <div className="input-box full-width">
                <input
                  type="number"
                  min="0"
                  value={weightKilogram}
                  onChange={(e) => setWeightKilogram(e.target.value)}
                  placeholder="Kilograms (kg)"
                />
                <span className="unit-text">kg</span>
              </div>
            ) : (
              <div className="input-box full-width">
                <input
                  type="number"
                  min="0"
                  value={weightPound}
                  onChange={(e) => setWeightPound(e.target.value)}
                  placeholder="Pounds (lbs)"
                />
                <span className="unit-text">lbs</span>
              </div>
            )}
          </div>

          <button
            className="calculate-btn"
            onClick={calculateBMI}
            type="button"
          >
            Calculate BMI
          </button>

          {error && <p className="error-text">{error}</p>}

          <div className="gauge-card">
            <div className="gauge-wrapper">
              <div className="gauge-segment underweight-segment"></div>
              <div className="gauge-segment healthy-segment"></div>
              <div className="gauge-segment overweight-segment"></div>
              <div className="gauge-segment obese-segment"></div>

              <div
                className="gauge-needle"
                style={{
                  transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                }}
              >
                <div className="needle-line"></div>
                <div className="needle-center"></div>
              </div>

              <div className="gauge-label gauge-underweight">Underweight</div>
              <div className="gauge-label gauge-healthy">Healthy Weight</div>
              <div className="gauge-label gauge-overweight">Overweight</div>
              <div className="gauge-label gauge-obese">Obese</div>
            </div>

            <p className="bmi-display">
              BMI: <strong>{bmi !== null ? bmi : "--"}</strong>
            </p>

            {bmiStatus && (
              <p className="status-text">
                Status: <strong>{bmiStatus}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="tips-card">
        <h2>Personalized Health Tips</h2>

        <div className="tips-content">
          <h3>{tips.title}</h3>
          <p>{tips.summary}</p>

          <h3>Practical Steps for Weight Management:</h3>
          <ul>
            {tips.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>

          <h3>Diet & Activity Suggestions (Indian & Global Context)</h3>
          <ul>
            {tips.suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BmiCalculator;
