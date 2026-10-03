const OptionCard = ({ option, selected, multiple, onSelect }) => {
    const handleRadioKeyDown = (event) => {
        if (multiple || !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) {
            return;
        }

        event.preventDefault();
        const radios = [...event.currentTarget.parentElement.querySelectorAll('[role="radio"]')];
        const currentIndex = radios.indexOf(event.currentTarget);
        const offset = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (currentIndex + offset + radios.length) % radios.length;
        radios[nextIndex].focus();
        radios[nextIndex].click();
    };

    return (
        <button
            className={`onboarding-option${selected ? " is-selected" : ""}`}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => onSelect(option.label)}
            onKeyDown={handleRadioKeyDown}
        >
            <span className="onboarding-option__icon" aria-hidden="true">{option.icon}</span>
            <span className="onboarding-option__label">{option.label}</span>
            <span className="onboarding-option__check" aria-hidden="true">
                {selected ? "✓" : ""}
            </span>
        </button>
    );
};

export default OptionCard;
