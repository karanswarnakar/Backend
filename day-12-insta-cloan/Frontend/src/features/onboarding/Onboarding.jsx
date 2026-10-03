import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth.js";
import OnboardingProgress from "./OnboardingProgress.jsx";
import OptionCard from "./OptionCard.jsx";
import { ONBOARDING_STEPS } from "./onboarding.service.js";
import "./onboarding.scss";

const Onboarding = () => {
    const { user, handleSaveOnboarding } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [leaving, setLeaving] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [responses, setResponses] = useState(() => ({
        discoverySource: user?.onboarding?.discoverySource ?? "",
        goals: user?.onboarding?.goals ?? [],
        interests: user?.onboarding?.interests ?? []
    }));
    const transitionTimer = useRef(null);

    useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

    const currentStep = ONBOARDING_STEPS[step];

    const selectOption = (value) => {
        setError("");
        const field = currentStep.field;
        setResponses(current => {
            if (!currentStep.multiple) {
                return {
                    ...current,
                    [field]: current[field] === value ? "" : value
                };
            }

            const selected = current[field];
            return {
                ...current,
                [field]: selected.includes(value)
                    ? selected.filter(item => item !== value)
                    : [...selected, value]
            };
        });
    };

    const moveToStep = (nextStep) => {
        setDirection(nextStep > step ? 1 : -1);
        setLeaving(true);
        window.clearTimeout(transitionTimer.current);
        transitionTimer.current = window.setTimeout(() => {
            setStep(nextStep);
            setLeaving(false);
        }, 170);
    };

    const finishOnboarding = async () => {
        if (saving) return;
        setSaving(true);
        setError("");
        try {
            await handleSaveOnboarding(responses);
            navigate("/", { replace: true });
        } catch (saveError) {
            setError(saveError.response?.data?.message ?? "We couldn't save your choices. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="onboarding">
            <header className="onboarding-brand">
                <Link to="/" aria-label="Socially home">Socially</Link>
            </header>

            <section className="onboarding-card" aria-labelledby="onboarding-title">
                <OnboardingProgress step={step} />

                <div
                    className={`onboarding-step${leaving ? ` is-leaving-${direction > 0 ? "left" : "right"}` : ""}`}
                    key={step}
                >
                    <h1 id="onboarding-title">{currentStep.title}</h1>
                    <p className="onboarding-step__subtitle">{currentStep.subtitle}</p>

                    <div
                        className="onboarding-options"
                        role={currentStep.multiple ? "group" : "radiogroup"}
                        aria-label={currentStep.title}
                    >
                        {currentStep.options.map(option => {
                            const selected = currentStep.multiple
                                ? responses[currentStep.field].includes(option.label)
                                : responses[currentStep.field] === option.label;

                            return (
                                <OptionCard
                                    key={option.label}
                                    option={option}
                                    selected={selected}
                                    multiple={currentStep.multiple}
                                    onSelect={selectOption}
                                />
                            );
                        })}
                    </div>
                </div>

                {error && <p className="onboarding-error" role="alert">{error}</p>}

                <footer className="onboarding-footer">
                    <div className="onboarding-footer__secondary">
                        {step > 0 ? (
                            <button
                                className="onboarding-back"
                                type="button"
                                disabled={saving || leaving}
                                onClick={() => moveToStep(step - 1)}
                            >
                                <span aria-hidden="true">←</span> Back
                            </button>
                        ) : <span />}
                        <button
                            className="onboarding-skip"
                            type="button"
                            disabled={saving}
                            onClick={finishOnboarding}
                        >
                            Skip for now
                        </button>
                    </div>
                    {step < ONBOARDING_STEPS.length - 1 ? (
                        <button
                            className="onboarding-continue"
                            type="button"
                            disabled={saving || leaving}
                            onClick={() => moveToStep(step + 1)}
                        >
                            Continue <span aria-hidden="true">→</span>
                        </button>
                    ) : (
                        <button
                            className="onboarding-continue"
                            type="button"
                            disabled={saving || leaving}
                            onClick={finishOnboarding}
                        >
                            {saving ? "Saving..." : "Get Started"} <span aria-hidden="true">→</span>
                        </button>
                    )}
                </footer>
                <p className="onboarding-privacy">You can update your preferences later.</p>
            </section>
        </main>
    );
};

export default Onboarding;
