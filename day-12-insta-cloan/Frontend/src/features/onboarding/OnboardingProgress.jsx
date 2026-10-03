const OnboardingProgress = ({ step }) => (
    <div className="onboarding-progress" aria-label={`Step ${step + 1} of 3`}>
        <div className="onboarding-progress__labels">
            <span>Step {step + 1} of 3</span>
        </div>
        <div className="onboarding-progress__track" aria-hidden="true">
            {[0, 1, 2].map(index => (
                <span
                    className={index <= step ? "is-active" : ""}
                    key={index}
                />
            ))}
        </div>
    </div>
);

export default OnboardingProgress;
